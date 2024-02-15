"use client";

import { BorderColor, DeleteOutline } from "@mui/icons-material";
import { Checkbox, IconButton } from "@mui/material";
import CustomButton from "@repo/ui/custom-button";
import type { ChangeEvent } from "react";
import { useState } from "react";
import CustomModal from "@repo/ui/custom-modal";
import CustomSnackbar from "@repo/ui/custom-snackbar";
import { actionWithRole } from "@actions/base-action";
import { UserRoles } from "@lib/constants";
import { deleteUsers } from "@actions/user-action";
import type { UserInterface } from "@models/user";
import UserForm from "./user-form";

export interface UserTableProps {
  users: UserInterface[];
}

function UserTable({ users }: UserTableProps) {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [rowCheckboxes, setRowCheckboxes] = useState(
    new Array(users.length).fill(false)
  );
  const [enableDeleteButton, setEnableDeleteButton] = useState(false);

  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openDeleteManyUsersModal, setOpenDeleteManyUsersModal] =
    useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);

  const [openAddUserSnackbar, setOpenAddUserSnackbar] = useState(false);
  const [openEditUserSnackbar, setOpenEditUserSnackbar] = useState(false);
  const [openDeleteUserSnackbar, setOpenDeleteUserSnackbar] = useState(false);

  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedUsernames, setSelectedUsernames] = useState([""]);

  const handleCloseAddUserModal = () => {
    setOpenAddUserModal(false);
  };
  const handleCloseDeleteManyUsersModal = () => {
    setOpenDeleteManyUsersModal(false);
  };
  const handleCloseEditUserModal = () => {
    setOpenEditUserModal(false);
  };
  const handleCloseDeleteUserModal = () => {
    setOpenDeleteUserModal(false);
  };

  const handleSelectAllChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setSelectAllChecked(isChecked);
    setRowCheckboxes(rowCheckboxes.map(() => isChecked));
    setEnableDeleteButton(isChecked);
    if (isChecked) {
      setSelectedUsernames(users.map((user) => user.username));
    } else {
      setSelectedUsernames([""]);
    }
  };

  const handleRowCheckboxChange = (selectedIndex: number) => {
    const updatedRowCheckboxes = [...rowCheckboxes];
    updatedRowCheckboxes[selectedIndex] = !updatedRowCheckboxes[selectedIndex];
    setRowCheckboxes(updatedRowCheckboxes);
    setSelectAllChecked(updatedRowCheckboxes.every((checkbox) => checkbox));
    setEnableDeleteButton(updatedRowCheckboxes.some((checkbox) => checkbox));
    setSelectedUsernames(
      users
        .filter((_user, index) => updatedRowCheckboxes[index])
        .map((user) => user.username)
    );
  };

  const handleResetCheckboxes = () => {
    setSelectAllChecked(false);
    setRowCheckboxes(rowCheckboxes.map(() => false));
    setEnableDeleteButton(false);
    setSelectedUsernames([""]);
    setSelectedUsername("");
    setOpenDeleteUserSnackbar(true);
  };

  return (
    <div>
      <div className="flex justify-end gap-4 pb-4">
        <CustomButton
          buttonType="danger"
          disabled={!enableDeleteButton}
          label="Delete"
          onClick={() => {
            setOpenDeleteManyUsersModal(true);
          }}
        />
        <CustomButton
          buttonType="primary"
          label="Add User"
          onClick={() => {
            setOpenAddUserModal(true);
          }}
        />
      </div>
      <table className="border-collapse w-full" id="user-table">
        <thead>
          <tr>
            <th>
              <Checkbox
                checked={selectAllChecked}
                disabled={users.length === 0}
                onChange={handleSelectAllChange}
              />
            </th>
            <th>ID</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rowCheckboxes.map((isChecked, index) => (
            <tr key={users[index]._id}>
              <td className="text-center">
                <Checkbox
                  checked={isChecked}
                  onChange={() => {
                    handleRowCheckboxChange(index);
                  }}
                />
              </td>
              <td>{users[index]._id}</td>
              <td>{users[index].fullName}</td>
              <td>{users[index].username}</td>
              <td>{users[index].role}</td>
              <td>
                <div className="flex justify-center">
                  <IconButton
                    onClick={() => {
                      setOpenEditUserModal(true);
                      setSelectedUsername(users[index].username);
                    }}
                  >
                    <BorderColor />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setOpenDeleteUserModal(true);
                      setSelectedUsername(users[index].username);
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CustomModal
        handleClose={handleCloseAddUserModal}
        open={openAddUserModal}
        title="Add user"
      >
        <UserForm
          closeModal={handleCloseAddUserModal}
          openSnackbar={() => {
            setOpenAddUserSnackbar(true);
          }}
        />
      </CustomModal>
      <CustomModal
        handleClose={handleCloseDeleteManyUsersModal}
        open={openDeleteManyUsersModal}
        title="Delete user(s)"
      >
        <div className="flex flex-col gap-4">
          <p>{`Are you sure to delete (these) user(s): ${selectedUsernames.join(", ")}?`}</p>
          <div className="flex justify-center">
            <CustomButton
              buttonType="danger"
              label="Delete"
              onClick={async () => {
                await actionWithRole(
                  UserRoles.SuperAdmin,
                  deleteUsers,
                  selectedUsernames
                );
                handleCloseDeleteManyUsersModal();
                handleResetCheckboxes();
              }}
            />
          </div>
        </div>
      </CustomModal>
      <CustomModal
        handleClose={handleCloseDeleteUserModal}
        open={openDeleteUserModal}
        title="Delete user"
      >
        <div className="flex flex-col gap-4">
          <p>Are you sure to delete user {selectedUsername}?</p>
          <div className="flex justify-center">
            <CustomButton
              buttonType="danger"
              label="Delete"
              onClick={async () => {
                await actionWithRole(UserRoles.SuperAdmin, deleteUsers, [
                  selectedUsername,
                ]);
                handleCloseDeleteUserModal();
                handleResetCheckboxes();
              }}
            />
          </div>
        </div>
      </CustomModal>
      <CustomModal
        handleClose={handleCloseEditUserModal}
        open={openEditUserModal}
        title="Edit user"
      >
        <UserForm
          closeModal={handleCloseEditUserModal}
          hasPasswordCheckbox
          openSnackbar={() => {
            setOpenEditUserSnackbar(true);
          }}
          passwordCheckboxText="Set a new password"
          user={users.find((user) => user.username === selectedUsername)}
        />
      </CustomModal>
      <CustomSnackbar
        message="Added user successfully!"
        openState={openAddUserSnackbar}
        setOpenState={setOpenAddUserSnackbar}
      />
      <CustomSnackbar
        message="Deleted user(s) successfully!"
        openState={openDeleteUserSnackbar}
        setOpenState={setOpenDeleteUserSnackbar}
      />
      <CustomSnackbar
        message="Edited user successfully!"
        openState={openEditUserSnackbar}
        setOpenState={setOpenEditUserSnackbar}
      />
    </div>
  );
}

export default UserTable;
