import axios from "axios"
import { Room } from "../types/user.types"

export const createRoom = async(data: Room)=>{
    try {
        const token = localStorage.getItem("auth_token");
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/room/createroom`, data, {
            headers: {
                Authorization: `Bearer${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getAllRooms = async()=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/room/allrooms`);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const joinRoom = async(data: Room)=>{
    try {
        const token = localStorage.getItem("auth_token");
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/room/joinroom`, data, {
            headers: {
                Authorization: `Bearer${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
}