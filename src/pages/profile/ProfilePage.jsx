import React, { useEffect , useMemo } from "react";
import { useForm } from "react-hook-form";
import MainLayout from "../../components/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateProfile } from "../../services/index/users";
import ProfilePicture from "../../components/ProfilePicture";
import { setUserInfo } from "../../store/reducers/userReducer";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const queryClient = useQueryClient();

  const {
    data: profileData,
    isLoading: profileIsLoading,
    error: profileError,
  } = useQuery({
    queryFn: () => {
      return getUserProfile({ token: user.token });
    },
    queryKey: ["profile"],
  });

  const { mutate, isLoading : updateProfileIsLoading } = useMutation({
    mutationFn: ({ name, email, password }) => {
      return updateProfile({
        token: user.token,
        userData: { name, email, password },
      });
    },
    onSuccess: (data) => {
      dispatch(setUserInfo(data));
      localStorage.setItem("account", JSON.stringify(data)),
        queryClient.invalidateQueries(["profile"]);
      toast.success("Profile has updated");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
    values: useMemo(() => {
      return {
        name: profileIsLoading ? "" : profileData?.name,
      email: profileIsLoading ? "" : profileData?.email,
      }
    }, [profileData?.email, profileData?.name , profileIsLoading ]),
    mode: "onChange",
  });

  const submitHandler = (data) => {
    const { name, email, password } = data;
    mutate({ name, email, password });
  };

  return (
    <MainLayout>
      <section className="relative container mx-auto px-5 py-10">
        <div className="w-full max-w-sm mx-auto">
          <ProfilePicture avatar={profileData?.avatar} />
          <form action="" onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col mb-6 w-full">
              <label
                htmlFor="name"
                className="text-[#5a7184] font-semibold block"
              >
                Name
              </label>
              <input
                {...register("name", {
                  minLength: {
                    value: 1,
                    message: "Name length must be at least 1 Character",
                  },
                  required: {
                    value: true,
                    message: "Name is required",
                  },
                })}
                type="text"
                id="name"
                placeholder="Enter your Name"
                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border border-[#c3cad9] ${
                  errors?.name ? "border-red-500" : ""
                }`}
              />
              {errors?.name?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors?.name?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col mb-6 w-full">
              <label
                htmlFor="email"
                className="text-[#5a7184] font-semibold block"
              >
                Email
              </label>
              <input
                {...register("email", {
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Enter a valid email",
                  },
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                })}
                type="email"
                id="email"
                placeholder="Enter your Email address"
                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border border-[#c3cad9] ${
                  errors?.email ? "border-red-500" : ""
                }`}
              />
              {errors?.email?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors?.email?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col mb-6 w-full">
              <label
                htmlFor="password"
                className="text-[#5a7184] font-semibold block"
              >
                New Password
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                placeholder="Enter your new password"
                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border border-[#c3cad9] ${
                  errors?.password ? "border-red-500" : ""
                }`}
              />
              {errors?.password?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors?.password?.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!isValid || profileIsLoading || updateProfileIsLoading }
              className="bg-primary text-white font-bold text-lg py-4 px-8 w-full rounded-lg mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Update Profile
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default ProfilePage;
