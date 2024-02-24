import { ListAlt } from "@mui/icons-material";
import PageHeader from "@repo/ui/page-header";
import { getActiveTask } from "@actions/server-actions";
import Link from "next/link";
import Image from "next/image";

const Page = async () => {
  const activeTaskRes = await getActiveTask();
  const task = activeTaskRes.data;

  return (
    <div className="flex flex-col">
      <PageHeader title="Trang chủ" />
      {task ? (
        <div className="flex flex-col items-center gap-4">
          <Image
            alt="Task description"
            height={856}
            src="/images/poster.jpeg"
            width={1024}
          />
          <Link
            className="text-blue-500 hover:text-blue-700 hover:underline pb-4"
            href={task.url}
            target="_blank"
          >
            NHIỆM VỤ TUẦN {task.week}
          </Link>
        </div>
      ) : (
        <>
          <ListAlt className="!text-[256px]" />
          <h1>Chưa có nhiệm vụ.</h1>
        </>
      )}
    </div>
  );
};

export default Page;
