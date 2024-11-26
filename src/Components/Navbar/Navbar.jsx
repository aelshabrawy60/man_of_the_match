"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiTShirtFill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { MdStadium } from "react-icons/md";
import { PiListDashes } from "react-icons/pi";
import { useUser } from "../../app/context/UserContext";
import { MdClose } from "react-icons/md";

import "./Navbar.css";

function Navbar() {
    const pathname = usePathname();
    const { user, loading, error } = useUser();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    if (pathname == '/Auth' ) return null;
    if (loading) return <div></div>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <nav className="navbar py-2 navbar-expand-lg gradient-btn">
                <div className="container-fluid p-0">
                    <div className="px-3 align-items-center d-flex justify-content-between w-100">
                        <button
                            className="nav-toggle-btn"
                            type="button"
                            onClick={toggleMenu}
                            aria-controls="navbarSupportedContent"
                            aria-expanded={isOpen}
                            aria-label="Toggle navigation"
                        >
                            <PiListDashes />
                        </button>
                        <a className="navbar-brand">MOTM</a>
                    </div>
                    <div onClick={closeMenu} className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
                        <button onClick={closeMenu} className="close-button p-3 fs-1"><MdClose /></button>
                        <ul className="navbar-nav me-auto gap-2 mt-5 mb-2 mb-lg-0">
                            <li className={`nav-item fs-3`}>
                                <Link
                                    className={`nav-link ${pathname === '/Matches' ? 'active-link' : ''} px-3 py-2`}
                                    aria-current="page"
                                    href="/Matches"
                                    onClick={closeMenu}
                                >
                                    <MdStadium className="ms-2" />
                                    المباريات
                                </Link>
                            </li>
                            <li className={`nav-item fs-3`}>
                                <Link
                                    className={`nav-link ${pathname === `/Profile/${loading ? '1' : user.uid}` ? 'active-link' : ''} px-3 py-2`}
                                    href={`/Profile/${loading ? '1' : user.uid}`}
                                    onClick={closeMenu}
                                >
                                    <RiTShirtFill className="ms-2" /> الملف الشخصي
                                </Link>
                            </li>
                            <li className={`nav-item fs-3`}>
                                <Link
                                    className={`nav-link ${pathname === '/Settings' ? 'active-link' : ''} px-3 py-2`}
                                    href="/Settings"
                                    onClick={closeMenu}
                                >
                                    <IoSettingsSharp className="ms-2" />
                                    الاعدادات
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;