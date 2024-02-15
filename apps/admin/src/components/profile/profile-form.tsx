"use client";

import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import CustomButton from "@repo/ui/custom-button";
import CustomSnackbar from "@repo/ui/custom-snackbar";
import { useFormik } from "formik";
import { useState } from "react";
import { ProfileFormSchema } from "@lib/definitions";
import type { ProfileFormSchemaType } from "@lib/definitions";
import type { UserInterface } from "@models/user";
import { changePassword, logout } from "@actions/profile-action";

interface ProfileFormProps {
  user: UserInterface;
}

function ProfileForm({ user }: ProfileFormProps) {
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
    onSubmit: async (formValues) => {
      await changePassword(formValues);
      resetForm();
      setEnablePassword(false);
      setOpenSnackbar(true);
    },
  });

  return (
    <form className="flex flex-col gap-5 py-5 max-w-lg" onSubmit={handleSubmit}>
      <TextField
        disabled
        id="fullName"
        label="Full Name"
        value={user.fullName}
      />
      <TextField
        disabled
        id="username"
        label="Username"
        value={user.username}
      />
      <FormControlLabel
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
        label="Change password"
      />
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
          label="Log out"
          onClick={() => logout()}
        />
        <CustomButton
          buttonType="primary"
          disabled={!dirty || !enablePassword}
          isLoading={isSubmitting}
          label="Save"
          type="submit"
        />
      </div>
      <CustomSnackbar
        message="Changed password successfully!"
        openState={openSnackbar}
        setOpenState={setOpenSnackbar}
      />
    </form>
  );
}

export default ProfileForm;
