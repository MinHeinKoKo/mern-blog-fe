import React, { useState } from "react";
import { createPortal } from "react-dom";
import { stables } from "../constants";
import { HiOutlineCamera } from "react-icons/hi";
import CropEasy from "./crop/CropEasy";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfilePicture } from "../services/index/users";
import { setUserInfo } from "../store/reducers/userReducer";

const ProfilePicture = ({ avatar }) => {
  const user = useSelector(state => state.user.userInfo)
  const [openCrop, setOpenCrop] = useState(false);
  const [photo, setPhoto] = useState(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto({ url: URL.createObjectURL(file), file });
    setOpenCrop(true);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ token, formData }) => {
      return updateProfilePicture({
        token: token,
        formData: formData,
      });
    },
    onSuccess: (data) => {
      dispatch(setUserInfo(data));
      setOpenCrop(false)
      localStorage.setItem("account", JSON.stringify(data)),
        queryClient.invalidateQueries(["profile"]);
      toast.success("Profile photo is removed");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleDeleteImage = async() => {
    if(window.confirm("Do you want to delete your profile picture."))
    try {
      const formData = new FormData();
      formData.append("profilePicture", undefined);
      mutate({token : user.token , formData : formData })
    } catch (error) {
        toast.error(error.message)
        console.log(error)
    }
  }
  return (
    <>
      {openCrop &&
        createPortal(
          <CropEasy photo={photo} setOpenCrop={setOpenCrop} />,
          document.getElementById("portal")
        )}
      <div className="w-full flex items-center gap-x-4">
        <div className="relative w-20 h-20 rounded-full outline outline-offset-2 outline-1 outline-primary overflow-hidden">
          <label
            htmlFor="profilePicture"
            className="cursor-pointer absolute inset-0 rounded-full bg-transparent"
          >
            {avatar ? (
              <img
                src={stables.UPLOAD_FOLDER_BASE_URL+avatar}
                className="w-full h-full object-cover"
                alt="profile"
              />
            ) : (
              <div className="w-full h-full bg-blue-50/50 flex justify-center items-center">
                <HiOutlineCamera className="w-7 h-auto text-primary" />
              </div>
            )}
          </label>
          <input
            type="file"
            name=""
            id="profilePicture"
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="button"
          onClick={handleDeleteImage}
          className="border border-red-500 rounded-lg px-4 py-2 text-red-500"
        >
          Delete
        </button>
      </div>
    </>
  );
};

export default ProfilePicture;
