import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-black text-white h-screen w-screen flex flex-col justify-center items-center text-center">
      {/* Logo */}
      <h1 className="text-5xl font-bold text-green-500 mb-8">MelodAI</h1>

      {/* Tagline */}
      <p className="text-lg mb-6 text-gray-300">Discover your next favorite song with AI-powered recommendations.</p>

      {/* Auth Buttons */}
      <div className="flex justify-center space-x-6">
        <Link to="/register">
          <button className="bg-green-500 text-black px-6 py-3 text-lg font-semibold rounded-full hover:bg-green-600 transition">
            Register
          </button>
        </Link>

        <Link to="/login">
          <button className="bg-gray-800 text-white px-6 py-3 text-lg font-semibold rounded-full hover:bg-gray-700 transition">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
