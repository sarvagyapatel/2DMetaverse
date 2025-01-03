
export type User = {
    id: number,
    username: string,
    email: string,
    password: string,
    status: string,
    x_axis: number,
    y_axis: number,
    roomId: number 
}

export type Room = {
    id?: number,
    roomName: string,
    accessKey?: string
}