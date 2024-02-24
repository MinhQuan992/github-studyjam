"use client";

import type { SelectChangeEvent } from "@mui/material";
import { MenuItem, Select } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

interface WeekSelectionProps {
  selectedWeek: number;
}

function WeekSelection({ selectedWeek }: WeekSelectionProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (event: SelectChangeEvent) => {
    const params = new URLSearchParams({ week: event.target.value });
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      className="w-fit"
      label="Week"
      onChange={handleChange}
      value={selectedWeek.toString()}
    >
      <MenuItem value={1}>Tuần 1</MenuItem>
      <MenuItem value={2}>Tuần 2</MenuItem>
      <MenuItem value={3}>Tuần 3</MenuItem>
    </Select>
  );
}

export default WeekSelection;
