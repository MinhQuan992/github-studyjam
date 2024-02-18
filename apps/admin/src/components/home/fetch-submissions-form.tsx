"use client";

import { TextField } from "@mui/material";
import CustomButton from "@repo/ui/custom-button";
import CustomSnackbar from "@repo/ui/custom-snackbar";
import { useFormik } from "formik";
import { useState } from "react";
import { FetchSubmissionsFormSchema } from "@lib/definitions";
import type {
  FetchSubmissionsFormSchemaType,
  GoogleSheetsApiResponseError,
} from "@lib/definitions";
import { fetchFormSubmissions } from "@actions/marking-action";
import { actionWithRole } from "@actions/base-action";
import { UserRoles } from "@lib/constants";

function FetchSubmissionsForm() {
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const {
    values,
    touched,
    errors,
    isSubmitting,
    dirty,
    status,
    setStatus,
    handleSubmit,
    handleChange,
    handleBlur,
    resetForm,
  } = useFormik<FetchSubmissionsFormSchemaType>({
    initialValues: {
      sheetId: "",
      range: "Form Responses 1",
    },
    validationSchema: FetchSubmissionsFormSchema,
    onSubmit: async (formValues) => {
      const result = await actionWithRole(
        UserRoles.SuperAdmin,
        fetchFormSubmissions,
        formValues.sheetId,
        formValues.range
      );
      if (result.success) {
        resetForm();
        setOpenSuccessSnackbar(true);
      } else {
        setStatus((result.data as GoogleSheetsApiResponseError).error);
        setOpenErrorSnackbar(true);
      }
    },
  });

  return (
    <div className="flex flex-col gap-4 items-center pb-4">
      <h1 className="text-2xl font-semibold">Fetch Form Submissions</h1>
      <form
        className="flex flex-col gap-4 items-center"
        onSubmit={handleSubmit}
      >
        <TextField
          className="w-96"
          error={touched.sheetId && Boolean(errors.sheetId)}
          helperText={touched.sheetId ? errors.sheetId : null}
          id="sheetId"
          label="Sheet ID"
          name="sheetId"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.sheetId}
        />
        <TextField
          className="w-96"
          error={touched.range && Boolean(errors.range)}
          helperText={touched.range ? errors.range : null}
          id="range"
          label="Range"
          name="range"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.range}
        />
        <CustomButton
          buttonType="primary"
          disabled={!dirty}
          isLoading={isSubmitting}
          label="Fetch"
          type="submit"
        />
      </form>
      <CustomSnackbar
        message="Fetched submissions successfully!"
        openState={openSuccessSnackbar}
        setOpenState={setOpenSuccessSnackbar}
      />
      <CustomSnackbar
        message={status}
        openState={openErrorSnackbar}
        setOpenState={setOpenErrorSnackbar}
        type="error"
      />
    </div>
  );
}

export default FetchSubmissionsForm;
