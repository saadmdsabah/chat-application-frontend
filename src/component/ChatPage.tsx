import { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import SockJS from "sockjs-client";
import { Stomp, type StompSubscription } from "@stomp/stompjs";
import { LoadRoomMessages } from "../services/RoomServices";
import TimeAgo from "../config/TimeAgo";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, addMessage } from "../features/RoomDetails";
import Navbar from "./Navbar";
import type { RootState } from "../app/store";
import type { KeyboardEvent } from "react";

function ChatPage() {
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState<ReturnType<
    typeof Stomp.over
  > | null>(null);

  const { roomId, connected, messages } = useSelector(
    (state: RootState) => state.roomDetails
  );
  const { userName, jwtToken } = useSelector(
    (state: RootState) => state.userDetails
  );

  const dispatch = useDispatch();

  const inputRef = useRef(null);
  const chatBoxRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    async function loadMessages() {
      const response = await LoadRoomMessages(
        roomId,
        50,
        0,
        jwtToken,
        userName
      );
      dispatch(setMessages(response.data));
    }
    if (messages.length === 0 && connected) loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, jwtToken, connected]);

  useEffect(() => {
    if (!roomId) return;

    const sock = new SockJS(`http://localhost:8080/api/v1/chat`);
    const client: ReturnType<typeof Stomp.over> = Stomp.over(sock);

    let subscription: StompSubscription | null = null;

    client.connect({}, () => {
      setStompClient(client);

      subscription = client.subscribe(`/topic/rooms/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        dispatch(addMessage(newMessage));
      });
    });

    return () => {
      dispatch(setMessages([]));
      if (subscription) {
        subscription.unsubscribe();
      }
      if (client && client.connected) {
        client.disconnect(() => {
          console.log("Disconnected from room:", roomId);
        });
      }
    };
  }, [roomId, dispatch]);

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: userName,
        content: input,
        roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      <Navbar userName={userName} />

      {/* Main Container */}
      <main
        ref={chatBoxRef}
        className="pt-18 w-3/4 mx-auto dark:bg-slate-800 h-screen py-20 overflow-auto"
      >
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`flex ${
                message.sender === userName ? "justify-end" : "justify-start"
              } px-10`}
            >
              <div
                className={`my-2 max-w-xs ${
                  message.sender === userName ? "bg-blue-500" : "bg-gray-500"
                } py-2 px-3 rounded`}
              >
                <div className="flex items-center justify-around flex-row gap-2">
                  <img
                    className="h-10 w-10"
                    src={"https://avatar.iran.liara.run/public/19"}
                    alt=""
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold">{message.sender}</p>
                    <p>{message.content}</p>
                    <p className="text-xs text-right text-gray-600">
                      {TimeAgo(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      <div className="fixed bottom-3 w-full h-13">
        <div className="flex items-center justify-between rounded h-full w-2/3 mx-auto px-5">
          <input
            type="text"
            ref={inputRef}
            name="input"
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            className="dark:border-gray-700 dark:bg-gray-900 px-5 py-2 rounded-full h-full w-full mr-5 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="dark:bg-blue-500 px-5 py-2 rounded h-10 w-13 hover:bg-blue-800"
          >
            <MdSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
