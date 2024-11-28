import { doc, getDoc } from "firebase/firestore";
import {db} from '../firebase/clientApp'


async function sortPlayers(matchId) {
  const gameRef = doc(db, "games", matchId);
  const gameDoc = await getDoc(gameRef);

  if (!gameDoc.exists()) {
    throw new Error("Game document not found");
  }

  const gameData = gameDoc.data();
  const players = gameData?.players || [];

  // Fetch rate data for each player
  const playerRates = await Promise.all(
    players.map(async (player) => {
      const rateDocId = `${player.uid}_${matchId}`;
      const rateRef = doc(db, "rates", rateDocId);
      const rateDoc = await getDoc(rateRef);
      const rateData = rateDoc.exists() ? rateDoc.data() : null;

      const totalRates =
        rateData?.values?.reduce((acc, rate) => acc + rate.value, 0) || 0;
      const ratesCount = rateData?.values?.length || 0;
      const averageRate = ratesCount > 0 ? totalRates / ratesCount : 0;

      return {
        player,
        averageRate,
        ratesCount,
      };
    })
  );

  // Sort players by averageRate, then by ratesCount in descending order
  return playerRates.sort((a, b) => {
    if (b.averageRate === a.averageRate) {
      return b.ratesCount - a.ratesCount;
    }
    return b.averageRate - a.averageRate;
  });
}

export default sortPlayers