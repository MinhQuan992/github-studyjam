import { Alert, Snackbar } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface CustomSnackbarProps {
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
  message: string;
}

const CustomSnackbar = ({
  openState,
  setOpenState,
  message,
}: CustomSnackbarProps) => {
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenState(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={openState}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
