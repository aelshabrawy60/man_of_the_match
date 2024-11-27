import { useState, useEffect } from "react";
import { getDocs, query, collection, where, getFirestore } from "firebase/firestore";

const useFirestoreLazyLoader = (collectionName, ids, options) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastFetchedIndex, setLastFetchedIndex] = useState(0);

  const chunkSize = options?.chunkSize || 10; // Default to 10 if chunkSize is not provided

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      const db = getFirestore();
      const nextIds = ids.slice(lastFetchedIndex, lastFetchedIndex + chunkSize);

      if (nextIds.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, collectionName),
          where("__name__", "in", nextIds)
        );

        const querySnapshot = await getDocs(q);
        const fetchedDocs = querySnapshot.docs.map((doc) => ({
          docId: doc.id,  // Make sure you're using docId to prevent confusion with the gameId
          ...doc.data(),
        }));

        // Prevent adding duplicates by checking if the docId is already in the documents state
        setDocuments((prevDocs) => {
          const newDocs = fetchedDocs.filter(
            (newDoc) => !prevDocs.some((doc) => doc.docId === newDoc.docId)
          );
          return [...prevDocs, ...newDocs];
        });

        // Update the index for the next batch
        setLastFetchedIndex((prevIndex) => prevIndex + nextIds.length);
        setHasMore(nextIds.length === chunkSize); // Check if there are more documents to fetch
      } catch (error) {
        console.error("Error fetching documents:", error);
      }

      setLoading(false);
    };

    fetchDocuments();
  }, [collectionName, ids, lastFetchedIndex]);

  const fetchMore = () => {
    if (!loading && hasMore) {
      setLastFetchedIndex(lastFetchedIndex + chunkSize);
    }
  };

  return { documents, loading, fetchMore, hasMore };
};

export default useFirestoreLazyLoader;
