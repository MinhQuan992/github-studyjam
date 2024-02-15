import PageHeader from "@repo/ui/page-header";
import { getProfileInfo } from "@actions/profile-action";
import ProfileForm from "@components/profile/profile-form";

const Page = async () => {
  const response = await getProfileInfo();

  return (
    <div>
      <PageHeader title="Profile" />
      {response.success ? (
        <ProfileForm user={JSON.parse(JSON.stringify(response.data))} />
      ) : (
        <div>An error has occurred.</div>
      )}
    </div>
  );
};

export default Page;
