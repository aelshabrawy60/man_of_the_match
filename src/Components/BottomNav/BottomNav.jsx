"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiSoccerKick } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import './BottomNav.css'

const navs_ = [
  { icon: <FaRegUser />, link: '/Profile/1' },
  { icon: <GiSoccerKick />, link: '/Matches' },
  { icon: <IoSettingsOutline />, link: '/Settings' },
];

function BottomNav({ navs = navs_, circleSize = 50 }) {
  const pathname = usePathname();
  const indicatorRef = useRef("")
  
  function getXbyId(id){
    return document.getElementById(id)?.offsetLeft - document.getElementById(id)?.offsetWidth
  }

  function setXbyRef() {
    if (indicatorRef.current) {
      const xPosition = getXbyId(pathname);
      if (xPosition !== undefined) {
        indicatorRef.current.style.left = `${xPosition}px`;
      }
    }
  }
  

  useEffect(()=>{
    setXbyRef()
  }, [pathname])
  return (
    <div className='p-3 nav-bottom-container'>
        <div ref={indicatorRef} className='nav-indicator p-2'>
            <div className='inner-circ'>

            </div>
        </div>
        <div className='d-flex justify-content-around nav-items-p'>
            {navs_.map((nav)=> <Link className={`nav-item-p ${pathname == nav.link ? 'selected-nav': ''}`} key={nav.link} id={nav.link} href={nav.link}>{nav.icon}</Link>)}
        </div>
    </div>
  );
}

export default BottomNav;
