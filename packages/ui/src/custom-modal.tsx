import { Box, IconButton, Modal } from "@mui/material";
import PageHeader from "./page-header";
import { ReactNode } from "react";
import { Clear } from "@mui/icons-material";

interface CustomModalProps {
  title: string;
  open: boolean;
  handleClose: () => void;
  children: ReactNode;
}

const CustomModal = ({
  title,
  open,
  handleClose,
  children,
}: CustomModalProps) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className="flex flex-col">
          <div className="flex ui-justify-between">
            <PageHeader title={title} />
            <IconButton
              onClick={() => {
                handleClose();
              }}
            >
              <Clear />
            </IconButton>
          </div>
          {children}
        </div>
      </Box>
    </Modal>
  );
};

export default CustomModal;
