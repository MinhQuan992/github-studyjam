import { Checkbox } from "@mui/material";
import Link from "next/link";
import type { WeeklyScoreInterface } from "@models/weekly-score";

interface MarkingTableProps {
  weekScores: WeeklyScoreInterface;
}

function MarkingTable({ weekScores }: MarkingTableProps) {
  const groups = weekScores.groups;
  const results = groups.map((group) => [...group.acs]);

  return (
    <div>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Tên nhóm</th>
            <th>Bài nộp</th>
            {results[0].map((_, index) => (
              <th key={index}>Yêu cầu {index + 1}</th>
            ))}
            <th>Điểm nhiệm vụ</th>
            <th>Điểm thứ hạng</th>
            <th>Tổng điểm</th>
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
                  <Checkbox checked={pass} disabled={true} />
                </td>
              ))}
              <td className="text-center font-bold">
                {!group.accept ? 0 : group.acs.filter((ac) => ac).length}
              </td>
              <td className="text-center font-bold text-green-500">
                {group.rankingBonus ? group.rankingBonus : ""}
              </td>
              <td className="text-center font-bold text-blue-500">
                {!group.accept
                  ? 0
                  : group.acs.filter((ac) => ac).length + group.rankingBonus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarkingTable;
