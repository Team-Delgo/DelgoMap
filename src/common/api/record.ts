import axios, { AxiosResponse } from "axios";

function getMapData(success: (data: AxiosResponse) => void, dispatch: any) {
  axios
    .get(`https://www.reward.delgo.pet:8443/map/mungple?categoryCode=CA0002`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export { getMapData };
