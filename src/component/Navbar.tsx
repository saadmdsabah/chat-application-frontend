import { useState } from "react";
import chatIcon from "../assets/chat.png"; // your logo path
import { Link } from "react-router";

export default function Navbar({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="flex fixed top-0 w-full items-center justify-between bg-gray-900 text-white px-6 py-3 shadow-md">
      {/* LEFT — Logo + App name */}
      <div className="flex items-center gap-2">
        <Link to={"/"} className="flex gap-2">
          <img src={chatIcon} alt="Chat Logo" className="h-8 w-8" />
          <span className="text-xl font-semibold">ChatterBox</span>
        </Link>
      </div>

      {/* MIDDLE — Navigation links */}
      <div className="flex gap-25">
        <Link
          to={"/join"}
          className="hover:text-blue-400 transition-colors duration-200"
        >
          Join Group
        </Link>
        <Link
          to={"/create"}
          className="hover:text-blue-400 transition-colors duration-200"
        >
          Create Group
        </Link>
        <Link
          to={"/sentInvitations"}
          className="hover:text-blue-400 transition-colors duration-200"
        >
          Sent Requests
        </Link>
        <Link
          to={"/receivedInvitations"}
          className="hover:text-blue-400 transition-colors duration-200"
        >
          Pending Requests
        </Link>
      </div>

      {/* RIGHT — Profile dropdown */}
      <div className="relative flex items-center gap-4">
        {/* Profile photo + dropdown */}
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="focus:outline-none">
            <img
              src={"https://avatar.iran.liara.run/public/19"}
              alt="Profile"
              className="h-9 w-9 rounded-full border-2 border-white cursor-pointer"
              title={userName}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:text-red-800 text-red-600 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
