"use client";
import { handleLogin } from "@/Functions/functions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const LoginForm = () => {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [load, setLoad] = useState(false);
  const [state, setState] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const form = useRef();

  const handleChange = (e) => {
    console.log(e.target);
    const { value, name } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const status = await handleLogin(data.email, form.current);
    if (status.success) {
      const otpData = {
        method: "login",
        otp: status.otp,
        email: data.email,
        password: data.password,
      };
      localStorage.setItem("otp", JSON.stringify(otpData));
      router.push("/otp");
    } else if (status.notValid) {
      setLoad(false);
      setState("Not a valid Email");
    } else {
      setLoad(false);
      setState("Unknown error occured !!");
    }
    setTimeout(() => {
      setState("");
    }, 3000);
  };
 
  return (
    <div className=" flex mt-8 flex-col items-center">
      <form
        ref={form}
        onSubmit={handleSubmit}
        className="flex flex-col items-center"
      >
        <div className="input flex justify-between">
          <input
            type="text"
            name="email"
            placeholder="Email *"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input flex justify-between">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password *"
            value={data.password}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            )}
          </button>
        </div>
   
        <input name="otp" value="1234" type="number" readOnly hidden />
        {state && <p className="text-sm text-primary">{state}</p>}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-3xl py-2 button mt-4 w-40"
          disabled={load}
        >
          LOGIN
          {load && (
            <Image
              src={"/images/loading.png"}
              width={20}
              height={20}
              className="animate-spin"
            />
          )}
        </button>
      </form>
      <p className="text-sm mt-4 text-primary">
        Don't have an account?{" "}
        <Link href={"/signup"} className="font-bold ">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
