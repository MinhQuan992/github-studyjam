"use client";

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
  // TODO: change the return type to the correct type
  handleSave: (values: UserFormSchemaType) => void;
}

const UserForm = ({
  user,
  hasPasswordCheckbox = false,
  passwordCheckboxText = "",
  closeModal,
  handleSave,
}: UserFormProps) => {
  const {
    values,
    touched,
    errors,
    status,
    isSubmitting,
    setErrors,
    setStatus,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useFormik<UserFormSchemaType>({
    initialValues: {
      fullName: user?.fullName || "",
      username: user?.username || "",
      password: "",
    },
    validationSchema: UserFormSchema,
    onSubmit: async (values) => {
      handleSave(values);
      closeModal();
    },
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
          //onFocus={resetStatus}
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
          //onFocus={resetStatus}
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
                  setErrors({
                    password: "",
                  });
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
          //onFocus={resetStatus}
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
