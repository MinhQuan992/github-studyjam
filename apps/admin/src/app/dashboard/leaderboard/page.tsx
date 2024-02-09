import React from "react";
import { unstable_noStore } from "next/cache";

const Page = async () => {
  // TODO: use the fetch below for loader testing only
  unstable_noStore();
  await fetch("https://swapi.dev/api/people");

  return (
    <div>
      <h1>Leaderboard</h1>
    </div>
  );
};

export default Page;
