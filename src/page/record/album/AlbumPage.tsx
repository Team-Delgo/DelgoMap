import React from "react";
import RecordHeader from "../../../components/RecordHeader";
import CertFloatingButton from "../../CertFloatingButton";
import Photo from "./components/Photo";

function AlbumPage() {
  return (
    <>
      <RecordHeader />
      <Photo/>
      <CertFloatingButton />
    </>
  );
}

export default AlbumPage;
