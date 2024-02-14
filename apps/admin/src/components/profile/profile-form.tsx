"use client";

import { changePassword, logout } from "@actions/profile-action";
import { ProfileFormSchema, ProfileFormSchemaType } from "@lib/definitions";
import { IUser } from "@models/user";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import CustomButton from "@repo/ui/custom-button";
import CustomSnackbar from "@repo/ui/custom-snackbar";
import { useFormik } from "formik";
import { useState } from "react";

interface ProfileFormProps {
  user: IUser;
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const [enablePassword, setEnablePassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const {
    values,
    touched,
    errors,
    isSubmitting,
    dirty,
    setErrors,
    handleSubmit,
    handleChange,
    handleBlur,
    resetForm,
  } = useFormik<ProfileFormSchemaType>({
    initialValues: {
      password: "",
    },
    validationSchema: ProfileFormSchema,
    onSubmit: async (values) => {
      await changePassword(values);
      resetForm();
      setEnablePassword(false);
      setOpenSnackbar(true);
    },
  });

  return (
    <form className="flex flex-col gap-5 py-5 max-w-lg" onSubmit={handleSubmit}>
      <TextField
        id="fullName"
        label="Full Name"
        value={user.fullName}
        disabled={true}
      />
      <TextField
        id="username"
        label="Username"
        value={user.username}
        disabled={true}
      />
      <FormControlLabel
        label="Change password"
        control={
          <Checkbox
            checked={enablePassword}
            onChange={(event) => {
              setEnablePassword(event.target.checked);
              setErrors({
                password: "",
              });
            }}
          />
        }
      />
      <TextField
        id="password"
        name="password"
        label="Password"
        type="password"
        value={values.password}
        disabled={!enablePassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && Boolean(errors.password)}
        helperText={touched.password && errors.password}
      />
      <div className="flex justify-center gap-4">
        <CustomButton
          label="Log out"
          buttonType="secondary"
          onClick={() => logout()}
        />
        <CustomButton
          disabled={!dirty || !enablePassword}
          label="Save"
          buttonType="primary"
          type="submit"
          isLoading={isSubmitting}
        />
      </div>
      <CustomSnackbar
        openState={openSnackbar}
        setOpenState={setOpenSnackbar}
        message="Changed password successfully!"
      />
    </form>
  );
};

export default ProfileForm;
