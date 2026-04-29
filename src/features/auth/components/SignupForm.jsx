import React from "react";

const SignupForm = ({ onSubmit }) => {
  return (
    <div className="w-full max-w-sm">
    <h1 className="text-2xl font-bold mb-6 text-orange-700 text-center">Sign Up</h1>
    <form onSubmit={onSubmit} className="flex flex-col space-y-4 max-w-md mx-auto">
      <input
        name="name"
        placeholder="Name"
        required
        className="border rounded px-4 py-2"
      />
      <input
        name="email"
        placeholder="Email"
        type="email"
        required
        className="border rounded px-4 py-2"
      />
      <input
        name="phone"
        placeholder="Phone"
        type="tel"
        required
        className="border rounded px-4 py-2"
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        required
        className="border rounded px-4 py-2"
      />
      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-700  text-white rounded py-2"
      >
        Sign Up
      </button>
    </form>
    </div>
  );
};

export default SignupForm;
