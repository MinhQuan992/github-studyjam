"use client";

import { Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { CredentialSchemaType, CredentialSchema } from "@lib/definitions";
import { authenticate } from "@actions/authentication-action";

const LoginForm = () => {
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
    onSubmit: async (values) => {
      const result = await authenticate(values);
      setStatus(result);
    },
  });

  const resetStatus = () => {
    setStatus("");
  };

  return (
    <div>
      <form
        className="flex flex-col items-center w-screen"
        onSubmit={handleSubmit}
      >
        <TextField
          className="pb-4 w-1/3"
          id="username"
          name="username"
          label="Username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={resetStatus}
          error={touched.username && Boolean(errors.username)}
          helperText={touched.username && errors.username}
        />
        <TextField
          className="pb-4 w-1/3"
          id="password"
          name="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={resetStatus}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password}
        />
        <Button
          type="submit"
          className="w-1/3 border-solid border"
          endIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
          disabled={isSubmitting}
        >
          Log in
        </Button>
        {status && <p className="w-1/3 text-red-600 pt-4">{status}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
