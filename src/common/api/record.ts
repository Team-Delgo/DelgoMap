import axios, { AxiosResponse } from "axios";
import { AnyAction, Dispatch } from "redux";

function getMapData(
  success: (data: AxiosResponse) => void,
  dispatch: Dispatch<AnyAction>
) {
  axios
    .get(`https://www.reward.delgo.pet:8443/map/mungple?categoryCode=CA0002`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getCalendarData(userId: number, success: (data: AxiosResponse) => void, dispatch: any) {
  axios
    .get(`https://www.reward.delgo.pet:8443/calendar/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function sendEmail(
  email: string,
  success: (data: AxiosResponse) => void,
  dispatch: Dispatch<AnyAction>
) {
  axios
    .post(`https://www.reward.delgo.pet:8443/survey`, {
      email
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getPhotoData(
  userId: number,
  categoryCode: string,
  currentPage: number,
  pageSize: number,
  isDesc: boolean,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axios
    .get(
      `https://www.reward.delgo.pet:8443/certification/category?categoryCode=${categoryCode}&userId=${userId}&currentPage=${currentPage}&pageSize=${pageSize}&isDesc=${isDesc}`,
    )
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getPhotoCount(userId: number, success: (data: AxiosResponse) => void, dispatch: any) {
  axios
    .get(`https://www.reward.delgo.pet:8443/certification/count/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export { getMapData, sendEmail, getCalendarData, getPhotoData, getPhotoCount };
