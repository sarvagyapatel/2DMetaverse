import axios from "axios"
import { User } from "../types/user.types";


export const userRegister = async(data:User)=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/users/register`, data);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const userLogin = async(data:User)=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/users/login`, data);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const userLogout = async()=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/users/logout`, {withCredentials: true});
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getCurrentUser = async()=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/users/currentuser`, {withCredentials: true});
        return response.data;
    } catch (error) {
        return error;
    }
}

export const updateUser = async(data:User)=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/users/updateuser`, data, {withCredentials: true});
        return response.data;
    } catch (error) {
        return error;
    }
}

