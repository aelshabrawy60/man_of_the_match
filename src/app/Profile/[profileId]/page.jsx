"use client"

import { useParams } from "next/navigation"; // Use next/navigation for routing


export default function ProfilePage() {
    
    const params = useParams(); // Access the matchId from the URL params
    const { profileId } = params;
    return(
        <>
            <div className="fs-1 text-center mt-5">قريبا</div>
        </>
    )
}