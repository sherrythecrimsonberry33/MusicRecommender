import React from "react";

const Login = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-6">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="bg-gray-800 p-3 rounded-lg mb-4 w-80 text-white"
      />
      <input
        type="password"
        placeholder="Password"
        className="bg-gray-800 p-3 rounded-lg mb-4 w-80 text-white"
      />
      <button className="bg-green-500 px-6 py-3 rounded-full font-semibold">Sign In</button>
    </div>
  );
};

export default Login;
