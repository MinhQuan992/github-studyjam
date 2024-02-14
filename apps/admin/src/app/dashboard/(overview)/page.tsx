import PageHeader from "@repo/ui/page-header";
import { unstable_noStore } from "next/cache";

const Page = async () => {
  // TODO: use the fetch below for loader testing only
  unstable_noStore();
  await fetch("https://swapi.dev/api/people");

  return (
    <div>
      <PageHeader title="Home" />
    </div>
  );
};

export default Page;
