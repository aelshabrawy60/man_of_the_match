import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BootstrapClient from "../Components/BootstrapClient";
import { UserProvider } from "../app/context/UserContext";

import { Changa } from "next/font/google";
import Navbar from "@/Components/Navbar/Navbar";
import BottomNav from "@/Components/BottomNav/BottomNav";
import Sidebar from "@/Components/Sidebar/Sidebar";

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
      <meta name='admaven-placement' content="Bqdn9pdU6"></meta>
      <meta name="galaksion-domain-verification" content="a8c49707537b014ac13878fea4aad56db27ff44f2262fe733344f7bebe4dc5d4" />
      <script data-cfasync="false" src="//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1127217"></script>
      <script data-cfasync="false" src="//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1127223"></script>
      <script data-cfasync="false" src="//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1127233"></script>
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
