"use client";

import Link from "next/link";
import { FaMedal } from "react-icons/fa";
import convertTo12HourFormat from "../../utility/convertTo24";
import { getDay, getTime } from "@/app/functions/dateF";
import "./MatchCard.css";
import PlayerRateCard from "../PlayerRateCard/PlayerRateCard";

function MatchCard({date, location, id , MOTM}) {

  return (
    
      <div className="match-card-container">
          <Link href={`/${id}`}>
            <div className="p-4 d-flex py-5 justify-content-between align-items-center gap-4">
              <div className="fs-5 term">{location}</div>
              <div className="mx-3 match-date">{getDay(date)}</div>
              <div className="fs-5 term">{convertTo12HourFormat(getTime(date))}</div>
            </div>
          </Link>
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
        
   
  );
}

export default MatchCard;
