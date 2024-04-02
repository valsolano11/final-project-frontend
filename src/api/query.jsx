//Importacion del token por el localstorage,ya que arroja error por axios.
import axios from "axios";
import { URL_API } from "./variables";

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : "";
};

const api = axios.create({
  baseURL: URL_API,
});

api.interceptors.request.use((request) => {
  const token = getToken();
  request.headers.Authorization = token;
  return request;
});

export default api;
