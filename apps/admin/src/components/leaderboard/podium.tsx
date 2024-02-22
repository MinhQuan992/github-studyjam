interface PodiumProps {
  rank: number;
  groupName: string;
  score: number;
}

function Podium({ rank, groupName, score }: PodiumProps) {
  let rankStyles;
  switch (rank) {
    case 1:
      rankStyles = "h-52 bg-[#FFD700]";
      break;
    case 2:
      rankStyles = "h-40 bg-[#C0C0C0]";
      break;
    default:
      rankStyles = "h-32 bg-[#CD7F32]";
  }
  return (
    <div
      className={`w-56 rounded-t-lg shadow-md flex flex-col items-center justify-center ${rankStyles}`}
    >
      <h1 className="text-2xl text-center font-semibold">{groupName}</h1>
      <p>{score} pts</p>
    </div>
  );
}

export default Podium;
