"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaMedal } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/firebase/clientApp";
import convertTo12HourFormat from "../../utility/convertTo24";

import "./MatchCard.css";
import PlayerRateCard from "../PlayerRateCard/PlayerRateCard";

function MatchCard({ day, time, location, id }) {
  const [day_, setDay] = useState(day);
  const [time_, setTime] = useState(time);
  const [players, setPlayers] = useState([]);
  const [MOTM, setMOTM] = useState(null); // Store the player ID for MOTM

  useEffect(() => {
    async function fetchData() {
      const gameRef = doc(db, "games", id);
      const gameSnapshot = await getDoc(gameRef);
      const gameData = gameSnapshot.data();
      const playerList = gameData?.players?.map((player) => player.uid);
      setPlayers(playerList || []);
      setTime(convertTo12HourFormat(time));
    }

    fetchData();
  }, [id, time]);

  useEffect(() => {
    async function calcMOTM() {
      const rates = await Promise.all(
        players.map(async (player) => {
          const rateRef = doc(db, "rates", `${player}_${id}`);
          const rateSnapshot = await getDoc(rateRef);
          const rateData = rateSnapshot.data();
          const votes = rateData?.values?.map((item) => item.value) || [];
          if (votes.length === 0) return { player, rate: null };
          const rate = votes.reduce((acc, curr) => acc + curr, 0) / votes.length;
          return { player, rate };
        })
      );

      const validRates = rates.filter((entry) => entry.rate !== null);
      if (validRates.length > 0) {
        const bestPlayer = validRates.reduce((a, b) =>
          a.rate > b.rate ? a : b
        );
        setMOTM(bestPlayer.player); // Set the player ID of the MOTM
      }
    }

    if (players.length > 0) calcMOTM();
  }, [players, id]);

  return (
    <Link href={`/${id}`}>
      <div className="match-card-container">
          <div className="p-4 d-flex py-5 justify-content-between align-items-center gap-4">
            <div className="fs-5 term">{location}</div>
            <div className="mx-3 match-date">{day_.split("-").slice(1).join("-")}</div>
            <div className="fs-5 term">{time_}</div>
          </div>
          <div className="man-of-the-match-card d-flex justify-content-center">
            <div className="man-of-the-match-card__label d-flex align-items-center">
              <FaMedal className="gold-icon ms-2" /> رجل المباراة
            </div>
            <div className="mt-4 w-100 text-center px-4 mb-3">
              {MOTM ? (
                <div className="mt-2"><PlayerRateCard type={1} playerId={MOTM} matchId={id} /></div>
              ) : (
                "لم يتم التحديد بعد"
              )}
            </div>
          </div>
        </div>
    </Link>
  );
}

export default MatchCard;
