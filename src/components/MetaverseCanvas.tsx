import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import officeBackground from '../assets/floor.jpg';
import actor from '../assets/actor.png';
import TwoWay from './TwoWay';

const OFFICE_WIDTH = window.innerWidth - 230;
const OFFICE_HEIGHT = window.innerHeight - 230;
const CHARACTER_SIZE = 3;
const MOVE_STEP = 5;
const distance = 45;

type Member = {
  clientId: string;
  status: boolean;
  x_axis: number;
  y_axis: number;

};

type Office = Member[];

const MetaverseCanvas: React.FC = () => {

  const stageRef = useRef<never>(null);
  const backgroundRef = useRef<HTMLImageElement | null>(null);
  const characterRef = useRef<HTMLImageElement | null>(null);
  
  const [senderId, setSenderId] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [webRtcClient, setWebRtcClient] = useState<string | undefined>("");
  const [host, setHost] = useState<Member>({
    clientId: '1',
    status: true,
    x_axis: OFFICE_WIDTH / 2,
    y_axis: OFFICE_WIDTH / 2 - 250
  })

  const [room, setRoom] = useState<Office>([])

  const connect = async () => {
    console.log(senderId);

    const sendMessage = () => {
      if (socketInstance.readyState === WebSocket.OPEN) {
        console.log("Sending data:", host);
        socketInstance.send(JSON.stringify(host));
      } else {
        console.log("WebSocket is not ready yet.");
      }
    };


    const socketInstance = new WebSocket(
      `ws://localhost:8080/ws?clientId=${senderId}`
    );

    setSocket(socketInstance);
    console.log(socketInstance);

    socketInstance.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketInstance.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setRoom((prev) => {
        const updatedRoom = prev?.filter((member) => member.clientId !== message.clientId) || [];
        return [...updatedRoom, message];
      });
      console.log("Received message:", message);
    };

    socketInstance.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socketInstance.onopen = () => {
      console.log("WebSocket connection established");
      sendMessage();
    };
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!senderId) return;


    setHost((prev) => {
      let { x_axis, y_axis } = prev;
      if (e.key === 'ArrowUp') y_axis = Math.max(y_axis - MOVE_STEP, CHARACTER_SIZE);
      if (e.key === 'ArrowDown') y_axis = Math.min(y_axis + MOVE_STEP, OFFICE_HEIGHT - CHARACTER_SIZE);
      if (e.key === 'ArrowLeft') x_axis = Math.max(x_axis - MOVE_STEP, CHARACTER_SIZE);
      if (e.key === 'ArrowRight') x_axis = Math.min(x_axis + MOVE_STEP, OFFICE_WIDTH - CHARACTER_SIZE);
      const sendData = {
        ...prev,
        x_axis,
        y_axis
      }
      if (socket) {
        socket.send(JSON.stringify(sendData))
      }
      return { ...prev, x_axis, y_axis };
    })
  };

  const calculateClosetMate = () => {
    const updatedCloseTo: Map<number, string> = new Map;
    room.forEach((member) => {
      const calculatedDistance = Math.round(Math.sqrt(Math.pow(member.x_axis - host.x_axis, 2) + Math.pow(member.y_axis - host.y_axis, 2)));
      if (calculatedDistance <= distance && member.status) {
        updatedCloseTo.set(calculatedDistance, member.clientId);
      }
    })
    const minDistance = Math.min(...updatedCloseTo.keys());
    const closestClient = updatedCloseTo.get(minDistance);
    setWebRtcClient(closestClient)
  }

  useEffect(() => {
    setHost((prev) => ({ ...prev, clientId: senderId, }));
  }, [senderId])

  // Preload the image
  useEffect(() => {
    const bgImage = new window.Image();
    bgImage.src = officeBackground;
    bgImage.onload = () => {
      backgroundRef.current  = bgImage;
      setImageLoaded(true);
    };

    const actorImage = new window.Image();
    actorImage.src = actor;
    actorImage.onload = () => {
      characterRef.current = actorImage;
      setImageLoaded(true);
    };

  }, []);

  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener('keydown', keyDownListener);

    return () => window.removeEventListener('keydown', keyDownListener);
  }, [senderId, socket, room]);


  useEffect(() => {
    calculateClosetMate();
  }, [room, host])

  return (
    <div className="h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
      <div className="relative flex flex-col w-full justify-center items-centermax-h-screen min-h-screen ">
        <div className="flex gap-10">
          <div>
            <input
              type="text"
              name="sender_name"
              placeholder="sender name"
              className="w-36 border-blue-600 border-2 p-2 rounded-2xl"
              onChange={(e) => {
                e.preventDefault();
                setSenderId(e.target.value);
              }}
            />
          </div>
          <button
            onClick={() => connect()}
            className="w-36 h-11 bg-orange-600 border-orange-500 rounded-2xl p-2"
          >
            Connect
          </button>
          <div className='flex absolute top-0 z-20'>
            {webRtcClient ? <TwoWay sender={senderId} receiver={webRtcClient} connection={webRtcClient ? true : false} /> : ""}
          </div>
        </div>
        <div className='flex h-screen w-full flex-col justify-end items-center mb-8 z-10'>
          <Stage width={OFFICE_WIDTH + 130} height={OFFICE_HEIGHT + 130} ref={stageRef} className="border-2 border-gray-300 bg-white">
            <Layer>
              {/* Background Image */}
              {imageLoaded && (
                <KonvaImage
                  x={0}
                  y={0}
                  width={OFFICE_WIDTH + 130}
                  height={OFFICE_HEIGHT + 130}
                  image={backgroundRef.current || undefined}
                />
              )}

              <KonvaImage
                key={host.clientId}
                x={host.x_axis}
                y={host.y_axis}
                radius={CHARACTER_SIZE}
                shadowBlur={10}
                width={window.innerWidth / 14}
                height={window.innerWidth / 14}
                image={characterRef.current || undefined}
                shadowColor={host.status ? '#00FF00' : '#FF0000'}
              />

              {
                room.map((char) => (
                  <KonvaImage
                    key={char.clientId}
                    x={char.x_axis}
                    y={char.y_axis}
                    radius={CHARACTER_SIZE}
                    shadowBlur={10}
                    width={window.innerWidth / 14}
                    height={window.innerWidth / 14}
                    image={characterRef.current || undefined}
                    shadowColor={char.status ? '#00FF00' : '#FF0000'}

                  />
                ))
              }
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default MetaverseCanvas;