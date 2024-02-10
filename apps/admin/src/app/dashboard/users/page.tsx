import { getAllUsers } from "@actions/user-action";
import UserTable from "@components/users/user-table";
import PageHeader from "@repo/ui/page-header";

const Page = async () => {
  const users = await getAllUsers();

  return (
    <div>
      <PageHeader title="Users" />
      <UserTable users={JSON.parse(JSON.stringify(users))} />
    </div>
  );
};

export default Page;
