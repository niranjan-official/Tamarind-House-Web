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
    const { value, name } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(data.password.length > 5){
      if(data.password === data.confirm){
        setLoad(true);
        const upperCaseId = data.id.toUpperCase().trim();
        const status = await handleSignup(
          upperCaseId,
          data.email,
          form.current
        );
        if (status.success) {
          const EmailData = {
            email: data.email,
            otp: status.otp
          }
          const response = await fetch('/api/send',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(EmailData)
          })
          if(response.status === 200){
            const otpData = {
              method: "signup",
              otp: status.otp,
              username: data.username,
              email: data.email,
              password: data.password,
              studentID: upperCaseId
            };
            localStorage.setItem("otp", JSON.stringify(otpData));
            router.push("/otp");
          }else{
            setLoad(false);
            setState("Unknown error occured !!");
          }
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
      }else{
        setState("Passwords mismatching ??")
      }
    }else{
      setState("Min 6 characters required for password")
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
          <div key={key} className="input mb-4">
            <input
              type={input.type}
              name={input.name}
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
