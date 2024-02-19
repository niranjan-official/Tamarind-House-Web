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
    const status = await handleLogin(data.email,form.current);
    if(status.success){
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
    } else{
      setLoad(false);
      setState("Unknown error occured !!");
    }
    setTimeout(() => {
      setState("");
    }, 3000);
  };
  const inputs = [
    {
      label: "Email *",
      value: data.email,
      name: "email",
      type: "email",
    },
    {
      label: "Password *",
      value: data.password,
      name: "password",
      type: "password",
    },
  ];
  return (
    <div className="flex w-full mt-8 flex-col items-center">
      <form ref={form} onSubmit={handleSubmit} className="flex flex-col items-center">
        {inputs.map((input, key) => (
          <div key={key} className="w-full">
            <input
              type={input.type}
              name={input.name}
              className="input"
              placeholder={input.label}
              value={input.value}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <input name="otp" value="1234" type="number" readOnly hidden/>
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
        Don't have an account? <Link href={'/signup'} className="font-bold ">Signup</Link>
      </p>
    </div>
  );
};

export default LoginForm;
