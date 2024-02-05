import React, { useState } from "react";

const CommentForm = ({
  loading,
  btnLabel,
  formSubmitHandler,
  formCancelHandler = null,
  initialText = "",
}) => {
  const [value, setValue] = useState(initialText);
  const submitHandler = (e) => {
    e.preventDefault();
    formSubmitHandler(value);
    setValue("");
  };
  return (
    <form onSubmit={submitHandler}>
      <div className="flex flex-col items-end border border-primary rounded-lg p-4">
        <textarea
          className="w-full focus:outline-none bg-transparent"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Leave your comment here..."
          rows="5"
        ></textarea>
        <div className="flex flex-col-reverse gap-y-2 min-[420px]:flex-row items-center gap-x-2 pt-2">
          {formCancelHandler && (
            <button
              className="px-6 py-2.5 rounded-lg border border-red-500 text-red-500"
              onClick={formCancelHandler}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-primary text-white font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
