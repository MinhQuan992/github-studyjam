"use client";

import { Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import type { CredentialSchemaType } from "@lib/definitions";
import { CredentialSchema } from "@lib/definitions";
import { authenticate } from "@actions/authentication-action";
import CustomSnackbar from "@repo/ui/custom-snackbar";

function LoginForm() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const {
    values,
    touched,
    errors,
    status,
    isSubmitting,
    setStatus,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useFormik<CredentialSchemaType>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: CredentialSchema,
    onSubmit: async (formValues) => {
      const response = await authenticate(formValues);
      if (!response.success) {
        setStatus(response.message);
        setOpenSnackbar(true);
      }
    },
  });

  return (
    <div className="flex justify-center w-screen">
      <form className="flex flex-col gap-4 w-1/3" onSubmit={handleSubmit}>
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
        <TextField
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
        <Button
          className="!border-solid !border"
          disabled={isSubmitting}
          endIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
          type="submit"
        >
          Log in
        </Button>
        <CustomSnackbar
          message={status}
          openState={openSnackbar}
          setOpenState={setOpenSnackbar}
          type="error"
        />
      </form>
    </div>
  );
}

export default LoginForm;
