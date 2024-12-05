"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoFootball } from "react-icons/io5";
import { GiSoccerKick } from "react-icons/gi";
import { MdLeaderboard } from "react-icons/md";

import { RiTShirtFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { useUser } from "../../app/context/UserContext";
import './BottomNav.css'



function BottomNav({circleSize = 50 }) {
  const { user, loading, error } = useUser();
  const pathname = usePathname();
  const indicatorRef = useRef("")

  useEffect(()=>{
    setXbyRef()
  }, [pathname, loading])

  if (pathname == '/Auth' ) return null;
  if (loading) return <div></div>;
  if (error) return <p>Error: {error.message}</p>;
  if (!user) return null;
// console.log(user)
  let navs_ = [
    { icon: <RiTShirtFill /> , link: `/Profile/${loading ? '1' : user.uid}` },
    { icon: <GiSoccerKick /> , link: '/Matches' },
    { icon: <MdLeaderboard />  , link: '/Leaderboards' },
    { icon: <IoSettings />  , link: '/Settings' },
    
  ];
  
  function getXbyId(id){
    return document.getElementById(id)?.getBoundingClientRect().left - ((document.getElementById('indicatorB').offsetWidth / 2) - 4)
  }

  function setXbyRef() {
    if (indicatorRef.current) {
      const xPosition = getXbyId(pathname);
      if (xPosition !== undefined) {
        indicatorRef.current.style.left = `${xPosition}px`;
      }
    }
  }
  
  function isCurrentPathInNavs(){
    return navs_.some((nav) => pathname === nav.link);
  }
  
  return (
    <div className='p-3 nav-bottom-container d-lg-none'>
        {isCurrentPathInNavs() ? 
          <div ref={indicatorRef} className='nav-indicator p-2'>
          <div className='inner-circ gradient-btn' id='indicatorB' >

          </div>
          </div>
        :
          null
        }
        
        <div className='d-flex justify-content-around nav-items-p'>
            {navs_.map((nav)=> <Link className={`nav-item-p d-flex justify-content-center ${pathname == nav.link ? 'selected-nav': ''}`} key={nav.link} href={nav.link}><div id={nav.link} className={`nav-icon ${nav.link == pathname ? 'selected-nav-icon': ''}`}>{nav.icon}</div></Link>)}
        </div>
    </div>
  );
}

export default BottomNav;
