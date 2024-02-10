import React from "react";
import LoginForm from "@components/login/login-form";

const Page = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-blue-700 py-4 lg:text-8xl lg:py-8 sm:text-6xl sm:py-6">
        Git & GitHub Study Jam
      </h1>
      <h1 className="text-xl font-medium text-blue-700 pb-8 lg:text-5xl lg:pb-12 sm:text-3xl sm:pb-10">
        Management Site
      </h1>
      <LoginForm />
    </div>
  );
};

export default Page;
