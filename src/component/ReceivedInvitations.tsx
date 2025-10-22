import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import { getAllReceivedInvitations } from "../services/InvitationService";
import toast from "react-hot-toast";
import { getStompClient } from "../services/websocketClient";
import type { RootState } from "../app/store";
import type { Invitation } from "../services/InvitationService";

function ReceivedInvitations() {
  const { userName, jwtToken } = useSelector(
    (state: RootState) => state.userDetails
  );

  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const client = getStompClient();

  useEffect(() => {
    async function getAllInvitations() {
      try {
        const response = await getAllReceivedInvitations(jwtToken, userName);
        setInvitations(response.data);
      } catch {
        toast.error("Failed to load invitations");
      }
    }
    getAllInvitations();
  }, [jwtToken, userName]);

  useEffect(() => {
    if (client && client.connected) {
      client.subscribe(`/topic/receivedInvitations/${userName}`, (message) => {
        const newInvitation = JSON.parse(message.body);
        setInvitations((prevInvitations) => [
          ...prevInvitations,
          newInvitation,
        ]);
      });
    }
  }, [userName, client]);

  const handleResponse = (roomId: string, status: string, sender: string) => {
    try {
      const body = {
        status,
        roomId,
        sender,
        receiver: userName,
      };
      if (client && client.connected) {
        client.send("/app/updateStatusOfInvitation", {}, JSON.stringify(body));
        console.log("Successfully updates status");

        setInvitations((prev) =>
          prev.filter((invite) => invite.roomId !== roomId)
        );
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <Navbar userName={userName} />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Received Invitations
        </h1>

        {invitations.length === 0 ? (
          <p className="text-center text-gray-500">
            No pending invitations right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((invite) => (
              <div
                key={invite.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Room: <span className="text-blue-500">{invite.roomId}</span>
                  </h2>
                  <p className="mb-1">
                    From:{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {invite.sender}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Received on:{" "}
                    {new Date(invite.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() =>
                      handleResponse(invite.roomId, "accepted", invite.sender)
                    }
                    className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-md transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleResponse(invite.roomId, "rejected", invite.sender)
                    }
                    className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ReceivedInvitations;
