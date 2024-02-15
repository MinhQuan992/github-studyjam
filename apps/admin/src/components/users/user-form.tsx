"use client";

import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import CustomButton from "@repo/ui/custom-button";
import { useFormik } from "formik";
import { useState } from "react";
import { actionWithRole } from "@actions/base-action";
import { addUser, editUser } from "@actions/user-action";
import { UserRoles } from "@lib/constants";
import type { UserFormSchemaType } from "@lib/definitions";
import { UserFormSchema } from "@lib/definitions";
import type { UserInterface } from "@models/user";

interface UserFormProps {
  user?: UserInterface;
  hasPasswordCheckbox?: boolean;
  passwordCheckboxText?: string;
  closeModal: () => void;
  openSnackbar: () => void;
}

function UserForm({
  user,
  hasPasswordCheckbox = false,
  passwordCheckboxText = "",
  closeModal,
  openSnackbar,
}: UserFormProps) {
  const onSubmitHandler = async (values: UserFormSchemaType) => {
    const result = !user
      ? await actionWithRole(UserRoles.SuperAdmin, addUser, values)
      : await actionWithRole(UserRoles.SuperAdmin, editUser, values, user._id);
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
          error={touched.fullName && Boolean(errors.fullName)}
          helperText={touched.fullName ? errors.fullName : null}
          id="fullName"
          label="Full Name"
          name="fullName"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.fullName}
        />
        <TextField
          error={touched.username && Boolean(errors.username)}
          helperText={touched.username ? errors.username : null}
          id="username"
          label="Username"
          name="username"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.username}
        />
        {hasPasswordCheckbox ? (
          <FormControlLabel
            control={
              <Checkbox
                onChange={async (event) => {
                  setEnablePassword(event.target.checked);
                  await setFieldValue("newPassword", event.target.checked);
                }}
              />
            }
            label={passwordCheckboxText}
          />
        ) : null}
        <TextField
          disabled={!enablePassword}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password ? errors.password : null}
          id="password"
          label="Password"
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          type="password"
          value={values.password}
        />
        <div className="flex justify-center gap-4">
          <CustomButton
            buttonType="secondary"
            label="Cancel"
            onClick={closeModal}
          />
          <CustomButton
            buttonType="primary"
            disabled={!dirty}
            isLoading={isSubmitting}
            label="Save"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}

export default UserForm;
