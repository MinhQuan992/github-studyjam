"use client";

import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

const CredentialSchema = yup.object({
  username: yup.string().required("Username is required."),
  password: yup.string().required("Password is required."),
});

type CredentialSchemaType = yup.InferType<typeof CredentialSchema>;

const LoginForm = () => {
  const formik = useFormik<CredentialSchemaType>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: CredentialSchema,
    onSubmit: (values) => {
      // TODO: change the logic here
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          className="pb-4"
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          fullWidth
          className="pb-4"
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          type="submit"
          className="w-full border-solid border"
          color="primary"
        >
          Log in
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
