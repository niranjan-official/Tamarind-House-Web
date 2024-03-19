"use client";
import { Login, Signup, generateOTP } from "@/Functions/functions";
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
  const [otpCacheData, setOtpCacheData] = useState({});
  const [load, setLoad] = useState(false);
  const otpBoxReference = useRef([]);

  const Ref = useRef(null);
  const [timer, setTimer] = useState("");
  const [resendState, setResendStatus] = useState(false);

  useEffect(() => {
    const fetchOtp = localStorage.getItem("otp");
    if (fetchOtp) {
      const data = JSON.parse(fetchOtp);
      setOtpCacheData(data);
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
    if (correctOTP == otp.join("")) {
      const userData = JSON.parse(localStorage.getItem("otp"));
      let status;
      if (userData.method === "signup") {
        status = await Signup(userData);
      } else {
        status = await Login(userData.email, userData.password);
      }
      if (status.success) {
        localStorage.setItem("studentEmail", JSON.stringify(userData.email));
        localStorage.removeItem("otp");
        Router.push("/home");
      }
    } else {
      setOtpError("❌ Wrong OTP Please Check Again");
      setLoad(false);
    }
    setTimeout(() => {
      setOtpError(null);
    }, 3000);
  };
  const otpResend = async () => {
    clearTimer(getDeadTime());
    const EmailData = {
      email: otpEmail,
      otp: generateOTP(),
    };
    const response = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(EmailData),
    });
    if (response.status === 200) {
      const otpData = {
        method: otpCacheData.method,
        otp: EmailData.otp,
        email: otpEmail,
        password: otpCacheData.password,
        username: otpCacheData.username,
      };
      localStorage.setItem("otp", JSON.stringify(otpData));
      setCorrectOTP(EmailData.otp);
      setOtpError("New OTP has been sent");
    } else {
      setOtpError("Resend unsuccessful !");
    }
    setTimeout(() => {
      setOtpError(null);
    }, 3000);
  };

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      minutes,
      seconds,
    };
  };
  const clearTimer = (e) => {
    setResendStatus(true);
    setTimer("1:00");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const startTimer = (e) => {
    let { total, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
      if (total == 0) {
        setTimer(null);
        setResendStatus(false);
      }
    }
  };
  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 60);
    return deadline;
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
        <button
          disabled={resendState}
          onClick={otpResend}
          className="text-primary disabled:text-zinc-400 font-bold"
        >
          RESEND
        </button>{" "}
      </p>
      {resendState && (
        <p className="text-gray-500 text-sm mt-2">Resend in {timer}</p>
      )}
      {otpError && <p className="mt-5">{otpError}</p>}
      <div className="fixed bg-secondary flex items-center bottom-0 w-full h-20 p-4 border-t-2">
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
