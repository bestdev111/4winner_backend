const axios = require("axios");
const User = require("../models/user")
const Role = require("../models/role")
const Bet = require("../models/bet")

const betService = async () => {
    try {
        const today = new Date();
        const date = today.getFullYear() + "-" + (today.getMonth()+1)+ "-" + today.getDate()
        const url = `https://m.4winners.bet/Home/GetFinishedMatches?` + `betradarSportType=&` + `date=${date}`;
        const { data } = await axios.get(
            url,
            { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36' } }
        )
            .then(data => {
                if (data) {
                    console.log('get result success!=>');
                    compareMatchResult(data)
                }
            }).catch(console.log('Failed get result'))
    } catch (err) {
        console.log("error", err);
    }
};
async function compareMatchResult(data) {
    try {
        if (data) {
            await Bet.find({ state: 0 })
                .then(async bets => {
                    await asyncForEach(bets, async bet => {
                        console.log('bet:', bet);
                        bet.matchId
                        await asyncForEach(data, async resolvedMatch => {
                            if (resolvedMatch.matchId === bet.matchId) {
                                const isResolved = await Bet.findOneAndUpdate(
                                    { _id: bet._id },
                                    { isResolved: 1 },
                                    { new: true, upsert: true, returnOriginal: false },
                                );
                                if (isResolved) {
                                    calculateWinning(resolvedMatch.matchId, bet.matchId);
                                }
                            }
                        })

                    })
                })
        }
    }
    catch(err) {
        console.log(err);
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; ++index) {
        await callback(array[index], index, array);
    }
}
async function calculateWinning(resolvedMatch, resolvedBet) {
    console.log('...calculating win', resolvedMatch, resolvedBet);

}
module.exports = betService;