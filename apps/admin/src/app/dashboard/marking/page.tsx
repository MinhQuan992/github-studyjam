import { ListAlt } from "@mui/icons-material";
import PageHeader from "@repo/ui/page-header";
import { redirect } from "next/navigation";
import { getScoresOfWeek } from "@actions/marking-action";
import { getActiveTask } from "@actions/task-action";
import MarkingTable from "@components/marking/marking-table";
import WeekSelection from "@components/marking/week-selection";

const Page = async ({ searchParams }: { searchParams?: { week?: string } }) => {
  const getActiveTaskRes = await getActiveTask();
  const selectedWeek = Number(searchParams?.week) || 0;

  if (selectedWeek < 1 || selectedWeek > 3) {
    redirect(
      `/dashboard/marking?week=${getActiveTaskRes.data ? getActiveTaskRes.data.week : 1}`
    );
  }

  const weekScoresRes = await getScoresOfWeek(selectedWeek);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Marking" />
      <WeekSelection selectedWeek={selectedWeek} />
      {weekScoresRes.data ? (
        <MarkingTable
          activeWeek={getActiveTaskRes.data ? getActiveTaskRes.data.week : 0}
          key={`week-${selectedWeek}`}
          weekScores={JSON.parse(JSON.stringify(weekScoresRes.data))}
        />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <ListAlt className="!text-[256px]" />
          <h1>No data yet.</h1>
        </div>
      )}
    </div>
  );
};

export default Page;
