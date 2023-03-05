import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';

function getCurrentVersion(success: (response: AxiosResponse) => void) {
  axiosInstance
    .get(`/version`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log('version-error')
    });
}

export { getCurrentVersion };
