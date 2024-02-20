"use client";
import { checkTokenExistence, generateToken} from "@/Functions/functions";
import { useRouter } from "next/navigation";
import React, {  useEffect, useLayoutEffect, useState } from "react";
import Loading from "../loading";

const page = () => {

  const Router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState("");
  const [tokenLoad, setTokenLoad] = useState(true);
  const [time, setTime] = useState('');


  useLayoutEffect(()=>{
    const userData = JSON.parse(localStorage.getItem("studentData"));
    if(!userData){
      Router.push("/login");
    }else{
      setEmail(userData.email);
    }
  },[])
useEffect(()=>{
  if(email){
    checkToken(email)
  }
},[email])
  const checkToken = async(email) =>{
    console.log(email);
    const status = await checkTokenExistence(email);
    console.log("checkToken: ",status);
    if(status.tokenExist){
      setToken(status.token);
      setTime(status.time);
    }else if(status.err){
      alert("Unknown error occured.. Refresh your page !!")
    }
    setTokenLoad(false);
  }

  const TokenGeneration = async() =>{
    setTokenLoad(true);
    const status = await generateToken(email);
    if(status.success){
      setToken(status.token);
      setTime(status.time);
    }else if(status.err){
      alert("Unknown error occured.. Refresh your page !!")
    }
    setTokenLoad(false);
  }

  return (
    <div className="flex flex-col flex-1 justify-center items-center ">
      <div className="w-44 flex flex-col bg-primary rounded-3xl px-2 justify-evenly">
        <div className="h-14 flex justify-center items-center">
          <h2 className="text-secondary text-2xl">TOKEN NO :</h2>
        </div>
        <div className="w-full h-40 flex justify-center items-center text-4xl font-bold text-black bg-secondary">
          {!tokenLoad ? (
            token ? <h1>{token}</h1> :
            <button onClick={TokenGeneration} className="text-5xl text-red-200">
              TAP HERE
            </button>
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
          <h2>{time}</h2>
        </div>
      </div>
    </div>
  );
}


export default page;
