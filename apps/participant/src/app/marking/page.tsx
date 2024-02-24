import { ListAlt } from "@mui/icons-material";
import PageHeader from "@repo/ui/page-header";
import { redirect } from "next/navigation";
import { getActiveTask, getScoresOfWeek } from "@actions/server-actions";
import MarkingTable from "@components/marking/marking-table";
import WeekSelection from "@components/marking/week-selection";

const Page = async ({ searchParams }: { searchParams?: { week?: string } }) => {
  const getActiveTaskRes = await getActiveTask();
  const selectedWeek = Number(searchParams?.week) || 0;

  if (selectedWeek < 1 || selectedWeek > 3) {
    redirect(
      `/marking?week=${getActiveTaskRes.data ? getActiveTaskRes.data.week : 1}`
    );
  }

  const weekScoresRes = await getScoresOfWeek(selectedWeek);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Bảng điểm tuần" />
      <WeekSelection selectedWeek={selectedWeek} />
      {weekScoresRes.data ? (
        <MarkingTable
          key={`week-${selectedWeek}`}
          weekScores={weekScoresRes.data}
        />
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
