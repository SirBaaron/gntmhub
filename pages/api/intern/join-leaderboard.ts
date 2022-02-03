import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import {PrismaClient} from '@prisma/client';
import {calculatePrice} from '../../../util/market';

export default withApiAuthRequired(async function test(req, res) {

    const {user: authUser} = getSession(req, res)!;
    const prisma = new PrismaClient();
    if (!req.body.code) {
        res.status(400).json({error: 'Wrong name'});
        return;
    }

    const leaderboard = await prisma.leaderboard.findUnique({where: {code: req.body.code.toUpperCase()}});

    if(!leaderboard){
        res.status(400).json({error: 'Diese Rangliste existiert nicht!'});
        return;
    }
    const membership = await prisma.membership.findUnique({where: {userMail_leaderboardId: {userMail: authUser.email, leaderboardId: leaderboard.id }}});
    if(membership){
        res.status(400).json({error: 'Du bist schon in dieser Rangliste'});
        return;
    }

    await prisma.membership.create({data: {leaderboardId: leaderboard.id, userMail: authUser.email, owner: false}});

    res.status(200).json({});

});