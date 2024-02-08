import * as yup from "yup";

export const CredentialSchema = yup.object({
  username: yup.string().required("Username is required."),
  password: yup.string().required("Password is required."),
});

export type CredentialSchemaType = yup.InferType<typeof CredentialSchema>;
