import { useState, type ChangeEvent } from "react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setRoomId, setConnected } from "../features/RoomDetails";
import toast from "react-hot-toast";
import {
  checkIfPrivateRoom,
  privateRoomCreater,
} from "../services/RoomServices";
import PrivateRoomPopup from "./PrivateRoomPopup";
import { getStompClient } from "../services/websocketClient";
import type { RootState } from "../app/store";

function JoinRoom() {
  const { jwtToken, userName } = useSelector(
    (state: RootState) => state.userDetails
  );
  const dispatch = useDispatch();
  const [roomId, setRoomIdLocal] = useState("");
  const [showPrivatePopup, setShowPrivatePopup] = useState(false);
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

  async function joinChat() {
    if (formValidate()) {
      try {
        try {
          const response = await checkIfPrivateRoom(roomId, jwtToken, userName);
          if (!response.data) {
            setShowPrivatePopup(true);
            return;
          }
          if (client && client.connected) {
            client.send(`/app/addRoom/${userName}/${roomId}`, {}, "");
            dispatch(setConnected(true));
            navigate("/chat");
          }
        } catch {
          toast.error("Room does not exist");
        }
      } catch {
        toast.error("Internal Server Error");
      }
    }
  }

  async function sendInvitationLocal() {
    try {
      const response = await privateRoomCreater(roomId, jwtToken);
      const receiver = response.data;
      try {
        const body = {
          roomId,
          sender: userName,
          receiver,
        };
        if (client && client.connected) {
          client.send("/app/createInvitation", {}, JSON.stringify(body));
          toast.success("Invitation sent successfully!");
        }
      } catch {
        toast.error("Error in sending invitation!");
      }
      setShowPrivatePopup(false);
    } catch {
      setShowPrivatePopup(false);
      toast.error("Error in sending request!");
    }
  }

  function cancelRequest() {
    setShowPrivatePopup(false);
    toast.error("Join request cancelled!");
  }

  return (
    <>
      <Navbar userName={userName} />
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 w-full flex flex-col gap-6 max-w-md rounded dark:bg-gray-800 shadow">
          <div className="">
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
          <div className="flex justify-around">
            <button
              className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded"
              onClick={joinChat}
            >
              Join
            </button>
          </div>
        </div>
      </div>
      {showPrivatePopup && (
        <PrivateRoomPopup
          onSendRequest={sendInvitationLocal}
          onCancel={cancelRequest}
        />
      )}
    </>
  );
}

export default JoinRoom;
