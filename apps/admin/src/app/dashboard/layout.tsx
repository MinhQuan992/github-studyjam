import { Home, People, Leaderboard, AccountCircle } from "@mui/icons-material";
import SideNav, { TabProps } from "@repo/ui/sidenav";

const tabs: TabProps[] = [
  {
    icon: <Home fontSize="large" />,
    label: "home",
    href: "/dashboard",
  },
  {
    icon: <People fontSize="large" />,
    label: "users",
    href: "/dashboard/users",
  },
  {
    icon: <Leaderboard fontSize="large" />,
    label: "leaderboard",
    href: "/dashboard/leaderboard",
  },
  {
    icon: <AccountCircle fontSize="large" />,
    label: "profile",
    href: "/dashboard/profile",
  },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <SideNav tabs={tabs} />
      <div className="flex-grow pt-4 px-4">{children}</div>
    </div>
  );
};

export default Layout;
