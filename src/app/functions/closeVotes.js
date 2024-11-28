import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import {db} from '../firebase/clientApp'

async function closeVotes(matchId, sortedPlayers) {
    console.log("Closing votes for match:", matchId);

    // Reference to the game document
    const gameDocRef = doc(db, "games", matchId);

    try {
        // Update the game document to close votes and set man of the match
        await updateDoc(gameDocRef, {
            closedVotes: true, // Mark the votes as closed
            manOfTheMatch: sortedPlayers[0]?.player?.uid || null, // Set man of the match
        });
        console.log("Votes closed and man of the match set successfully for match:", matchId);
    } catch (error) {
        console.error("Error closing votes for match:", matchId, error);
        return; // Exit the function on error
    }

    console.log(sortedPlayers);

    // Update each player's document
    for (const { player, averageRate, ratesCount } of sortedPlayers) {
        console.log(`Processing player: ${player.uid}, Average Rate: ${averageRate}, Rates Count: ${ratesCount}`);

        const playerRef = doc(db, "players", player.uid);

        try {
            await updateDoc(playerRef, {
                ratesSum: increment(averageRate * ratesCount), // Add the total rate sum
                ratesCount: increment(ratesCount), // Add the number of ratings
                games: arrayUnion(matchId), // Add the matchId to the player's games array
            });
            console.log(`Successfully updated player: ${player.uid} - Updated ratesSum, ratesCount, and games array`);
        } catch (error) {
            console.error(`Error updating player: ${player.uid}`, error);
        }
    }

    console.log("Close votes process completed.");
}

export default closeVotes