import PageHeader from "@repo/ui/page-header";
import { actionWithRole } from "@actions/base-action";
import { getAllUsers } from "@actions/user-action";
import UserTable from "@components/users/user-table";
import { UserRoles } from "@lib/constants";

const Page = async () => {
  const response = await actionWithRole(UserRoles.SuperAdmin, getAllUsers);

  return (
    <div>
      <PageHeader title="Users" />
      {response.success ? (
        <UserTable users={JSON.parse(JSON.stringify(response.data))} />
      ) : (
        <div>An error has occurred.</div>
      )}
    </div>
  );
};

export default Page;
