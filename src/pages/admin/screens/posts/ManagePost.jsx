import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deletePost, getAllPosts } from "../../../../services/index/posts";
import { images, stables } from "../../../../constants";
import Pagination from "../../../../components/Pagination";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

let isFirstRun = true;

const ManagePost = () => {
  const user = useSelector(state => state.user.userInfo)
  const queryClient = useQueryClient()
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: postsData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: () => {
      return getAllPosts(searchKeyword, currentPage);
    },
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const { mutate : mutateDeletePost, isLoading: mutateDeleteLoading } = useMutation({
    mutationFn: ({ slug , token }) => {
      return deletePost({slug , token})
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Post is deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    if (isFirstRun) {
      refetch();
      return;
    }
    refetch();
  }, [refetch, currentPage]);

  const deletePostHandler = ({slug , token}) => {
    window.confirm("Do you want to this posts?")
    mutateDeletePost({slug , token})
    // console.log({slug , token})
  }

  const searchKeywordHandler = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);
  };
  const submitSearchKeywordHandler = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold">Manage Posts</h1>
      <div className="px-4 w-full mx-auto">
        <div className="py-8">
          <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
            <h2 className="text-2xl leading-tight">Users</h2>
            <div className="text-end">
              <form
                onSubmit={submitSearchKeywordHandler}
                className="flex flex-col justify-center w-3/4 max-w-sm space-y-3 md:flex-row md:w-full md:space-x-3 md:space-y-0"
              >
                <div className=" relative ">
                  <input
                    type="text"
                    id='"form-subscribe-Filter'
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Post Title"
                    onChange={searchKeywordHandler}
                    value={searchKeyword}
                  />
                </div>
                <button
                  className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
                  type="submit"
                >
                  Filter
                </button>
              </form>
            </div>
          </div>
          <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
            <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      Created at
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    >
                      Tags
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading || isFetching ? (
                    <tr>
                      <td colSpan={5} className="text-center w-full py-10">
                        Loading ....
                      </td>
                    </tr>
                  ) : postsData?.data?.length === 0 ?(
                    <tr>
                      <td colSpan={5} className="text-center w-full py-10">
                        No posts found
                      </td>
                    </tr>
                  ) : (
                    postsData?.data?.posts?.map((post, index) => (
                      <tr key={index}>
                        <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <a href="#" className="relative block">
                                <img
                                  alt="profile"
                                  src={
                                    post?.photo
                                      ? stables.UPLOAD_FOLDER_BASE_URL +
                                        post?.photo
                                      : images.Sample
                                  }
                                  className="mx-auto object-cover rounded-lg aspect-square w-10 "
                                />
                              </a>
                            </div>
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {post?.title}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {post?.categories?.length > 0
                              ? post.categories[0]
                              : "Uncategorized"}
                          </p>
                        </td>
                        <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {new Date(post?.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </td>
                        <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                          <div className="flex gap-x-2 flex-wrap">
                            {post?.tags?.length > 0
                              ? post?.tags?.map((tag, index) => (
                                  <p key={index}>
                                    {tag}
                                    {post?.tags.length - 1 !== index && ","}
                                  </p>
                                ))
                              : "No Tags"}
                          </div>
                        </td>
                        <td className="px-5 py-5 text-sm bg-white space-x-5 border-b border-gray-200">
                          <button disabled={mutateDeleteLoading} onClick={()=>deletePostHandler({slug: post?.slug , token : user?.token})} className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed" >Delete</button>
                          <Link
                            to={`/admin/posts/manage/edit/${post?.slug}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {postsData?.data?.length !== 0 && !isLoading && (
                <Pagination
                  onPageChange={(page) => setCurrentPage(page)}
                  currentPage={currentPage}
                  totalPageCount={postsData?.data?.info?.totalpagecount}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePost;
