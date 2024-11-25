import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../app/firebase/clientApp"; // Adjust the import path based on your setup
import { FaCamera } from "react-icons/fa6";
import './EditPlayerPhoto.css'

function EditPlayerPhoto({ playerId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [playerPhoto, setPlayerPhoto] = useState(null); // To store the current player's photo
  const [showModal, setShowModal] = useState(false); // To control modal visibility

  // Fetch the current player's photo when the component mounts
  useEffect(() => {
    const fetchPlayerPhoto = async () => {
      try {
        const playerRef = doc(db, "players", playerId);
        const playerDoc = await getDoc(playerRef);
        if (playerDoc.exists()) {
          setPlayerPhoto(playerDoc.data().profilePhoto); // Assuming profilePhoto is the field in Firestore
        }
      } catch (err) {
        console.error("Error fetching player photo:", err);
      }
    };

    fetchPlayerPhoto();
  }, [playerId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setError(null);
      setShowModal(true); // Show the modal when a file is selected
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // Using environment variable for preset

    try {
      // Upload to Cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, // Using environment variable for cloud name
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        // Update Firestore with the uploaded photo URL
        const playerRef = doc(db, "players", playerId);
        await updateDoc(playerRef, { profilePhoto: data.secure_url });
        setPlayerPhoto(data.secure_url); // Update the displayed photo
      } else {
        throw new Error("Failed to upload image.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setUploading(false);
      setFile(null);
      setShowModal(false); // Close the modal after upload
    }
  };

  const handleCancel = () => {
    setFile(null); // Reset file selection
    setShowModal(false); // Close the modal
  };

  return (
    <div style={containerStyle}>
      <div className="change-img-container">
        <img
          src={playerPhoto || "default-photo-url"} // Display current player photo or a placeholder
          alt="Player"
        />
        <button onClick={() => document.getElementById('fileInput').click()} className="edit-photo-btn"><FaCamera /></button>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Modal to show the uploaded photo */}
      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3 style={modalTitleStyle}>Confirm New Photo</h3>
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded Preview"
              style={modalImageStyle}
            />
            <div style={buttonContainerStyle}>
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={saveButtonStyle}
              >
                {uploading ? "Uploading..." : "Save"}
              </button>
              <button onClick={handleCancel} style={cancelButtonStyle}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

// Styles
const containerStyle = {
  padding: "20px",
  fontFamily: "'Arial', sans-serif",
};






const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 1000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)",  // Dark background for dark mode
  width: "100%",
  height: "100%",
};

const modalContentStyle = {
  backgroundColor: "#333",  // Dark background
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
  textAlign: "center",
  color: "#fff",  // White text for dark mode
};

const modalTitleStyle = {
  fontSize: "18px",
  marginBottom: "20px",
};

const modalImageStyle = {
  width: "200px",
  height: "200px",
  objectFit: "cover",
  marginBottom: "20px",
  borderRadius: "50%",  // Circular image in the modal
  border: "3px solid #fff",  // White border for contrast
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-around",
};

const saveButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",  // Green button for saving
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

const cancelButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#dc3545",  // Red button for cancel
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

const errorStyle = {
  color: "red",
  fontSize: "14px",
  textAlign: "center",
  marginTop: "20px",
};

export default EditPlayerPhoto;
