"use client";
import { convertTime, formatDate, getData } from "@/Functions/functions";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";

const Profile = () => {

  const Router = useRouter();
  const [email, setEmail] = useState("");
  const [data, setData] = useState({
    name: "",
    id: "",
    dateOfReg: "",
  });
  const [load, setLoad] = useState(true);

  useLayoutEffect(() => {
    const userData = JSON.parse(localStorage.getItem("studentData"));
    if (userData) {
      setEmail(userData.email);
    }
  }, []);

  useEffect(() => {
    if (email) {
      fetchData();
    }
  }, [email]);

  const fetchData = async () => {
    const data = await getData(email);
    if (data) {
      const date = convertTime(data.dateOfReg);
      const newDate = new Date(date);
      console.log("Date: ", data.dateOfReg);
      console.log(newDate);
      setData({
        name: data.name,
        id: data.id,
        dateOfReg: formatDate(newDate),
      });
      setLoad(false);
    } else {
      alert("Unknown error occured !!");
    }
  };

  const handleSignout = () =>{
    if(confirm("Do you want to logout?")){
      signOut(auth).then(() => {
        Router.push("/login");
      }).catch((error) => {
        alert("Logout failed !! Try again");
      });
    }
  }
  if (!load) {
    return (
      <div className="w-full flex flex-col flex-1">
        <div className="w-full h-1/3 flex justify-center bg-primary rounded-b-[50%]">
          <div className="relative -bottom-1/2 h-24 w-24 flex justify-center items-center rounded-full bg-white shadow-md p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full text-primary"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="w-full h-full mt-12 overflow-y-scroll pb-5">
          <div className="w-full p-6 pr-0 flex items-center gap-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-red-950"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <h1 className="text-xl text-gray-500">{data?.name}</h1>
          </div>
          <hr />
          <div className="w-full p-6 pr-0 flex items-center gap-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-red-950"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
              />
            </svg>

            <h1 className="text-xl text-gray-500">{data?.id}</h1>
          </div>
          <hr />
          <div className="w-full p-6 pr-4 gap-8 flex items-center break-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-red-950"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>

            <h1 className=" text-gray-500">{email}</h1>
          </div>
          <hr />
          <div className="w-full p-6 pr-0 flex items-center gap-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-red-950"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
              />
            </svg>

            <h1 className="text-xl text-gray-500">{data?.dateOfReg}</h1>
          </div>
          <hr />
          <div className="w-full flex justify-center">
            <button onClick={handleSignout} className="button mt-4 rounded-xl flex gap-2 items-center">
              <span>Logout</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default Profile;
