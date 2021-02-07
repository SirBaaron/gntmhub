import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "../../../util/authorization";
import {
  CandidateEntity,
  DatabaseService,
  UserEntity,
} from "../../../util/DatabaseService";
import { MarketService } from "../../../util/MarketService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const candidateCollection = await DatabaseService.getCollection(
    CandidateEntity
  );
  const candidates = await candidateCollection.find({}).toArray();

  const userCollection = await DatabaseService.getCollection(UserEntity);
  const users = await userCollection.find({}).toArray();
  const user = await getUserFromRequest(req);

  if (!user) {
    res.status(401).json({ errorMessage: "Sie sind nicht angemeldet." });
  } else {
    res.json({
      users: users.map(user => ({ ...user, _id: user._id.toString() })),
      stocks: await MarketService.getStocks(),
      user: { ...user, _id: user._id.toString() },
      candidates: candidates.map(candidate => ({
        ...candidate,
        _id: candidate._id.toString(),
      })),
    });
  }
  console.log("before close");
  await DatabaseService.close();
};
