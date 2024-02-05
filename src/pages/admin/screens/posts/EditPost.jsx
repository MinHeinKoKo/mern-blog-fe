import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getSinglePost, updatePost } from "../../../../services/index/posts";
import { Link, useParams } from "react-router-dom";
import ArticleDetailSkeleton from "../../../article/components/ArticleDetailSkeleton";
import { useSelector } from "react-redux";
import { images, stables } from "../../../../constants";
import ErrorMessage from "../../../../components/ErrorMessage";
import pareJsonToHtml from "../../../../utils/parseJsonToHtml";
import { HiOutlineCamera } from "react-icons/hi";
import toast from "react-hot-toast";
import Editor from "../../../../components/editor/Editor";

const EditPost = () => {
  const { slug } = useParams();
  const [photo, setPhoto] = useState(null);
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user.userInfo);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
  });

  const { mutate: mutateUpdatePostDetail, isLoading: isLoadingUpdatePost } =
    useMutation({
      mutationFn: ({ updatedData, slug, token }) =>
        updatePost({ updatedData, slug, token }),
      onSuccess: (data) => {
        queryClient.invalidateQueries(["blog", slug]);
        toast.success("Post is updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error.message);
      },
    });

  useEffect(() => {
    if (!isLoading && !isError) {
      setInitialPhoto(data?.photo);
      // setBody(pareJsonToHtml(data?.body));
    }
  }, [isLoading, isError]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleUpdatePost = async () => {
    let updatedData = new FormData();
    if (!initialPhoto && photo) {
      updatedData.append("postPicture", photo);
    } else if (initialPhoto && !photo) {
      const urlToObject = async (url) => {
        let response = await fetch(url);
        let blob = await response.blob();
        const file = new File([blob], initialPhoto, { type: blob.type });
        return file;
      };
      const picture = await urlToObject(
        stables.UPLOAD_FOLDER_BASE_URL + data?.photo
      );
      updatedData.append("postPicture", picture);
    }
    updatedData.append("document", JSON.stringify({body}));
    mutateUpdatePostDetail({ updatedData, slug, token: user?.token });
  };

  const handleDeleteImage = () => {
    if (window.confirm("Do you want to delete you Post image")) {
      setInitialPhoto(null);
      setPhoto(null);
    }
  };

  return (
    <div>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="Couldn't fetch the post detail" />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <label htmlFor="postPicture" className="w-full cursor-pointer">
              {" "}
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : initialPhoto ? (
                <img
                  src={stables.UPLOAD_FOLDER_BASE_URL + data?.photo}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : (
                <div className="w-full h-full min-h-[200px] bg-blue-50/50 flex items-center justify-center">
                  <HiOutlineCamera className="w-7 h-auto text-primary" />
                </div>
              )}{" "}
            </label>
            <input
              type="file"
              className="sr-only"
              id="postPicture"
              onClick={handleFileChange}
            />
            <button
              onClick={handleDeleteImage}
              className="w-fit bg-red-500 text-white px-2 py-1 mt-5 font-semibold rounded-lg"
            >
              Delete Image
            </button>
            <div className="flex mt-4 gap-2">
              {data?.categories?.map((category, index) => {
                <Link
                  key={index}
                  to={`/blog?category=${category.name}`}
                  className="text-primary text-sm font-montserrat inline-block mt-4 md:text-base"
                >
                  {category?.name}
                </Link>;
              })}
            </div>
            <h1 className="text-xl font-medium font-montserrat mt-4 text-dark-hard md:text-[26px]">
              {data?.title}
            </h1>
            <div className="w-full">
              {!isLoading && !isError && (
                <Editor content={data?.body} editable={true} onDataChange={(data)=> {
                  setBody(data)
                } } />
              )}
            </div>
            <button
              disabled={isLoadingUpdatePost}
              onClick={handleUpdatePost}
              className="w-full bg-green-500 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Update
            </button>
          </article>
        </section>
      )}
    </div>
  );
};

export default EditPost;
