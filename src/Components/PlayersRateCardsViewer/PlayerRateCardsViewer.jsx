import { useDocument } from "react-firebase-hooks/firestore";
import { doc, getDoc ,updateDoc, increment, arrayUnion} from "firebase/firestore";
import { db } from "../../app/firebase/clientApp";
import React, { useEffect, useState } from "react";
import PlayerRateCard from "../PlayerRateCard/PlayerRateCard";
import { GiSoccerKick } from "react-icons/gi";

function PlayerRateCardsViewer({ matchId }) {
  const gameRef = doc(db, "games", matchId);
  const [gameDoc, loading, error] = useDocument(gameRef);
  const [sortedPlayers, setSortedPlayers] = useState([]);

  useEffect(() => {
    if (gameDoc) {
      const gameData = gameDoc.data();
      const players = gameData?.players || [];

      // Fetch rate data for each player
      const fetchPlayerRates = async () => {
        const playerRates = await Promise.all(
          players.map(async (player) => {
            const rateDocId = `${player.uid}_${matchId}`;
            const rateRef = doc(db, "rates", rateDocId);
            const rateDoc = await getDoc(rateRef); // Use getDoc here
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
        const sorted = playerRates.sort((a, b) => {
          if (b.averageRate === a.averageRate) {
            return b.ratesCount - a.ratesCount;
          }
          return b.averageRate - a.averageRate;
        });

        setSortedPlayers(sorted);
      };

      fetchPlayerRates();
    }
  }, [gameDoc, matchId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }


async function closeVotes() {
    console.log("Closing votes for match:", matchId);

    // Disable rating by setting a flag in the game document
    const gameDocRef = doc(db, "games", matchId);
    try {
        await updateDoc(gameDocRef, {
            closedVotes: true, // Mark the votes as closed
            manOfTheMatch: sortedPlayers[0]?.player?.uid, // Set man of the match to the first player in the sorted array
        });
        console.log("Votes closed and man of the match set successfully for match:", matchId);
    } catch (error) {
        console.error("Error closing votes for match:", matchId, error);
    }

    // Update player documents to add the ratings to their cumulative totals and add the game to their games array
    for (const { player, averageRate, ratesCount } of sortedPlayers) {
        console.log(`Processing player: ${player.uid}, Average Rate: ${averageRate}, Rates Count: ${ratesCount}`);

        const playerRef = doc(db, "players", player.uid);
        try {
            // Increment the player's total ratings and rate count
            await updateDoc(playerRef, {
                ratesSum: increment(averageRate * ratesCount), // Add the total rate sum
                ratesCount: increment(ratesCount), // Add the number of ratings
                games: arrayUnion(matchId), // Add the matchId to the player's games array
            });
            console.log(`Successfully updated player: ${player.uid} - New ratesSum, ratesCount, and games array`);
        } catch (error) {
            console.error(`Error updating player: ${player.uid}`, error);
        }
    }

    console.log("Close votes process completed.");
  }



  return (
    <div className="w-100">
      <div className="header-2 mb-4 w-100 d-flex justify-content-center">
        <p className="fs-4 mt-4">
          اللاعبين <GiSoccerKick className="fs-1" />
        </p>
      </div>
      <div className="px-3">
        <ol className="d-flex pe-4 flex-column p-0 player-list gap-4">
            {sortedPlayers.map(({ player, averageRate, ratesCount }) => (
            <li key={player.uid} className="pe-3">
                <PlayerRateCard
                playerId={player.uid}
                matchId={matchId}
                rate={averageRate}
                ratesCount_={ratesCount}
                />
            </li>
            ))}
        </ol>
      </div>
    </div>
  );
}

export default PlayerRateCardsViewer;
