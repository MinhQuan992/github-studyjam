"use client";

import { actionWithRole } from "@actions/base-action";
import { addUser, editUser } from "@actions/user-action";
import { USER_ROLES } from "@lib/constants";
import { UserFormSchema, UserFormSchemaType } from "@lib/definitions";
import { IUser } from "@models/user";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import CustomButton from "@repo/ui/custom-button";
import { useFormik } from "formik";
import { useState } from "react";

interface UserFormProps {
  user?: IUser;
  hasPasswordCheckbox?: boolean;
  passwordCheckboxText?: string;
  closeModal: () => void;
  openSnackbar: () => void;
}

const UserForm = ({
  user,
  hasPasswordCheckbox = false,
  passwordCheckboxText = "",
  closeModal,
  openSnackbar,
}: UserFormProps) => {
  const onSubmitHandler = async (values: UserFormSchemaType) => {
    const result = !user
      ? await actionWithRole(USER_ROLES.SUPER_ADMIN, addUser, values)
      : await actionWithRole(
          USER_ROLES.SUPER_ADMIN,
          editUser,
          values,
          user._id
        );
    if (!result.success) {
      if (result.fieldError === "username") {
        setErrors({
          username: result.message,
        });
      } else {
        setErrors({
          password: result.message,
        });
      }
    } else {
      closeModal();
      openSnackbar();
    }
  };

  const {
    values,
    touched,
    errors,
    isSubmitting,
    dirty,
    setFieldValue,
    setErrors,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useFormik<UserFormSchemaType>({
    initialValues: {
      fullName: user?.fullName || "",
      username: user?.username || "",
      newPassword: !hasPasswordCheckbox,
      password: "",
    },
    validationSchema: UserFormSchema,
    onSubmit: onSubmitHandler,
  });
  const [enablePassword, setEnablePassword] = useState(!hasPasswordCheckbox);

  return (
    <div>
      <form className="flex flex-col gap-5 py-5" onSubmit={handleSubmit}>
        <TextField
          id="fullName"
          name="fullName"
          label="Full Name"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.fullName && Boolean(errors.fullName)}
          helperText={touched.fullName && errors.fullName}
        />
        <TextField
          id="username"
          name="username"
          label="Username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.username && Boolean(errors.username)}
          helperText={touched.username && errors.username}
        />
        {hasPasswordCheckbox && (
          <FormControlLabel
            label={passwordCheckboxText}
            control={
              <Checkbox
                onChange={(event) => {
                  setEnablePassword(event.target.checked);
                  setFieldValue("newPassword", event.target.checked);
                }}
              />
            }
          />
        )}
        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={!enablePassword}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password}
        />
        <div className="flex justify-center gap-4">
          <CustomButton
            label="Cancel"
            buttonType="secondary"
            onClick={closeModal}
          />
          <CustomButton
            disabled={!dirty}
            label="Save"
            buttonType="primary"
            type="submit"
            isLoading={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default UserForm;
