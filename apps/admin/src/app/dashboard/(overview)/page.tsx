import PageHeader from "@repo/ui/page-header";
import { cookies } from "next/headers";
import { getActiveTask } from "@actions/task-action";
import ActiveTask from "@components/home/active-task";
import FetchSubmissionsForm from "@components/home/fetch-submissions-form";
import { SESSION_COOKIE_NAME, UserRoles } from "@lib/constants";
import { isRole } from "@lib/utils";

const Page = async () => {
  const activeTask = await getActiveTask();
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const isSuperAdmin = await isRole(UserRoles.SuperAdmin, token);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Home" />
      <ActiveTask
        isSuperAdmin={isSuperAdmin}
        task={
          activeTask.data
            ? JSON.parse(JSON.stringify(activeTask.data))
            : activeTask.data
        }
      />
      {activeTask.data && isSuperAdmin ? <FetchSubmissionsForm /> : null}
    </div>
  );
};

export default Page;
