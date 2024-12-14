"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";
import { RiTShirtFill } from "react-icons/ri";
import { GiSoccerKick } from "react-icons/gi";
import { MdLeaderboard } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";

import { useUser } from "../../app/context/UserContext";
import './Sidebar.css'

function Sidebar() {
  const { user, loading, error } = useUser();
  const pathname = usePathname();

  if (pathname == '/Auth') return null;
  if (loading) return <div></div>;
  if (error) return <p>Error: {error.message}</p>;

  const navs_ = [
    { icon: <RiTShirtFill />, link: `/Profile/${loading || !user ? '1' : user.uid}`, label: 'الملف الشخصي' },
    { icon: <GiSoccerKick />, link: '/Matches', label: 'المباريات' },
    { icon: <MdLeaderboard />, link: '/Leaderboards', label: 'الترتيب' },
    { icon : <IoNotifications /> , link: '/Notifications', label: 'الاشعارات'},
    { icon: <IoSettings />, link: '/Settings', label: 'الاعدادات' },
  ];

  return (
    <div className='sidebar-container d-none d-lg-flex'>
      <div className='sidebar-content'>
        <div className='sidebar-brand mb-4'>
          <h2>MOTM</h2>
        </div>
        <nav className='sidebar-nav'>
          {navs_.map((nav) => (
            <Link 
              key={nav.link} 
              href={nav.link}
              className={`sidebar-link ${pathname === nav.link ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{nav.icon}</span>
              <span className="sidebar-label">{nav.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
