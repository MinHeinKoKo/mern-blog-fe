import React, { useState } from "react";
import MainLayout from "../../components/MainLayout";
import BreadCrumbs from "../../components/BreadCrumbs";
import { images, stables } from "../../constants";
import { Link, useParams } from "react-router-dom";
import SuggestedPosts from "./container/SuggestedPosts";
import CommentsContainer from "../../components/comments/CommentsContainer";
import SocialShareButtons from "../../components/SocialShareButtons";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getSinglePost } from "../../services/index/posts";
import { generateHTML } from "@tiptap/html";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import parse from "html-react-parser";
import ArticleDetailSkeleton from "./components/ArticleDetailSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import { useSelector } from "react-redux";
import Editor from "../../components/editor/Editor";
import pareJsonToHtml from "../../utils/parseJsonToHtml";

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [BreadCrumbsData, setBreadCrumbsData] = useState([]);
  const [body, setBody] = useState(null);
  const user = useSelector((state) => state.user.userInfo);
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
    onSuccess: (data) => {
      setBreadCrumbsData([
        {
          name: "Home",
          link: "/",
        },
        {
          name: "Blog",
          link: "/blog",
        },
        {
          name: "Article tile",
          link: `/blog/${data?.slug}`,
        },
      ]);
      setBody(pareJsonToHtml(data?.body));
      // console.log(body)
    },
  });

  const { data: postData } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
  });
  return (
    <MainLayout>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="Couldn't fetch the post detail" />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <BreadCrumbs data={BreadCrumbsData} />
            <img
              src={
                data?.photo
                  ? stables.UPLOAD_FOLDER_BASE_URL + data?.photo
                  : images.Breathe
              }
              className="w-full object-cover rounded-xl"
              alt={data?.title}
            />
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
            {!isLoading && !isError && (
              <Editor content={data?.body} editable={false} />
            )}
            <CommentsContainer
              className="mt-10"
              postSlug={slug}
              comments={data?.comments}
              logginedUserId={user?._id}
            />
          </article>
          <div>
            <SuggestedPosts
              header="Latest Article"
              posts={postData?.data?.posts}
              className="mt-8 lg:mt-0 lg:max-w-xs"
              tags={data?.tags}
            />
            <div className="mt-7 ">
              <h2 className="font-montserrat font-medium text-dark-hard mb-4 md:text-xl">
                Share :on
              </h2>
              <SocialShareButtons
                url={encodeURI(window.location.href)}
                title={encodeURIComponent(data?.title)}
              />
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ArticleDetailPage;
