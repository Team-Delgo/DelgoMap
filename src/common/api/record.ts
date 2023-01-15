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
    .get(`/calendar/${userId}`)
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

export { getMapData, sendEmail, getCalendarData };
