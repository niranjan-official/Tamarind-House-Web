"use client";
import { auth } from "@/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const page = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(false);

  const handleClick = async () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setStatus(true);
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };
  return (
    <div className="w-full min-h-screen bg-secondary flex flex-col justify-center items-center">
      <Link href={"/login"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={4}
        stroke="currentColor"
        className="w-6 h-6 absolute top-5 left-5 text-red-950"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
        />
      </svg>
      </Link>

      <div className="flex flex-col p-4">
        <div className="w-full h-1/3">
          <Image
            src={"/images/password-reset.svg"}
            style={{ height: "100%", width: "auto" }}
            width={300}
            height={300}
          />
        </div>
        {!status ? (
          <div className="flex flex-col">
            <h1 className="font-bold text-3xl">Forgot Password ?</h1>
            <input
              required
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter Your Email"
              className="p-2 border bg-transparent border-gray-400 focus:outline-none focus:ring-0 mt-4"
            />
            <span className="text-zinc-500 text-sm mt-1">
              * Enter your registered college mail id
            </span>
            <button
              disabled={email === ""}
              onClick={handleClick}
              className="button mt-6 rounded-md"
            >
              RESET PASSWORD{" "}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-3xl mb-4">Email Sent !!</h1>
            <span className="text-center">
              Link for resetting your password has been sent to your email :{" "}
            </span>
            <span className="text-primary break-all mb-4">{email}</span>
            <Link href={"/login"}>
              <button className="w-full button">Back to Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
