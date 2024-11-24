/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import officeBackground from '../assets/floor.jpg';
import actor from '../assets/actor.png';

const OFFICE_WIDTH = 900;
const OFFICE_HEIGHT = 900;
const CHARACTER_SIZE = 5;
const MOVE_STEP = 5;
const distance = 75;

type Member = {
  clientId: string;
  status: boolean;
  x_axis: number;
  y_axis: number;
  closeTo: string[]; 
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


  const [room, setRoom] = useState<Office>({
    owner: '1',
    members: [
      {
        clientId: '1',
        status: true,
        x_axis: OFFICE_WIDTH / 2,
        y_axis: OFFICE_WIDTH / 2,
        closeTo: []
      },
      {
        clientId: '2',
        status: false,
        x_axis: OFFICE_WIDTH / 2 + 39,
        y_axis: OFFICE_WIDTH / 2 + 39,
        closeTo: []
      },
      {
        clientId: '3',
        status: true,
        x_axis: OFFICE_WIDTH / 2 + 45,                                                                                                                                                                 
        y_axis: OFFICE_WIDTH / 2 + 45,
        closeTo: []
      },
      {
        clientId: '4',
        status: true,
        x_axis: OFFICE_WIDTH / 2 + 50,
        y_axis: OFFICE_WIDTH / 2 + 50,
        closeTo: []
      },
    ],
  })


  const connect = async () => {
    console.log(senderId);

    const socketInstance = new WebSocket(
      `ws://localhost:8081/ws?clientId=${senderId}`
    );


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

  const latestRoomRef = useRef(room); 
  useEffect(() => {
    latestRoomRef.current = room; 
  }, [room]);
  
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
          member.x_axis=x_axis;
          member.y_axis=y_axis;
          return member;
        }
        return member;
      });

      // calculating and updating closeTo

      const updatedAllCloseTo = updatedMembers.map((member1) =>{
          
        const updatedCloseTo: string[] = [];
        updatedMembers.forEach((member2) =>{
           if(member1.clientId!==member2.clientId){
            const calculatedDistance = Math.round(Math.sqrt(Math.pow(member2.x_axis - member1.x_axis, 2) + Math.pow(member2.y_axis - member1.y_axis, 2)));
            if(calculatedDistance<=distance){
              updatedCloseTo.push(member2.clientId);
            }
           }
        })
        member1.closeTo = updatedCloseTo;

        return member1;

      })

      if (socket) {
        socket.send(JSON.stringify({owner:senderId, members:updatedAllCloseTo})); 
      }
      return { owner:senderId, members: updatedMembers };
    });
  };
  
  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener('keydown', keyDownListener);
  
    return () => window.removeEventListener('keydown', keyDownListener); 
  }, [senderId, socket, room]); 

  return (
    <div className="flex justify-center items-center bg-gray-700 h-screen">
      <div className="flex flex-col gap-10">
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
          className="w-36 bg-orange-600 border-orange-500 rounded-2xl p-2"
        >
          Connect
        </button>
      </div>
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
                width={130}
                height={130}
                image={characterRef1.current}
                shadowColor={char.status?'#00FF00':'#FF0000'}

              />
            ))
          }

        </Layer>
      </Stage>
    </div>
  );
};

export default MetaverseCanvas;
