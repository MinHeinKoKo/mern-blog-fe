import React from "react";
import ArticleCard from "../../../components/ArticleCard";
import { FaArrowRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../../services/index/posts";
import toast from "react-hot-toast";
import ArticleCardSkeleton from "../../../components/ArticleCardSkeleton";
import ErrorMessage from "../../../components/ErrorMessage";

const Articles = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => {
      return getAllPosts();
    },
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error.message);
    },
  });

  return (
    <section className="container mx-auto flex flex-col md:gap-x-5 gap-y-5 px-5 py-10">
      <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
        {isLoading ? (
          [...Array(3)].map((item, index) => (
            <ArticleCardSkeleton
              key={index}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
            />
          ))
        ) : isError ? (
          <ErrorMessage message="Couldn't fetch the posts" />
        ) : (
          data?.data?.posts?.map((post, index) => (
            <ArticleCard
              key={index}
              post={post}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
            />
          ))
        )}
      </div>

        <button className="mx-auto flex items-center gap-x-2 font-bold text-primary border-2 border-primary px-6 py-3 rounded-lg">
          <span>More Article</span>
          <FaArrowRight className="w-3 h-3" />
        </button>

    </section>
  );
};

export default Articles;
