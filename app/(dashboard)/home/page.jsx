"use client";
import {
  checkTokenExistence,
  generateToken,
  getServerDate,
  isTimeBetween10AMAnd3PM,
  isTokenCollected,
} from "@/Functions/functions";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useState } from "react";

const page = () => {
  
  useEffect(()=>{
    getDate()
  },[])
  const getDate = async() =>{
    const currentTime = await getServerDate();
    const checkTime = isTimeBetween10AMAnd3PM(currentTime);
    if(checkTime){
      setIsValidTime(true);
    }
    console.log("Time Check: "+checkTime);
  }
  const [email, setEmail] = useState("");

  const [token, setToken] = useState("");
  const [tokenLoad, setTokenLoad] = useState(true);
  const [isValidTime, setIsValidTime] = useState(false);
  const [time, setTime] = useState("");

  const [tokenDispensed, setTokenDispensed] = useState(false);
  const [tokenDispensedLoad, setTokenDispensedLoad] = useState(false);

  useLayoutEffect(() => {
    const userData = JSON.parse(localStorage.getItem("studentData"));
    if (userData) {
      setEmail(userData.email);
    }
  }, []);

  useEffect(() => {
    if (email) {
      checkToken(email);
    }
  }, [email]);

  const checkToken = async (email) => {
    const status = await checkTokenExistence(email);
    if (status.tokenExist) {
      setTokenDispensedLoad(true);
      tokenCollectionStatus(status.token);
      setToken(status.token);
      setTime(status.time);
    } else if (status.err) {
      alert("Unknown error occured.. Refresh your page !!");
    }
    setTokenLoad(false);
  };

  const tokenCollectionStatus = async (tokenNumber) => {
    const status = await isTokenCollected(tokenNumber);
    if (status.tokenCollected) {
      setTokenDispensed(true);
    }
    setTokenDispensedLoad(false);
  };

  const TokenGeneration = async () => {
    setTokenLoad(true);
    const status = await generateToken(email);
    if (status.success) {
      setToken(status.token);
      setTime(status.time);
    } else if (status.err) {
      alert("Unknown error occured.. Refresh your page !!");
    }
    setTokenLoad(false);
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center p-4">
      <div className="w-44 flex flex-col bg-primary rounded-3xl px-2 justify-evenly shadow-md shadow-gray-500">
        <div className="h-14 flex justify-center items-center">
          <h2 className="text-secondary text-2xl">TOKEN NO :</h2>
        </div>
        <div className="w-full h-40 flex justify-center items-center text-4xl font-bold text-black bg-secondary shadow-inner shadow-gray-950">
          {!tokenLoad ? (
            isValidTime ? (
              token ? (
                <h1>{token}</h1>
              ) : (
                <button
                  onClick={TokenGeneration}
                  className="text-5xl text-red-200"
                >
                  TAP HERE
                </button>
              )
            ) : (
              <div className="w-full h-full flex justify-center items-center p-2 pl-4">
                <h1>CLOSED</h1>
              </div>
            )
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-loader animate-spin"
              width={40}
              height={40}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 6l0 -3" />
              <path d="M16.25 7.75l2.15 -2.15" />
              <path d="M18 12l3 0" />
              <path d="M16.25 16.25l2.15 2.15" />
              <path d="M12 18l0 3" />
              <path d="M7.75 16.25l-2.15 2.15" />
              <path d="M6 12l-3 0" />
              <path d="M7.75 7.75l-2.15 -2.15" />
            </svg>
          )}
        </div>
        <div className="h-14 flex justify-center items-center text-white text-xl">
          <h2>{isValidTime ? time : null}</h2>
        </div>
      </div>
      <div className={`mt-8 p-2 rounded-md ${((token || !isValidTime) && !tokenLoad) && "bg-slate-50"}`}>
        {isValidTime ? (
        token ? (
          tokenDispensedLoad ? (
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-loader-2 animate-spin"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 3a9 9 0 1 0 9 9" />
              </svg>
            </span>
          ) : tokenDispensed ? (
            <div className="flex flex-col items-center text-green-600">
              <span>This token have been dispensed &#x2714;</span>
              <span>Come back tomorrow ...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-red-600">
              <span>Token not yet dispensed ❌</span>
              <span>Token will expire at 3:00 PM !!!</span>
            </div>
          )
        ) : null
        ) : 
        !tokenLoad && ((<h1 className="">Active Time : 10 AM - 3 PM</h1>))}
      </div>
    </div>
  );
};

export default page;
