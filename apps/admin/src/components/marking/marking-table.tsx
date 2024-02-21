"use client";

import { Save, ThumbDown, ThumbUp } from "@mui/icons-material";
import { Checkbox, IconButton } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import CustomSnackbar from "@repo/ui/custom-snackbar";
import { useRouter } from "next/navigation";
import type { WeeklyScoreInterface } from "@models/weekly-score";
import { actionWithRole } from "@actions/base-action";
import { UserRoles } from "@lib/constants";
import { updateResults } from "@actions/marking-action";

interface MarkingTableProps {
  activeWeek: number;
  weekScores: WeeklyScoreInterface;
}

function MarkingTable({ activeWeek, weekScores }: MarkingTableProps) {
  const groups = weekScores.groups;
  const enableMarking = activeWeek === weekScores.week;
  // Using the spread operator here to keep the initialResults unchanged
  const initialResults = groups.map((group) => [...group.acs]);
  const [results, setResults] = useState(initialResults);
  const [openGaveMarkSnackbar, setOpenGaveMarkSnackbar] = useState(false);
  const [openChangeAcceptSnackbar, setOpenChangeAcceptSnackbar] =
    useState(false);
  const router = useRouter();

  const handleCheckboxChange = (groupIndex: number, acIndex: number) => {
    const updatedResults = [...results];
    updatedResults[groupIndex][acIndex] = !updatedResults[groupIndex][acIndex];
    setResults(updatedResults);
  };

  return (
    <div>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Group Name</th>
            <th>Submission</th>
            {initialResults[0].map((_, index) => (
              <th key={index}>AC #{index + 1}</th>
            ))}
            {!enableMarking ? (
              <>
                <th>Score</th>
                <th>Bonus</th>
                <th>Total</th>
              </>
            ) : (
              <th>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {groups.map((group, groupIndex) => (
            <tr
              className={!group.accept ? "rejected" : ""}
              key={group.groupName}
            >
              <td>{group.time}</td>
              <td>{group.groupName}</td>
              <td className="text-center">
                <Link
                  className="text-blue-500 hover:text-blue-700 hover:underline"
                  href={group.submission}
                  target="_blank"
                >
                  LINK
                </Link>
              </td>
              {results[groupIndex].map((pass, acIndex) => (
                <td className="text-center" key={acIndex}>
                  <Checkbox
                    checked={pass}
                    disabled={!enableMarking}
                    onChange={() => {
                      handleCheckboxChange(groupIndex, acIndex);
                    }}
                  />
                </td>
              ))}
              {!enableMarking ? (
                <>
                  <td className="text-center font-bold">
                    {!group.accept ? 0 : group.acs.filter((ac) => ac).length}
                  </td>
                  <td className="text-center font-bold text-green-500">
                    {group.rankingBonus ? group.rankingBonus : ""}
                  </td>
                  <td className="text-center font-bold text-blue-500">
                    {!group.accept
                      ? 0
                      : group.acs.filter((ac) => ac).length +
                        group.rankingBonus}
                  </td>
                </>
              ) : (
                <td>
                  <div className="flex justify-center">
                    <IconButton
                      disabled={
                        !enableMarking ||
                        initialResults[groupIndex].every(
                          (value, acIndex) =>
                            value === results[groupIndex][acIndex]
                        )
                      }
                      onClick={async () => {
                        await actionWithRole(
                          UserRoles.Admin,
                          updateResults,
                          activeWeek,
                          groupIndex,
                          true,
                          results[groupIndex]
                        );
                        setOpenGaveMarkSnackbar(true);
                        router.refresh();
                      }}
                    >
                      <Save />
                    </IconButton>
                    <IconButton
                      disabled={!enableMarking}
                      onClick={async () => {
                        await actionWithRole(
                          UserRoles.Admin,
                          updateResults,
                          activeWeek,
                          groupIndex,
                          false
                        );
                        setOpenChangeAcceptSnackbar(true);
                        router.refresh();
                      }}
                    >
                      {group.accept ? <ThumbDown /> : <ThumbUp />}
                    </IconButton>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <CustomSnackbar
        message="Gave mark successfully!"
        openState={openGaveMarkSnackbar}
        setOpenState={setOpenGaveMarkSnackbar}
      />
      <CustomSnackbar
        message="Changed the accept status successfully!"
        openState={openChangeAcceptSnackbar}
        setOpenState={setOpenChangeAcceptSnackbar}
      />
    </div>
  );
}

export default MarkingTable;
