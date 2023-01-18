import React from "react";
import RecordHeader from "../../../components/RecordHeader";
import CertFloatingButton from "../../CertFloatingButton";
import Calender from "./components/Calendar";

function CalendarPage(){
  return <>
    <RecordHeader/>
    <Calender/>
    <CertFloatingButton />
  </>;
};

export default CalendarPage;