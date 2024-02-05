import React, { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import { getCommentsData } from "../../data/comments";
import Comment from "./Comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, updateComment } from "../../services/index/comments";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const CommentsContainer = ({
  postSlug,
  className,
  logginedUserId,
  comments,
}) => {
const queryClient = useQueryClient();
  const user = useSelector((state) => state.user.userInfo);
  const [affectedComment, setAffectedComment] = useState(null);

  const { mutate: mutateNewComment, isLoading: isLoadingNewComment } =
    useMutation({
      mutationFn: ({ token, desc, slug, parent, replyOnUser }) => {
        return createComment({ token , desc, slug , parent , replyOnUser });
      },
      onSuccess:()=> {
        toast.success("Your comment is send successfully, it will be visible after the confirmation of the ADMIN")
        setAffectedComment(null)
      },
      onError: () => {
        toast.error(error)
        console.log(error)
      }
    });

    const { mutate: mutateUpdateComment, isLoading: isLoadingUpdateComment } =
    useMutation({
      mutationFn: ({ token, desc,commentId }) => {
        return updateComment({ token , desc, commentId });
      },
      onSuccess:()=> {
        toast.success("Your comment is updated successfully.")
        queryClient.invalidateQueries(["blog", postSlug])
        setAffectedComment(null)
      },
      onError: () => {
        toast.error(error)
        console.log(error)
      }
    });

    const { mutate: mutateDeleteComment } =
    useMutation({
      mutationFn: ({ token, desc,commentId }) => {
        return deleteComment({ token , commentId });
      },
      onSuccess:()=> {
        toast.success("Your comment is deleted successfully.")
        queryClient.invalidateQueries(["blog", postSlug])
        setAffectedComment(null)
      },
      onError: () => {
        toast.error(error)
        console.log(error)
      }
    });

  const addCommentHandler = (value, parent = null, replyOnUser = null) => {
    mutateNewComment({
      desc: value,
      parent,
      replyOnUser,
      token: user?.token,
      slug: postSlug,
    });
  };

  const updateCommentHandler = (value, commentId) => {
    mutateUpdateComment({desc: value , token : user?.token , commentId})
  };
  const deleteCommentHandler = (commentId) => {
    mutateDeleteComment({token : user.token , commentId})
  };

  return (
    <div className={`${className}`}>
      <CommentForm
        btnLabel="Send"
        loading = {isLoadingNewComment}
        formSubmitHandler={(value) => addCommentHandler(value)}
      />
      <div className="space-y-4 mt-8">
        {comments?.map((comment, index) => (
          <Comment
            key={index}
            comment={comment}
            logginedUserId={logginedUserId}
            affectedComment={affectedComment}
            setAffectedComment={setAffectedComment}
            addComment={addCommentHandler}
            updateComment={updateCommentHandler}
            deleteComment={deleteCommentHandler}
            replies={comment.replies}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsContainer;
