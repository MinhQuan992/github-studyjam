import * as yup from "yup";

export const CredentialSchema = yup.object({
  username: yup.string().required("Username is required."),
  password: yup.string().required("Password is required."),
});

export type CredentialSchemaType = yup.InferType<typeof CredentialSchema>;

export const UserFormSchema = yup.object({
  fullName: yup.string().required("Full name is required."),
  username: yup
    .string()
    .min(5, "Username must contain at least 5 characters.")
    .required("Username is required."),
  newPassword: yup.boolean(),
  password: yup.string().when("newPassword", {
    is: true,
    then: (schema) =>
      schema
        .matches(
          /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
          "Password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character."
        )
        .required("Password is required."),
  }),
});

export type UserFormSchemaType = yup.InferType<typeof UserFormSchema>;

export const ProfileFormSchema = yup.object({
  password: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character."
    )
    .required("Password is required."),
});

export type ProfileFormSchemaType = yup.InferType<typeof ProfileFormSchema>;

export interface GoogleSheetsApiResponseSuccess {
  data: {
    range: string;
    majorDimension: string;
    values: string[][];
  };
}

export interface GoogleSheetsApiResponseError {
  error: string;
}

export const FetchSubmissionsFormSchema = yup.object({
  sheetId: yup.string().required("Sheet ID is required."),
  range: yup.string().required("Range is required."),
});

export type FetchSubmissionsFormSchemaType = yup.InferType<
  typeof FetchSubmissionsFormSchema
>;
