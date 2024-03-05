"use client";
import { Login, Signup } from "@/Functions/functions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const numberOfDigits = 4;

const OTP = () => {

  const Router = useRouter();
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState(null);
  const [correctOTP, setCorrectOTP] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [load,setLoad] = useState(false)
  const otpBoxReference = useRef([]);

  useEffect(() => {
    const fetchOtp = localStorage.getItem("otp");
    if (fetchOtp) {
      const data = JSON.parse(fetchOtp);
      console.log(data);
      setCorrectOTP(data.otp);
      setOtpEmail(data.email);
    } else {
      Router.push("/login");
    }
  }, []);

  function handleChange(value, index) {
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  const handleSubmit = async () => {
    setLoad(true);
    
    console.log("correct:", correctOTP);
    console.log("otp:", otp.join(""));
    if (correctOTP == otp.join("")) {
      const userData = JSON.parse(localStorage.getItem("otp"));
      let status;
      if(userData.method === "signup"){
        status = await Signup(userData);
      }else{
        status = await Login(userData.email,userData.password);
      }
      if(status.success){
        localStorage.setItem("studentEmail",JSON.stringify(userData.email));
        localStorage.removeItem("otp");
        Router.push("/home");
      }
    } else {
      setOtpError("❌ Wrong OTP Please Check Again");
      setLoad(false)
    }
    setTimeout(() => {
      setOtpError(null);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen p-4 pt-8 flex-col items-center bg-secondary select-none overflow-hidden">
      <div className="w-full h-auto">
        <Image
          src={"/images/otp.svg"}
          width={0}
          height={0}
          style={{ width: "100%", height: "auto" }}
          alt="otp poster"
        />
      </div>
      <h1 className="text-3xl font-bold text-primary mt-4">OTP Verification</h1>
      <p className="text-center px-4 mt-1 text-gray-400 mb-8">
        We have sent the code verification to your email
      </p>
      <p className="text-center mb-4 px-4">
        Enter the OTP send to :{" "}
        <span className="text-primary select-all">{otpEmail}</span>
      </p>
      <div className="flex items-center gap-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            value={digit}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
            ref={(reference) => (otpBoxReference.current[index] = reference)}
            className={`border border-primary w-16 h-16 p-3 rounded-xl block bg-transparent text-center text-2xl font-semibold focus:border-2 focus:outline-none appearance-none`}
          />
        ))}
      </div>
      <p className="mt-10">
        Didn't receive OTP?{" "}
        <span className="text-primary font-bold">RESEND</span>{" "}
      </p>
      {otpError && <p className="mt-5">{otpError}</p>}
      <div className="fixed flex items-center bottom-0 w-full h-20 p-4 border-t-2">
        <button
        disabled={load}
          onClick={handleSubmit}
          className="w-full button rounded-xl py-3"
        >
          Submit
          {load && (
            <Image
              src={"/images/loading.png"}
              width={20}
              height={20}
              className="animate-spin"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default OTP;
