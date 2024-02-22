"use client";

import { ListAlt } from "@mui/icons-material";
import CustomButton from "@repo/ui/custom-button";
import CustomModal from "@repo/ui/custom-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomSnackbar from "@repo/ui/custom-snackbar";
import Link from "next/link";
import type { TaskInterface } from "@models/task";
import { UserRoles } from "@lib/constants";
import { openNextTask } from "@actions/task-action";
import { actionWithRole } from "@actions/base-action";
import { finalizeWeeklyMarking } from "@actions/marking-action";

interface ActiveTaskProps {
  task?: TaskInterface;
  isSuperAdmin: boolean;
}

function ActiveTask({ task, isSuperAdmin }: ActiveTaskProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const activeWeek = task ? task.week : 0;

  const handleOpenNextTask = async () => {
    if (activeWeek > 0) {
      const finalizeRes = await actionWithRole(
        UserRoles.SuperAdmin,
        finalizeWeeklyMarking,
        activeWeek
      );

      if (finalizeRes.success) {
        await actionWithRole(UserRoles.SuperAdmin, openNextTask, activeWeek);
        setOpenModal(false);
        setOpenSuccessSnackbar(true);
        router.refresh();
      } else {
        setOpenModal(false);
        setOpenErrorSnackbar(true);
      }
    } else {
      await actionWithRole(UserRoles.SuperAdmin, openNextTask, activeWeek);
      setOpenModal(false);
      setOpenSuccessSnackbar(true);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {task ? (
        <>
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
            TASK #{task.week}
          </Link>
        </>
      ) : (
        <>
          <ListAlt className="!text-[256px]" />
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
            handleClose={() => {
              setOpenModal(false);
            }}
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
                  onClick={handleOpenNextTask}
                />
              </div>
            </div>
          </CustomModal>
        </>
      ) : null}
      <CustomSnackbar
        message="An error occurred. Ensure that the submissions of this week have been fetched first!"
        openState={openErrorSnackbar}
        setOpenState={setOpenErrorSnackbar}
        type="error"
      />
      <CustomSnackbar
        message="Open the next task successfully!"
        openState={openSuccessSnackbar}
        setOpenState={setOpenSuccessSnackbar}
      />
    </div>
  );
}

export default ActiveTask;
