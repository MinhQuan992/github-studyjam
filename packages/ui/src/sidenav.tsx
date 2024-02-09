"use client";

import { Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import Link from "next/link";

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

export interface TabProps {
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  label: string;
  href: string;
}

interface SideNavProps {
  tabs: TabProps[];
}

const SideNav = ({ tabs }: SideNavProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="SideNav"
      orientation="vertical"
      className="ui-h-screen ui-w-fit ui-bg-blue-500"
      TabIndicatorProps={{
        style: {
          color: "white",
          backgroundColor: "white",
          borderWidth: "2px",
        },
      }}
      sx={{ borderRight: 1, borderColor: "divider" }}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={tab.label}
          icon={tab.icon}
          aria-label={tab.label}
          LinkComponent={Link}
          href={tab.href}
          {...a11yProps(index)}
        />
      ))}
    </Tabs>
  );
};

export default SideNav;
