import React, { useEffect, useState } from 'react';
import './EditPlayerProfile.css';
import { TbShirt } from "react-icons/tb";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../app/firebase/clientApp";
import EditPlayerPhoto from '../EditPlayerPhoto/EditPlayerPhoto';
import { MdDone } from "react-icons/md";

function EditPlayerProfile({ playerId }) {
    if (!playerId) {
        return <div>Invalid player ID.</div>;
    }

    const playerRef = doc(db, "players", playerId);
    const [playerData, playerLoading, playerError] = useDocument(playerRef);
    const player = playerData?.data();
    const [playerName, setPlayerName] = useState("");
    const [originalName, setOriginalName] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);
    const [successMessage, setSuccessMessage] = useState(""); // Success message state

    useEffect(() => {
        // Only initialize playerName and originalName when the player data is fetched
        if (player && !isInitialized) {
            setPlayerName(player.name || "");
            setOriginalName(player.name || "");
            setIsInitialized(true);
        }
    }, [player, isInitialized]);

    if (playerLoading) {
        return <div>Loading player data...</div>;
    }

    if (playerError) {
        return <div>Error fetching player data: {playerError.message}</div>;
    }

    const handleNameUpdate = async () => {
        try {
            await updateDoc(playerRef, { name: playerName });
            setOriginalName(playerName); // Update the originalName after saving
            setSuccessMessage("تم حفظ الاسم بنجاح!"); // Set success message
            setTimeout(() => setSuccessMessage(""), 3000); // Clear the message after 3 seconds
        } catch (error) {
            console.error("Error updating player name: ", error);
        }
    };

    // Determine if the "Save" button should be shown
    const showSaveButton = playerName !== originalName;

    return (
        <div className='p-3'>
            <div className='settings-section__header pb-3 text-center mb-2 fs-5'>
                تعديل الملف الشخصي
            </div>
            <div className='settings-section__body'>
                <EditPlayerPhoto playerId={playerId} />
                <div className='row m-0 mt-3'>
                    <div className='input-container col p-0'>
                        <TbShirt className='fs-4 input-icon' />
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="ادخل اسمك"
                            className='w-100 pe-5 input-2'
                        />
                    </div>
                    {showSaveButton && (
                        <button onClick={handleNameUpdate} className='main-btn me-2 col-2'>
                            <MdDone />
                        </button>
                    )}
                </div>
                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditPlayerProfile;
