import { Button, CircularProgress } from "@mui/material";

interface CustomButtonProps {
  label: string;
  buttonType: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  disabled?: boolean;
}

const CustomButton = ({
  label,
  buttonType,
  isLoading = false,
  disabled = false,
}: CustomButtonProps) => {
  const shouldDisable = isLoading || disabled;

  switch (buttonType) {
    case "primary":
      return (
        <Button
          className={`ui-w-32 ${shouldDisable ? "ui-bg-gray-500 ui-text-gray-700" : "ui-bg-blue-500 hover:ui-bg-blue-700 ui-text-white"}`}
          endIcon={
            isLoading ? (
              <CircularProgress style={{ color: "#374152" }} size="1rem" />
            ) : null
          }
          disabled={shouldDisable}
        >
          {label}
        </Button>
      );
    case "secondary":
      return (
        <Button
          className={`ui-w-32 ui-border-solid ui-border hover:ui-bg-slate-200 ${shouldDisable ? "ui-border-[#bdbdbd]" : "ui-border-[#1876d2]"}`}
          endIcon={
            isLoading ? (
              <CircularProgress style={{ color: "#bdbdbd" }} size="1rem" />
            ) : null
          }
          disabled={shouldDisable}
        >
          {label}
        </Button>
      );
    default:
      return (
        <Button
          className={`ui-w-32 ${shouldDisable ? "ui-bg-gray-500 ui-text-gray-700" : "ui-bg-red-500 hover:ui-bg-red-700 ui-text-white"}`}
          endIcon={
            isLoading ? (
              <CircularProgress style={{ color: "#374152" }} size="1rem" />
            ) : null
          }
          disabled={shouldDisable}
        >
          {label}
        </Button>
      );
  }
};

export default CustomButton;
