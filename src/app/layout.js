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

      {/*push ad */}
      <script src="https://couphaithuph.net/act/files/tag.min.js?z=8667421" data-cfasync="false" async></script>

      <meta name="monetag" content="a1d280981f137320be5812eb410c303c"></meta>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6977923343312127"
        crossorigin="anonymous"></script>
        
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
