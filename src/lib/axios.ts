import axios from "axios";
import { env } from "../config/constants";

const api = axios.create(
    {
        baseURL: env.API_URL,
        headers: {
            "Content-Type": "application/json",
        }
    }
);


const setToken = async(token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return "Token Set";
}

export default api

export { api, setToken };