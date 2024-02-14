import { SESSION_COOKIE_NAME, USER_ROLES } from "@lib/constants";
import { isRole } from "@lib/utils";
import {
  Home,
  People,
  Leaderboard,
  AccountCircle,
  Checklist,
} from "@mui/icons-material";
import SideNav, { TabProps } from "@repo/ui/sidenav";
import { cookies } from "next/headers";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const tabs: TabProps[] = [
    {
      icon: <Home fontSize="large" />,
      label: "home",
      href: "/dashboard",
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

  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const isSuperAdmin = await isRole(USER_ROLES.SUPER_ADMIN, token);

  if (isSuperAdmin) {
    tabs.splice(1, 0, {
      icon: <People fontSize="large" />,
      label: "users",
      href: "/dashboard/users",
    });
  } else {
    tabs.splice(1, 0, {
      icon: <Checklist fontSize="large" />,
      label: "marking",
      href: "/dashboard/marking",
    });
  }

  return (
    <div className="flex h-screen">
      <SideNav tabs={tabs} />
      <div className="flex-grow pt-8 px-8 ml-[67px]">{children}</div>
    </div>
  );
};

export default Layout;
