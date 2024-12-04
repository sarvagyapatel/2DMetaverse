import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';
import officeBackground2 from '../assets/office.png';
import actor from '../assets/actor.png';
import TwoWay from './TwoWay';
import { getCurrentUser, updateUser } from '../services/auth.services';
import { RingLoader } from 'react-spinners';

const OFFICE_WIDTH = window.innerWidth - 230;
const OFFICE_HEIGHT = window.innerHeight - 230;
const CHARACTER_SIZE = 3;
const MOVE_STEP = 5;
const distance = 45;

type Member = {
  id?: number,
  username: string,
  email?: string,
  status: string,
  x_axis: number,
  y_axis: number,
  roomId: number
};

type Office = Member[];

const MetaverseCanvas: React.FC = () => {

  const stageRef = useRef<never>(null);
  const backgroundRef = useRef<HTMLImageElement | null>(null);
  const characterRef = useRef<HTMLImageElement | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [webRtcClient, setWebRtcClient] = useState<string | undefined>("");
  const [host, setHost] = useState<Member | null>(null)

  const [room, setRoom] = useState<Office>([])

  const currentUser = async () => {
    const response = await getCurrentUser();
    setHost(response)
    connect(response);
  }

  const updateUserCoordinates = async (coordinates: unknown) => {
    await updateUser(coordinates);
    console.log("YES")
  }

  useEffect(() => {
    currentUser();
  }, [])


  const connect = async (hostTemp: Member) => {
    console.log(hostTemp.username);

    const sendMessage = () => {
      if (socketInstance.readyState === WebSocket.OPEN) {
        console.log("Sending data:", hostTemp);
        socketInstance.send(JSON.stringify(hostTemp));
      } else {
        console.log("WebSocket is not ready yet.");
      }
    };


    const socketInstance = new WebSocket(
      `ws://localhost:8080/ws?username=${hostTemp.username}`
    );

    setSocket(socketInstance);
    console.log(socketInstance);

    socketInstance.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketInstance.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setRoom((prev) => {
        const updatedRoom = prev?.filter((member) => member.username !== message.username) || [];
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
    if (host !== null) {
      if (!host.username) return;

      setHost((prev): Member | null => {
        if (prev !== null) {
          let { x_axis, y_axis } = prev;

          if (e.key === 'ArrowUp') y_axis = Math.max(y_axis - MOVE_STEP, CHARACTER_SIZE);
          if (e.key === 'ArrowDown') y_axis = Math.min(y_axis + MOVE_STEP, OFFICE_HEIGHT - CHARACTER_SIZE);
          if (e.key === 'ArrowLeft') x_axis = Math.max(x_axis - MOVE_STEP, CHARACTER_SIZE);
          if (e.key === 'ArrowRight') x_axis = Math.min(x_axis + MOVE_STEP, OFFICE_WIDTH - CHARACTER_SIZE);

          const sendData = {
            ...prev,
            x_axis,
            y_axis,
          };

          if (socket) {
            socket.send(JSON.stringify(sendData));
          }
          return { ...prev, x_axis, y_axis };
        }
        return null;
      });
    }

  };

  const calculateClosetMate = () => {
    const updatedCloseTo: Map<number, string> = new Map;
    if (host === null) return;
    room.forEach((member) => {
      const calculatedDistance = Math.round(Math.sqrt(Math.pow(member.x_axis - host.x_axis, 2) + Math.pow(member.y_axis - host.y_axis, 2)));
      if (calculatedDistance <= distance && member.status) {
        updatedCloseTo.set(calculatedDistance, member.username);
      }
    })
    const minDistance = Math.min(...updatedCloseTo.keys());
    const closestClient = updatedCloseTo.get(minDistance);
    setWebRtcClient(closestClient)
  }

  // Preload the image
  useEffect(() => {
    const bgImage = new window.Image();
    bgImage.src = officeBackground2;
    bgImage.onload = () => {
      backgroundRef.current = bgImage;
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
  }, [socket, room]);


  useEffect(() => {
    calculateClosetMate();
  }, [room, host])

  useEffect(() => {
    if (host !== null) {
      const handler = setTimeout(() => {
        updateUserCoordinates({ x_axis: host.x_axis, y_axis: host.y_axis });
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [host]);

  return (
    <div className="h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
      <div className="relative flex flex-col w-full justify-center items-centermax-h-screen min-h-screen ">
        <div className="flex gap-10">
          <div className='flex absolute top-0 z-20'>
            {webRtcClient && host ? <TwoWay sender={host.username} receiver={webRtcClient} connection={webRtcClient ? true : false} /> : ""}
          </div>
        </div>
        <div className="flex h-screen w-full flex-col justify-end items-center mb-8 relative">
          <Stage
            width={OFFICE_WIDTH + 130}
            height={OFFICE_HEIGHT + 130}
            ref={stageRef}
            className="border-2 border-gray-300 bg-white"
          >
            <Layer>
              {imageLoaded && (
                <KonvaImage
                  x={0}
                  y={0}
                  width={OFFICE_WIDTH + 130}
                  height={OFFICE_HEIGHT + 130}
                  image={backgroundRef.current || undefined}
                />
              )}

              {host !== null ? (
                <div>
                  <KonvaImage
                    key={host.username}
                    x={host.x_axis}
                    y={host.y_axis}
                    radius={CHARACTER_SIZE}
                    shadowBlur={10}
                    width={window.innerWidth / 14}
                    height={window.innerWidth / 14}
                    image={characterRef.current || undefined}
                    shadowColor={host.status === 'ACTIVE' ? '#00FF00' : '#FF0000'}
                  />
                  <Text
                    text={host.username}
                    x={host.x_axis+67}
                    y={host.y_axis - 10}
                    fontSize={18}
                    fontFamily="Arial"
                    fill="black"
                    fontStyle='bold'
                    offsetX={(host.username.length * 8) / 2} 
                  />
                </div>
              ) : null}

              {room.map((char) => (
                <><KonvaImage
                  key={char.username}
                  x={char.x_axis}
                  y={char.y_axis}
                  radius={CHARACTER_SIZE}
                  shadowBlur={10}
                  width={window.innerWidth / 14}
                  height={window.innerWidth / 14}
                  image={characterRef.current || undefined}
                  shadowColor={char.status === 'ACTIVE' ? '#00FF00' : '#FF0000'} />
                  <Text
                    text={char.username}
                    x={char.x_axis + 67}
                    y={char.y_axis - 10}
                    fontSize={18}
                    fontFamily="Arial"
                    fill="black"
                    fontStyle='bold'
                    offsetX={(char.username.length * 8) / 2} /></>
              ))}
            </Layer>
          </Stage>

          {host === null && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center justify-center">
              <RingLoader
                color="#0f172a"
                size={(window.innerHeight) / 6}
                loading
              />
              <h1 className='text-2xl font-semibold text-slate-950 opacity-65'>Loading lobby...</h1>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MetaverseCanvas;