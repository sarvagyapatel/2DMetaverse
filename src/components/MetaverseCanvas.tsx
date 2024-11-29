/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import officeBackground from '../assets/floor.jpg';
import actor from '../assets/actor.png';
import TwoWay from './TwoWay';

const OFFICE_WIDTH = 1300;
const OFFICE_HEIGHT = 700;
const CHARACTER_SIZE = 3;
const MOVE_STEP = 5;
const distance = 45;

type Member = {
  clientId: string;
  status: boolean;
  x_axis: number;
  y_axis: number;
  closeTo: string | undefined;
};

type Office = {
  owner: string;
  members: Member[];
};

const MetaverseCanvas: React.FC = () => {

  const stageRef = useRef<never>(null);
  const backgroundRef = useRef<any>(null);
  const characterRef = useRef<any>(null);
  const characterRef1 = useRef<any>(null);
  const [senderId, setSenderId] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  // const rtcRef = useRef<any>(null);
  const [webRtcClient, setWebRtcClient] = useState<string | undefined>("");


  const [room, setRoom] = useState<Office>({
    owner: '1',
    members: [
      {
        clientId: '1',
        status: false,
        x_axis: OFFICE_WIDTH / 2,
        y_axis: OFFICE_WIDTH / 2 - 250,
        closeTo: ''
      },
      {
        clientId: '2',
        status: false,
        x_axis: OFFICE_WIDTH / 2 + 110,
        y_axis: OFFICE_WIDTH / 2 - 260,
        closeTo: ''
      },
      {
        clientId: '3',
        status: false,
        x_axis: OFFICE_WIDTH / 2 + 10,
        y_axis: OFFICE_WIDTH / 2 - 340,
        closeTo: ''
      },
      {
        clientId: '4',
        status: false,
        x_axis: OFFICE_WIDTH / 2 + 60,
        y_axis: OFFICE_WIDTH / 2 - 280,
        closeTo: ''
      },
    ],
  })


  const connect = async () => {
    console.log(senderId);

    const socketInstance = new WebSocket(
      `ws://localhost:8080/ws?clientId=${senderId}`
    );

    if (socketInstance) {
      setRoom((prev) => {
        const updateStatus = prev.members.map((member) => {
          if (member.clientId === senderId) member.status = true;
          return member;
        })
        return { owner: senderId, members: updateStatus };
      })
    }


    setSocket(socketInstance);
    console.log(socketInstance);


    socketInstance.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketInstance.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setRoom(message);
      console.log("Received message:", message);
    };

    socketInstance.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socketInstance.onopen = () => {
      console.log("WebSocket connection established");
    };
  };

  // Preload the image
  useEffect(() => {
    const bgImage = new window.Image();
    bgImage.src = officeBackground;
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

    const actorImage1 = new window.Image();
    actorImage1.src = actor;
    actorImage1.onload = () => {
      characterRef1.current = actorImage1;
      setImageLoaded(true);
    };
  }, []);

  const [imageLoaded, setImageLoaded] = useState(false);

  // useEffect(() => {
  //   rtcRef.current.textContent = webRtcClient;
  // }, [webRtcClient])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!senderId) return;

    setRoom((prev) => {
      const updatedMembers = prev.members.map((member) => {
        if (member.clientId === senderId) {
          let { x_axis, y_axis } = member;
          if (e.key === 'ArrowUp') y_axis = Math.max(y_axis - MOVE_STEP, CHARACTER_SIZE);
          if (e.key === 'ArrowDown') y_axis = Math.min(y_axis + MOVE_STEP, OFFICE_HEIGHT - CHARACTER_SIZE);
          if (e.key === 'ArrowLeft') x_axis = Math.max(x_axis - MOVE_STEP, CHARACTER_SIZE);
          if (e.key === 'ArrowRight') x_axis = Math.min(x_axis + MOVE_STEP, OFFICE_WIDTH - CHARACTER_SIZE);
          member.x_axis = x_axis;
          member.y_axis = y_axis;
          return member;
        }
        return member;
      });

      // calculating and updating closeTo

      const updatedAllCloseTo = updatedMembers.map((member1) => {

        const updatedCloseTo: Map<number, string> = new Map;
        updatedMembers.forEach((member2) => {
          if (member1.clientId !== member2.clientId) {
            const calculatedDistance = Math.round(Math.sqrt(Math.pow(member2.x_axis - member1.x_axis, 2) + Math.pow(member2.y_axis - member1.y_axis, 2)));
            if (calculatedDistance <= distance && member2.status) {
              updatedCloseTo.set(calculatedDistance, member2.clientId);
            }
          }
        })
        const minDistance = Math.min(...updatedCloseTo.keys());
        const closestClient = updatedCloseTo.get(minDistance);
        member1.closeTo = closestClient;
        if (member1.clientId === prev.owner) {
          setWebRtcClient(closestClient)
        }

        return member1;

      })

      if (socket) {
        socket.send(JSON.stringify({ owner: senderId, members: updatedAllCloseTo }));
      }
      return { owner: senderId, members: updatedAllCloseTo };
    });
  };

  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener('keydown', keyDownListener);

    return () => window.removeEventListener('keydown', keyDownListener);
  }, [senderId, socket]);


  useEffect(() => {
    room.members.map((member1) => {
      if (member1.clientId === room.owner) {
        setWebRtcClient(member1.closeTo)
      }
    })
  }, [room])


  return (
    <div className="flex flex-col w-full justify-center items-center bg-gray-700 max-h-screen min-h-screen">
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
        {/* <div className='flex h-11 bg-yellow-600 rounded-xl text-xl p-2 font-semibold text-white'>
          <h1 ref={rtcRef}></h1>
        </div> */}
        <div className='flex'>
          {webRtcClient?<TwoWay sender={senderId} receiver={webRtcClient} connection={webRtcClient?true:false}/>:""}
        </div>
      </div> 
      <div className='flex h-screen w-full flex-col justify-end items-center mb-8'>
        <Stage width={OFFICE_WIDTH} height={OFFICE_HEIGHT} ref={stageRef} className="border-2 border-gray-300 bg-white">
          <Layer>
            {/* Background Image */}
            {imageLoaded && (
              <KonvaImage
                x={0}
                y={0}
                width={OFFICE_WIDTH}
                height={OFFICE_HEIGHT}
                image={backgroundRef.current}
              />
            )}

            {
              room.members.map((char) => (
                <KonvaImage
                  key={char.clientId}
                  x={char.x_axis}
                  y={char.y_axis}
                  radius={CHARACTER_SIZE}
                  shadowBlur={10}
                  width={100}
                  height={100}
                  image={characterRef1.current}
                  shadowColor={char.status ? '#00FF00' : '#FF0000'}

                />
              ))
            }

          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default MetaverseCanvas;
