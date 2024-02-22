import type { GroupScoreInterface } from "@models/group-score";

interface NormalBoardProps {
  groups: GroupScoreInterface[];
}

function NormalBoard({ groups }: NormalBoardProps) {
  return (
    <>
      {groups.map((group, index) => (
        <div
          className={`flex justify-between items-center p-4 w-[672px] rounded-lg border-2 ${group.achieveGifts ? "bg-blue-300 border-blue-500" : "bg-gray-300 border-gray-500"}`}
          key={group.groupName}
        >
          <div className="flex gap-6">
            <p className="text-xl">#{index + 4}</p>
            <p className="text-xl font-medium">{group.groupName}</p>
          </div>
          <p>{group.score} pts</p>
        </div>
      ))}
    </>
  );
}

export default NormalBoard;
