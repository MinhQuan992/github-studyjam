import { ListAlt } from "@mui/icons-material";
import PageHeader from "@repo/ui/page-header";
import { getLeaderboard } from "@actions/server-actions";
import NormalBoard from "@components/leaderboard/normal-board";
import Podium from "@components/leaderboard/podium";

const Page = async () => {
  const getLeaderboardRes = await getLeaderboard();
  const groups = getLeaderboardRes.data;

  return (
    <div>
      <PageHeader title="Bảng xếp hạng" />
      {groups && groups.some((group) => group.score > 0) ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-end">
            <Podium
              groupName={groups[1].groupName}
              rank={2}
              score={groups[1].score}
            />
            <Podium
              groupName={groups[0].groupName}
              rank={1}
              score={groups[0].score}
            />
            <Podium
              groupName={groups[2].groupName}
              rank={3}
              score={groups[2].score}
            />
          </div>
          <NormalBoard groups={groups.slice(3)} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <ListAlt className="!text-[256px]" />
          <h1>Chưa có dữ liệu.</h1>
        </div>
      )}
    </div>
  );
};

export default Page;
