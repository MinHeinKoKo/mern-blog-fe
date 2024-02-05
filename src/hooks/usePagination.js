import { useMemo } from "react";

export const DOTS = "..."

export const usePagination = ({
//   totalCount,
//   pageSize,
  siblingCount = 1,
  currentPage,
  totalPageCount,
}) => {
  const paginationRange = useMemo(() => {
    //our core logic goes here
    const totalPageNumber = siblingCount + 5;

    //State: 1 : if the number of pages is less than the page numbers
    if(totalPageNumber >= totalPageCount){
        return range(1,totalPageCount)
    }

    //calculating the left and right sibling index
    const leftSiblingIndex = Math.max(currentPage - siblingCount , 1)
    const rightSiblingIndex = Math.min(currentPage+ siblingCount , totalPageCount)

    //calculating that whether we want to show the left dots , right dot or both of them
    //we don't show dots just when there is just one page number to be inserted between the sibling and the page limit
    const shouldShowLeftDots = leftSiblingIndex;
    const shouldShowRightDots = rightSiblingIndex;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount

    //state 2;No left dots to show , but right dots to show
    if(!shouldShowLeftDots && shouldShowRightDots){
        let leftItemCount = 3 + 2 *  siblingCount;
        let leftRange = range(1, leftItemCount)
        return [...leftRange, DOTS, totalPageCount]
    }

    //State 3: No right dots to show , but left dots to show
    if(shouldShowLeftDots && !shouldShowRightDots){
        let rightItemCount = 3+2 * siblingCount;
        let rightRange = range(totalPageCount - rightItemCount + 1)
        return [firstPageIndex , DOTS, ...rightRange]
    }

    //stage 4 : Both left and right dots to show
    if(shouldShowLeftDots && shouldShowRightDots){
        let middleRange = range(leftSiblingIndex , rightSiblingIndex )
        return [firstPageIndex , DOTS , middleRange , DOTS , lastPageIndex]
    }

  }, [
    // totalCount,
    // pageSize,
    siblingCount,
    currentPage,
    totalPageCount,
  ]);
  return paginationRange;
};

function range(start , end){
    const length = end - start + 1;
    return Array.from({length}, (value , index)=> index + start)
}
