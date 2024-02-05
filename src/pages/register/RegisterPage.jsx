import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import MainLayout from "../../components/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../services/index/users";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../store/reducers/userReducer";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ name, email, password }) => {
      return signup({ name, email, password });
    },
    onSuccess: (data) => {
      dispatch(setUserInfo(data));
      localStorage.setItem("account", JSON.stringify(data));
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });
  const submitHandler = (data) => {
    const { name, email, password } = data;
    mutate({ name, email, password });
  };
  const password = watch("password");
  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="font-montserrat text-2xl font-bold text-center text-dark-hard mb-8">
            Sign Up
          </h1>
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
                Password
              </label>
              <input
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  minLength: {
                    value: 5,
                    message: "Password length must be 5 characters",
                  },
                })}
                type="password"
                id="password"
                placeholder="Enter your password"
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
            <div className="flex flex-col mb-6 w-full">
              <label
                htmlFor="cPassword"
                className="text-[#5a7184] font-semibold block"
              >
                Confirm Password
              </label>
              <input
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: "Confirm Password is required",
                  },
                  validate: (value) => {
                    if (value !== password) {
                      return "Passwords do not match";
                    }
                  },
                })}
                type="password"
                id="cPassword"
                placeholder="Enter your password"
                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border border-[#c3cad9] ${
                  errors?.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {errors?.confirmPassword?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors?.confirmPassword?.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="bg-primary text-white font-bold text-lg py-4 px-8 w-full rounded-lg mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Register
            </button>
            <p className="text-sm font-semibold text-[#5a7184]">
              You have an account?{" "}
              <Link to="/login" className="text-primary">
                Login Now
              </Link>
            </p>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default RegisterPage;
