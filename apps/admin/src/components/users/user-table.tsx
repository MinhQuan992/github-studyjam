"use client";

import { IUser } from "@models/user";
import { BorderColor, DeleteOutline } from "@mui/icons-material";
import { Checkbox, IconButton } from "@mui/material";
import CustomButton from "@repo/ui/custom-button";
import { ChangeEvent, useState } from "react";
import CustomModal from "@repo/ui/custom-modal";
import UserForm from "./user-form";
import { actionWithRole } from "@actions/base-action";
import { USER_ROLES } from "@lib/constants";
import { deleteUsers } from "@actions/user-action";

export interface UserTableProps {
  users: IUser[];
}

const UserTable = ({ users }: UserTableProps) => {
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

  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedUsernames, setSelectedUsernames] = useState([""]);

  const handleCloseAddUserModal = () => setOpenAddUserModal(false);
  const handleCloseDeleteManyUsersModal = () =>
    setOpenDeleteManyUsersModal(false);
  const handleCloseEditUserModal = () => setOpenEditUserModal(false);
  const handleCloseDeleteUserModal = () => setOpenDeleteUserModal(false);

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

  const handleRowCheckboxChange = (index: number) => {
    const updatedRowCheckboxes = [...rowCheckboxes];
    updatedRowCheckboxes[index] = !updatedRowCheckboxes[index];
    setRowCheckboxes(updatedRowCheckboxes);
    setSelectAllChecked(updatedRowCheckboxes.every((checkbox) => checkbox));
    setEnableDeleteButton(updatedRowCheckboxes.some((checkbox) => checkbox));
    setSelectedUsernames(
      users
        .filter((_user, index) => updatedRowCheckboxes[index])
        .map((user) => user.username)
    );
  };

  return (
    <div>
      <div className="flex justify-end gap-4 pb-4">
        <CustomButton
          label="Delete"
          buttonType="danger"
          disabled={!enableDeleteButton}
          onClick={() => setOpenDeleteManyUsersModal(true)}
        />
        <CustomButton
          label="Add User"
          buttonType="primary"
          onClick={() => setOpenAddUserModal(true)}
        />
      </div>
      <table className="border-collapse w-full" id="user-table">
        <thead>
          <tr>
            <th>
              <Checkbox
                checked={selectAllChecked}
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
            <tr key={index}>
              <td className="text-center">
                <Checkbox
                  checked={isChecked}
                  onChange={() => handleRowCheckboxChange(index)}
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
        title="Add user"
        open={openAddUserModal}
        handleClose={handleCloseAddUserModal}
      >
        <UserForm closeModal={handleCloseAddUserModal} />
      </CustomModal>
      <CustomModal
        title="Delete user(s)"
        open={openDeleteManyUsersModal}
        handleClose={handleCloseDeleteManyUsersModal}
      >
        <div className="flex flex-col gap-4">
          <p>{`Are you sure to delete (these) user(s): ${selectedUsernames.join(", ")}?`}</p>
          <div className="flex justify-center">
            <CustomButton
              label="Delete"
              buttonType="danger"
              onClick={async () => {
                await actionWithRole(
                  USER_ROLES.SUPER_ADMIN,
                  deleteUsers,
                  selectedUsernames
                );
                handleCloseDeleteManyUsersModal();
              }}
            />
          </div>
        </div>
      </CustomModal>
      <CustomModal
        title="Delete user"
        open={openDeleteUserModal}
        handleClose={handleCloseDeleteUserModal}
      >
        <div className="flex flex-col gap-4">
          <p>Are you sure to delete user {selectedUsername}?</p>
          <div className="flex justify-center">
            <CustomButton
              label="Delete"
              buttonType="danger"
              onClick={async () => {
                await actionWithRole(USER_ROLES.SUPER_ADMIN, deleteUsers, [
                  selectedUsername,
                ]);
                handleCloseDeleteUserModal();
              }}
            />
          </div>
        </div>
      </CustomModal>
      <CustomModal
        title="Edit user"
        open={openEditUserModal}
        handleClose={handleCloseEditUserModal}
      >
        <UserForm
          user={users.find((user) => user.username === selectedUsername)}
          hasPasswordCheckbox={true}
          passwordCheckboxText="Set a new password"
          closeModal={handleCloseEditUserModal}
        />
      </CustomModal>
    </div>
  );
};

export default UserTable;
