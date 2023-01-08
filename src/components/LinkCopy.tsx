import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "../common/icons/link.svg";
import { mapAction } from "../redux/mapSlice";
import "./LinkCopy.scss";

function LinkCopy() {
  const dispatch = useDispatch();
  const url = useSelector((state: any) => state.link);

  const buttonClickHandler = () => {
    navigator.clipboard.writeText(url);
    dispatch(mapAction.setIsCopy());
    setTimeout(() => {
      dispatch(mapAction.setIsCopyFalse());
    }, 2000);
  };
  return (
    <div className="link" aria-hidden="true" onClick={buttonClickHandler}>
      <img src={Link} alt="link" />
    </div>
  );
}

export default LinkCopy;
