"use client";
import { handleSignup } from "@/Functions/functions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const SignupForm = () => {

  const router = useRouter();
  const [data, setData] = useState({
    username: "",
    id: "",
    email: "",
    password: "",
    confirm: "",
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
    const status = await handleSignup(
      data.id,
      data.username,
      data.email,
      data.password,
      form.current
    );
    if (status.success) {
      const otpData = {
        method: "signup",
        otp: status.otp,
        email: data.email,
        password: data.password,
        studentID: data.id
      };
      localStorage.setItem("otp", JSON.stringify(otpData));
      router.push("/otp");
    } else if (status.notValid) {
      setLoad(false);
      setState("Not a valid student");
    } else if (status.notValidEmail) {
      setLoad(false);
      setState("Not a valid email address");
    } else {
      setLoad(false);
      setState("Unknown error occured !!");
    }
    setTimeout(() => {
      setState("");
    }, 3000);
  };
  const inputs = [
    {
      label: "Name *",
      value: data.username,
      name: "username",
      type: "text",
    },
    {
      label: "Registration no: *",
      value: data.id,
      name: "id",
      type: "text",
    },
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
    {
      label: "Confirm password *",
      value: data.confirm,
      name: "confirm",
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
          className="rounded-3xl button py-2 mt-4 w-40"
          disabled={load}
        >
          SIGNUP
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
        Already have an account? <Link href={'/login'} className="font-bold ">Login</Link>
      </p>
    </div>
  );
};

export default SignupForm;
