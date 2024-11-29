import { useEffect, useRef, useState } from "react";

type Props = {
    sender: string,
    receiver: string,
    connection: boolean
}

function TwoWay(prop: Props) {
    const [receiverId, setReceiverId] = useState<string>(prop.receiver);
    const [senderId, setSenderId] = useState(prop.sender);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const videoContainerRefSend = useRef<HTMLVideoElement>(null);
    const videoContainerRefReceive = useRef<HTMLVideoElement>(null);
    const [hasRemoteStream, setHasRemoteStream] = useState(false);
    const [hasSentStream, setHasSentStream] = useState(false);

    const pc = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
                urls: ["turn:68.183.81.222:3478", "turn:www.vps.sarvagyapatel.in:3478"],
                username: "user",
                credential: "Ayushsingh$12"
            }
        ]
    });

    const pcReceive = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
                urls: ["turn:68.183.81.222:3478", "turn:www.vps.sarvagyapatel.in:3478"],
                username: "user",
                credential: "Ayushsingh$12"
            }
        ]
    });

    useEffect(() => {
        setSenderId(prop.sender);
        setReceiverId(prop.receiver)
    }, [])


    const receiveVideo = async (socketGet: WebSocket | null) => {
        if (!socketGet) {
            alert("Socket not found");
            return;
        }

        socketGet.onmessage = async (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'createOffer') {
                try {
                    await pcReceive.setRemoteDescription(message.sdp);
                    const answer = await pcReceive.createAnswer();
                    await pcReceive.setLocalDescription(answer);

                    socketGet.send(JSON.stringify({
                        target: receiverId,
                        owner: 'receiver',
                        type: 'createAnswer',
                        sdp: answer
                    }));
                } catch (error) {
                    console.error("Error handling createOffer:", error);
                }
            } else if (message.type === 'iceCandidate') {
                try {
                    if (message.candidate) {
                        await pcReceive.addIceCandidate(message.candidate);
                    }
                } catch (error) {
                    console.error("Error adding ICE candidate:", error);
                }
            }
        };

        const remoteStream = new MediaStream();

        pcReceive.ontrack = (event) => {
            remoteStream.addTrack(event.track);
            setHasRemoteStream(true)
            const videoElement = videoContainerRefReceive.current;
            if (videoElement) {
                videoElement.srcObject = remoteStream;
            }
        };
    };


    const connect = async () => {
        if (!senderId) {
            console.error("Sender ID is required to connect");
            return;
        }

        const socketInstance = new WebSocket(`ws://localhost:8080/ws?clientId=${senderId}`);
        setSocket(socketInstance);

        socketInstance.onerror = (error) => {
            console.error("WebSocket error:", error);
            return;
        };



        socketInstance.onmessage = async (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'createOffer') {
                try {
                    await pcReceive.setRemoteDescription(message.sdp);
                    const answer = await pcReceive.createAnswer();
                    await pcReceive.setLocalDescription(answer);

                    socketInstance.send(JSON.stringify({
                        target: receiverId,
                        owner: 'receiver',
                        type: 'createAnswer',
                        sdp: answer
                    }));
                } catch (error) {
                    console.error("Error handling createOffer:", error);
                }
            } else if (message.type === 'iceCandidate') {
                try {
                    if (message.candidate) {
                        await pcReceive.addIceCandidate(message.candidate);
                    }
                } catch (error) {
                    console.error("Error adding ICE candidate:", error);
                }
            }
        };

        const remoteStream = new MediaStream();

        pcReceive.ontrack = (event) => {
            setHasRemoteStream(true)
            remoteStream.addTrack(event.track);
            const videoElement = videoContainerRefReceive.current;
            if (videoElement) {
                videoElement.srcObject = remoteStream;
            }
        };
    };


    useEffect(() => {
        connect();
    }, [prop.connection])




    const sendVideo = async (socketGet: WebSocket | null) => {
        if (!socketGet) {
            alert("Socket not found");
            return;
        }

        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socketGet?.send(JSON.stringify({
                target: receiverId,
                owner: 'sender',
                type: 'createOffer',
                sdp: pc.localDescription
            }));
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketGet?.send(JSON.stringify({
                    target: receiverId,
                    owner: 'sender',
                    type: 'iceCandidate',
                    candidate: event.candidate
                }));
            }
        };

        socketGet.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createAnswer') {
                await pc.setRemoteDescription(message.sdp);
                receiveVideo(socketGet);
            }
        };

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            const videoElement = videoContainerRefSend.current;
            if (videoElement) {
                videoElement.srcObject = stream;
                videoElement.muted = true;
                videoElement.play();
            }

            stream.getTracks().forEach((track) => pc.addTrack(track, stream));
            setHasSentStream(true)
        });

    };


    return (
        <div className="flex gap-36">
            <div className="relative w-60 h-40">

                <video
                    ref={videoContainerRefReceive}
                    className="w-full h-full bg-black object-cover border border-gray-300 rounded-md shadow-lg"
                    autoPlay
                    playsInline
                    muted={false}
                ></video>

                <video
                    ref={videoContainerRefSend}
                    className="absolute bottom-0 right-0 w-24 h-16 bg-black object-cover border-r border-b border-gray-300 rounded-br shadow-lg"
                    autoPlay
                    playsInline
                    muted
                ></video>

                <div className="absolute bg-transparent font-extrabold w-48 h-8 bottom-14 right-6">
                    {
                        hasSentStream ? ("") : (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    sendVideo(socket)
                                }}
                                className={`w-full tracking-widest ${hasRemoteStream ? "text-black" : "text-white"}`}
                            >
                                {hasRemoteStream ? "Recieve" : "Call"}
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default TwoWay;