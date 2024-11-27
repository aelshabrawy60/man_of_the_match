"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoFootball } from "react-icons/io5";
import { GiSoccerKick } from "react-icons/gi";

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


  let navs_ = [
    { icon: <RiTShirtFill /> , link: `/Profile/${loading ? '1' : user.uid}` },
    { icon: <GiSoccerKick /> , link: '/Matches' },
    { icon: <IoSettings />  , link: '/Settings' },
  ];
  
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
  
  function isCurrentPathInNavs(){
    return navs_.some((nav) => pathname === nav.link);
  }
  
  return (
    <div className='p-3 nav-bottom-container'>
        {isCurrentPathInNavs() ? 
          <div ref={indicatorRef} className='nav-indicator p-2'>
          <div className='inner-circ gradient-btn'>

          </div>
          </div>
        :
          null
        }
        
        <div className='d-flex justify-content-around nav-items-p'>
            {navs_.map((nav)=> <Link className={`nav-item-p ${pathname == nav.link ? 'selected-nav': ''}`} key={nav.link} id={nav.link} href={nav.link}>{nav.icon}</Link>)}
        </div>
    </div>
  );
}

export default BottomNav;
