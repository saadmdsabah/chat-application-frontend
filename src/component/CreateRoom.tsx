import { useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import { useNavigate } from "react-router";
import { setRoomId, setConnected } from "../features/RoomDetails";
import toast from "react-hot-toast";
import { getStompClient } from "../services/websocketClient";
import type { RootState } from "../app/store";

function CreateRoom() {
  const { userName } = useSelector((state: RootState) => state.userDetails);
  const dispatch = useDispatch();
  const [roomId, setRoomIdLocal] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const client = getStompClient();

  const navigate = useNavigate();

  function handleFormInputChange(e: ChangeEvent<HTMLInputElement>) {
    setRoomIdLocal(e.target.value);
    dispatch(setRoomId(e.target.value));
  }

  function formValidate() {
    if (!roomId) {
      toast.error("Enter a valid Username / Room ID");
      return false;
    }
    return true;
  }

  async function createRoom() {
    if (formValidate() && client && client.connected) {
      try {
        const body = {
          userName,
          privateRoom: isPrivate,
        };
        client.send(`/app/createRoom/${roomId}`, {}, JSON.stringify(body));
        dispatch(setConnected(true));

        navigate("/chat");
      } catch {
        toast.error("Room Already Exists");
      }
    }
  }

  return (
    <>
      <Navbar userName={userName} />
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 w-full flex flex-col gap-6 max-w-md rounded dark:bg-gray-800 shadow">
          {/* Room ID Input */}
          <div>
            <label htmlFor="name" className="block font-medium mb-2">
              Group ID
            </label>
            <input
              type="text"
              name="roomId"
              onChange={(e) => handleFormInputChange(e)}
              value={roomId}
              id="name"
              className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Public or Private Toggle */}
          <div className="flex items-center justify-between">
            <label className="block font-medium">Make Group Private?</label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-around">
            <button
              className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded"
              onClick={createRoom}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateRoom;
