"use client";

import { ListAlt } from "@mui/icons-material";
import CustomButton from "@repo/ui/custom-button";
import CustomModal from "@repo/ui/custom-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TaskInterface } from "@models/task";
import { UserRoles } from "@lib/constants";
import { openNextTask } from "@actions/task-action";
import { actionWithRole } from "@actions/base-action";

interface ActiveTaskProps {
  task?: TaskInterface;
  isSuperAdmin: boolean;
}

function ActiveTask({ task, isSuperAdmin }: ActiveTaskProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const activeWeek = task ? task.week : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {task ? (
        <Image
          alt="Task description"
          height={856}
          src={`/images/${task.image}`}
          width={1024}
        />
      ) : (
        <>
          <ListAlt className="text-[256px]" />
          <h1>
            There is no active task.{isSuperAdmin ? " Open the first one!" : ""}
          </h1>
        </>
      )}
      {isSuperAdmin ? (
        <>
          <CustomButton
            buttonType="primary"
            label={activeWeek < 3 ? `Open Task #${activeWeek + 1}` : "Complete"}
            onClick={() => {
              setOpenModal(true);
            }}
          />
          <CustomModal
            handleClose={() => { setOpenModal(false); }}
            open={openModal}
            title="Open new task"
          >
            <div className="flex flex-col gap-4">
              <p>
                {activeWeek === 0
                  ? "Are you sure to open the first task?"
                  : "Are you sure to complete the current task and open the next one?"}
              </p>
              <div className="flex justify-center">
                <CustomButton
                  buttonType="primary"
                  label="Open"
                  onClick={async () => {
                    await actionWithRole(
                      UserRoles.SuperAdmin,
                      openNextTask,
                      activeWeek
                    );
                    setOpenModal(false);
                    router.refresh();
                  }}
                />
              </div>
            </div>
          </CustomModal>
        </>
      ) : null}
    </div>
  );
}

export default ActiveTask;
