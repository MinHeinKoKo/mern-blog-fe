import React from "react";

const ArticleCardSkeleton = ({className}) => {
  return (
    <>
      <div
        className={`rounded-xl overflow-hidden shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] w-full md:w-[calc(50%)] ${className} animate-pulse`}
      >
        {/* image */}
        <div className="w-full aspect-video" />

        <div className="p-5">
          {/* title */}
          <div className="w-56 h-2 mt-4 bg-slate-300 rounded-lg" />
          {/* Caption */}
          <div className="w-56 h-2 mt-4 bg-slate-300 rounded-lg" />

          <div className="flex justify-between flex-nowrap items-center mt-6">
            <div className="flex items-center gap-x-2 md:gap-x-2.5">
              {/*User Image */}
              <div className="w-9 h-9 md:w-10 md:h-10 bg-slate-300 rounded-full" />

              <div className="flex flex-col">
                {/* User's name */}
                <div className="w-24 h-2 mt-4 bg-slate-300 rounded-lg" />
                {/* verified status */}
                <div className="w-16 h-2 mt-2 bg-slate-300 rounded-lg" />
              </div>
            </div>
            {/* Date */}
            <div className="w-10 h-2 mt-4 bg-slate-300 rounded-lg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleCardSkeleton;
