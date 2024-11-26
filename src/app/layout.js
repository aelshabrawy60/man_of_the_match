import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BootstrapClient from "../Components/BootstrapClient";
import { UserProvider } from "../app/context/UserContext";

import { Changa } from "next/font/google";
import Navbar from "@/Components/Navbar/Navbar";
import BottomNav from "@/Components/BottomNav/BottomNav";

const changa = Changa({
  subsets: ["latin", "latin-ext"], // Specify required subsets
  weight: ["400", "700"], // Specify the font weights
});

export const metadata = {
  title: "MOTM",
  description: "rate players and recive rates to win man of the match",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={changa.className}>
        {/* Google Analytics gtag.js */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2F9FMK3GS2"
        />
        <script id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2F9FMK3GS2');
          `}
        </script>
        {/* Pass pathname to Navbar */}
        <UserProvider>
          <BottomNav/>
        </UserProvider>
        <div className="container-md p-0" style={{marginBottom: '90px'}}>
          {children}
          <BootstrapClient />
        </div>
        
      </body>
    </html>
  );
}
