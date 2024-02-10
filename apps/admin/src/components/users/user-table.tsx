"use client";

import { IUser } from "@models/user";
import { BorderColor, DeleteOutline } from "@mui/icons-material";
import { Checkbox, IconButton } from "@mui/material";
import CustomButton from "@repo/ui/custom-button";
import React, { useState } from "react";

export interface UserTableProps {
  users: IUser[];
}

const UserTable = ({ users }: UserTableProps) => {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [rowCheckboxes, setRowCheckboxes] = useState(
    new Array(users.length).fill(false)
  );
  const [enableDeleteButton, setEnableDeleteButton] = useState(false);

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    setSelectAllChecked(isChecked);
    setRowCheckboxes(rowCheckboxes.map(() => isChecked));
    setEnableDeleteButton(isChecked);
  };

  const handleRowCheckboxChange = (index: number) => {
    const updatedRowCheckboxes = [...rowCheckboxes];
    updatedRowCheckboxes[index] = !updatedRowCheckboxes[index];
    setRowCheckboxes(updatedRowCheckboxes);
    setSelectAllChecked(updatedRowCheckboxes.every((checkbox) => checkbox));
    setEnableDeleteButton(updatedRowCheckboxes.some((checkbox) => checkbox));
  };

  return (
    <div>
      <div className="flex justify-end gap-4 pb-4">
        <CustomButton
          label="Delete"
          buttonType="danger"
          disabled={!enableDeleteButton}
        />
        <CustomButton label="Add User" buttonType="primary" />
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
              <td>{users[index].fullName}</td>
              <td>{users[index].username}</td>
              <td>{users[index].role}</td>
              <td>
                <div className="flex justify-center">
                  <IconButton onClick={() => alert("Edit")}>
                    <BorderColor />
                  </IconButton>
                  <IconButton onClick={() => alert("Delete")}>
                    <DeleteOutline />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
