import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { getUserRooms } from "../services/HomeService";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { setRoomId, setConnected } from "../features/RoomDetails";
import { setRooms, addRoom } from "../features/JoinedRooms";
import { getStompClient } from "../services/websocketClient";
import type { RootState } from "../app/store";

function HomePage() {
  const { userName, jwtToken } = useSelector(
    (state: RootState) => state.userDetails
  );
  const rooms = useSelector((state: RootState) => state.joinedRooms.rooms);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const client = getStompClient();

  useEffect(() => {
    async function getRooms() {
      try {
        const response = await getUserRooms(jwtToken, userName);
        dispatch(setRooms(response.data || []));
      } catch {
        toast.error("Failed to load rooms");
      }
    }
    if (rooms.length === 0) getRooms();
  }, [userName, jwtToken, dispatch, rooms.length]);

  const handleJoinRoom = (roomId: string) => {
    dispatch(setConnected(true));
    dispatch(setRoomId(roomId));
    navigate(`/chat`);
  };

  useEffect(() => {
    if (client && client.connected) {
      client.subscribe(`/topic/rooms/${userName}`, (message) => {
        const newMessage = message.body;
        dispatch(addRoom(newMessage));
      });
    }
  }, [client, dispatch, userName]);

  return (
    <>
      <Navbar userName={userName} />

      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto text-center">
          {rooms.length === 0 ? (
            <p className="text-gray-400">
              No Groups found. Join or create one!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((roomId, index) => (
                <div
                  key={index}
                  onClick={() => handleJoinRoom(roomId)}
                  className="bg-linear-to-br dark:bg-gray-800 p-6 rounded-2xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
                >
                  <img
                    src={`https://api.dicebear.com/8.x/identicon/svg?seed=${roomId}`}
                    alt="Room Avatar"
                    className="w-12 h-12 mb-4 mx-auto rounded-full bg-white"
                  />
                  <h2 className="text-white text-lg font-semibold mb-3">
                    Group ID
                  </h2>
                  <p className="text-white font-mono text-md break-all mb-5">
                    {roomId}
                  </p>
                  <button className="bg-white text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors">
                    Join Room
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
