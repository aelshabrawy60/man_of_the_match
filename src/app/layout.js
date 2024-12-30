import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BootstrapClient from "../Components/BootstrapClient";
import { UserProvider } from "../app/context/UserContext";

import { Changa } from "next/font/google";
import Navbar from "@/Components/Navbar/Navbar";
import BottomNav from "@/Components/BottomNav/BottomNav";
import Sidebar from "@/Components/Sidebar/Sidebar";
import Script from "next/script";

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
        {}
        <UserProvider>
          <Sidebar />
          <BottomNav/>
        </UserProvider>
        <div className="container-md p-0 d-flex justify-content-center" style={{marginBottom: '90px', position: 'relative'}}>
          <div className="wrapper" style={{position: 'relative', width: '800px'}}>
            {children}
            <BootstrapClient />
          </div>
        </div>
        
      </body>
    </html>
  );
}
