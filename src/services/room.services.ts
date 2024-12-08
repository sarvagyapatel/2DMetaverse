import axios from "axios"
import { Room } from "../types/user.types"

export const createRoom = async(data: Room)=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/room/createroom`, data, {withCredentials: true});
        console.log(response)
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
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/room/joinroom`, data, {withCredentials: true});
        return response.data;
    } catch (error) {
        return error;
    }
}