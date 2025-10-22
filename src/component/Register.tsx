import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router";
import { registerUser } from "../services/AuthServices";
import toast from "react-hot-toast";

function Register() {
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!registerData.username || !registerData.password) {
      toast.error("Enter a valid Username / Password");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await registerUser({
        userName: registerData.username,
        userPassword: registerData.password,
        aboutUser: "",
      });
      toast.success("Registered Successfully");
    } catch {
      toast.error("Internal Server Error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={(e) => handleRegister(e)}
        className="p-8 w-full flex flex-col gap-6 max-w-md rounded dark:bg-gray-800 shadow"
      >
        <h1 className="text-2xl font-semibold text-center">Register</h1>

        <div>
          <label htmlFor="username" className="block font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleInputChange}
            value={registerData.username}
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
            value={registerData.password}
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleInputChange}
            value={registerData.confirmPassword}
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 dark:bg-green-500 hover:dark:bg-green-800 rounded font-semibold"
        >
          Register
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
