import React from "react";
import Header from "./components/header/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getUserProfile } from "../../services/index/users";

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  const {
    data: profileData,
    isLoading: profileIsLoading,
    error: profileError,
  } = useQuery({
    queryFn: () => {
      return getUserProfile({ token: user.token });
    },
    queryKey: ["profile"],
    onSuccess: () => {
      // console.log(profileData?.admin)
      // if (!profileData.admin) {
      //   navigate("/");
      //   toast.error("Your are not allowed to access admin panel.");
      // }
    },
    onError: (err) => {
      console.log(err);
      navigate("/");
      toast.error("Your are not allowed to access admin panel.");
    },
  });

  if (profileIsLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h3 className="text-2xl text-slate-700">Loading....</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen lg:flex-row">
      {" "}
      <Header />
      <main className="bg-[#F9F9F9] flex-1 p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
