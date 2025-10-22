import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../services/AuthServices";
import { useDispatch } from "react-redux";
import {
  setUserName,
  setJwtToken,
  setLoggedInStatus,
} from "../features/UserDetails";

function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast.error("Enter a valid Username / Password");
      return;
    }
    try {
      const response = await loginUser({
        userName: loginData.username,
        password: loginData.password,
      });
      dispatch(setJwtToken(response.data));
      dispatch(setUserName(loginData.username));
      dispatch(setLoggedInStatus(true));
      navigate("/");
    } catch {
      toast.error("Invalid Username / Password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={(e) => handleLogin(e)}
        className="p-8 w-full flex flex-col gap-6 max-w-md rounded dark:bg-gray-800 shadow"
      >
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        <div>
          <label htmlFor="username" className="block font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleInputChange}
            value={loginData.username}
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleInputChange}
            value={loginData.password}
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded font-semibold"
        >
          Login
        </button>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link to={"/register"} className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
