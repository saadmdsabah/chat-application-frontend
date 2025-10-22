import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { getAllSentInvitations } from "../services/InvitationService";
import toast from "react-hot-toast";
import { getStompClient } from "../services/websocketClient";
import type { RootState } from "../app/store";
import type { Invitation } from "../services/InvitationService";

function SentInvitations() {
  const { userName, jwtToken } = useSelector(
    (state: RootState) => state.userDetails
  );
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const client = getStompClient();

  useEffect(() => {
    async function getAllInvitations() {
      try {
        const response = await getAllSentInvitations(jwtToken, userName);
        setInvitations(response.data);
      } catch {
        toast.error("Failed to load invitations");
      }
    }
    getAllInvitations();
  }, [jwtToken, userName]);

  useEffect(() => {
    if (client && client.connected) {
      client.subscribe(
        `/topic/remove/sentInvitations/${userName}`,
        (message) => {
          const roomIdToRemove = message.body;
          setInvitations((prevInvitations) =>
            prevInvitations.filter((invite) => invite.roomId !== roomIdToRemove)
          );
        }
      );
    }
  }, [userName, client]);

  return (
    <>
      <Navbar userName={userName} />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Sent Invitations
        </h1>

        {invitations.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven’t sent any invitations yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((invite) => (
              <div
                key={invite.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300"
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Room: <span className="text-blue-500">{invite.roomId}</span>
                  </h2>
                  <p className="mb-1">
                    Sent To:{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {invite.receiver}
                    </span>
                  </p>
                  <p className="mb-3 text-sm text-gray-500">
                    Sent on:{" "}
                    {new Date(invite.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>

                  <p className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300">
                    {invite.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SentInvitations;
