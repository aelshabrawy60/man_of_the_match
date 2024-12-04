import { db } from '../../firebase/clientApp';
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    Timestamp,
    withConverter
} from 'firebase/firestore'; // Firestore v9+ modular imports

function calculate_from_to_dates(filter){
    const today = new Date();
    let from = new Date();
    let to = new Date();

    if(filter.type === 'week'){
        // Calculate this week's dates (week starts from Saturday)
        const day = today.getDay();
        // Convert Sunday (0) to 7 for easier calculation
        const adjustedDay = day === 0 ? 7 : day;
        // Saturday is 6, so we subtract the difference to get to last Saturday
        const daysToSubtract = (adjustedDay - 6 + 7) % 7;
        
        from.setDate(today.getDate() - daysToSubtract);
        from.setHours(0, 0, 0, 0);
        
        to = new Date(from);
        to.setDate(from.getDate() + 6);
        to.setHours(23, 59, 59, 999);

    }else if(filter.type === 'month'){
        // Calculate the month dates
        from.setDate(1); // First day of current month
        from.setHours(0, 0, 0, 0);
        
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
        to.setHours(23, 59, 59, 999);

    }else if(filter.type === 'year'){
        // Calculate the year dates
        from = new Date(today.getFullYear(), 0, 1); // January 1st of current year
        from.setHours(0, 0, 0, 0);
        
        to = new Date(today.getFullYear(), 11, 31); // December 31st of current year
        to.setHours(23, 59, 59, 999);
    }

    // Convert dates to Firebase Timestamps for Firestore compatibility
    return {
        "from": Timestamp.fromDate(from),
        "to": Timestamp.fromDate(to)
    };
}


export async function GET(req, res) {
    //take url params from date and to date
    const url = new URL(req.url);
    const filter = url.searchParams.get('filter') || '';
    
    // Create a converter to specify the fields we want
    const converter = {
        toFirestore: () => ({}),
        fromFirestore: (snapshot) => ({
            manOfTheMatch: snapshot.get('manOfTheMatch')
        })
    };

    const collectionRef = collection(db, 'games').withConverter(converter);
    const dates = calculate_from_to_dates({type: filter});

    //a query to get matches between the dates and closedVotes is true and manOfTheMatch is not null
    const q = query(
        collectionRef,
        where('date', '>=', dates.from),
        where('date', '<=', dates.to),
        where('closedVotes', '==', true),
        where('manOfTheMatch', '!=', null)
    );

    const querySnapshot = await getDocs(q);

    const players = querySnapshot.docs.map(doc => doc.data().manOfTheMatch);

    // count the number of times each player appears in the array and store it in an object player id, count
    const playerCounts = players.reduce((acc, playerId) => {
        acc[playerId] = (acc[playerId] || 0) + 1;
        return acc;
    }, {});

    // sort the object by count in descending order
    const sortedPlayerCounts = Object.entries(playerCounts).sort((a, b) => b[1] - a[1]);

    // fetch the player data for each player id
    const playerPromises = sortedPlayerCounts.map(async ([playerId, count]) => {
        const playerRef = doc(db, 'players', playerId);
        const playerDoc = await getDoc(playerRef);
        const playerData = playerDoc.data();
        return {
            playerId,
            count,
            name: playerData.name,
            profilePhoto: playerData.profilePhoto
        };
    });

    // wait for all player promises to resolve
    const playerData = await Promise.all(playerPromises);

    return Response.json(playerData);
}