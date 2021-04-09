import { DatabaseService, ObjectId, UserEntity } from "./DatabaseService";
import {calculatePrice, isAllowedTime} from './market';

export class MarketService {


  static async getStocks() {
    const userCollection = await DatabaseService.getCollection(UserEntity);
    const data = ((await userCollection
      .aggregate([
        { $project: { item: 1, stocks: { $objectToArray: "$stocks" } } },
        { $unwind: "$stocks" },
        { $group: { _id: "$stocks.k", total: { $sum: "$stocks.v" } } },
      ])
      .toArray()) as unknown) as { _id: string; total: number }[];
    return Object.fromEntries(data.map(({ _id, total }) => [_id, total]));
  }

  static async trade(
    userId: string,
    candidateId: string,
    amount: number,
    expectedPrice?: number
  ) {
    if(!isAllowedTime()){
      throw new Error("Zurzeit besteht eine Handelssperre.");
      return;
    }
    let userCollection = await DatabaseService.getCollection(UserEntity);
    let user = await userCollection.findOne({ _id: ObjectId(userId) });
    if (!user || !user.active)
      throw new Error("Die Benutzerin oder der Benutzer ist nicht valide.");
    const price = await calculatePrice(
      await this.getStocks(),
      candidateId,
      amount
    );
    if (price !== expectedPrice)
      throw new Error("Die Preise haben sich geändert.");
    if (user.points - price < user.points)
      throw new Error("Die Benutzerin oder der Benutzer hat nicht genug Geld.");
    if (user.stocks[candidateId] + amount < 0)
      throw new Error(
        "Die Benutzerin oder der Benutzer hat nicht genug Aktien."
      );

    await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          points: user.points - price,
          stocks: {
            ...user.stocks,
            [candidateId]: user.stocks[candidateId] + amount,
          },
        },
      }
    );
  }
}
