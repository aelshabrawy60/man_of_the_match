"use client";

import { useEffect } from "react";
import useFirestoreLazyLoader from "@/Components/Hooks/useFirestoreLazyLoader";
import MatchCard from "../MatchCard/MatchCard";


function PlayerMatchesViewer({gamesIds}) {
  // Use the custom hook for fetching documents
  const { documents, loading, fetchMore, hasMore } = useFirestoreLazyLoader(
    "games", // Collection name
    gamesIds, // IDs to fetch
    { chunkSize: 10 } // Options (optional)
  );
  
  return (
    <>
        <div className='matches-viewer-container d-flex flex-column align-items-center'>
        <div className='header w-100 text-center py-3 mb-4'>
        <h2 className='m-0'>
        المباريات </h2>
        </div>
        <div className='row m-0 gap-3'>
        {documents && documents.length > 0 ? (
            documents.map(doc => {
            return (
                <div key={doc.docId} className='col-12'>
                    <MatchCard time={String(doc.time)} day={String(doc.day)} id={doc.docId} MOTM={doc?.manOfTheMatch} location={doc.location}/>
                </div>
            );
            })
        ) : (
            <p>لا توجد مباريات</p>
        )}
        </div>
        {hasMore && (
            <button className="main-btn" onClick={fetchMore} disabled={loading}>
            {loading ? "Loading..." : "المزيد"}
            </button>
        )}
    </div>
  </>
  );
}

export default PlayerMatchesViewer