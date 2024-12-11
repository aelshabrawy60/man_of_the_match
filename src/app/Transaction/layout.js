"use client";

import CoinsDisplay from "@/Components/Coins/CoinsDisplay";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import './transaction.css'

export default function RootLayout({ children}) {
  const pathname = usePathname();

  return (
       
        <div>
          <div className="p-3">
            <CoinsDisplay />
          </div>
          <div className='filter-container text-center mt-3 mb-3'>  
            <Link 
                href={'/Transaction/Fund'}
                className={`filter-btn ${pathname === '/Transaction/Fund' ? 'active' : ''}`} 
            >
                شحن
            </Link>
            <Link 
                href={'/Transaction/Withdraw'}
                className={`filter-btn ${pathname === '/Transaction/Withdraw' ? 'active' : ''}`} 
            >
                سحب
            </Link>
          </div>
          <div>
            {children}
          </div>
        </div>
        
  );
}
