import "./globals.css";
import "@repo/ui/styles.css";
import { Home, Leaderboard, Checklist } from "@mui/icons-material";
import { Inter } from "next/font/google";
import type { TabProps } from "@repo/ui/sidenav";
import SideNav from "@repo/ui/sidenav";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Git & GitHub Study Jam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tabs: TabProps[] = [
    {
      icon: <Home fontSize="large" />,
      label: "home",
      href: "/",
    },
    {
      icon: <Checklist fontSize="large" />,
      label: "marking",
      href: "/marking",
    },
    {
      icon: <Leaderboard fontSize="large" />,
      label: "leaderboard",
      href: "/leaderboard",
    },
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <SideNav tabs={tabs} />
          <div className="flex-grow pt-8 px-8 ml-[67px]">{children}</div>
        </div>
      </body>
    </html>
  );
}
