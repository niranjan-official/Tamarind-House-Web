'use client'
import { useAuth } from "@/firebase/auth";
import Loading from "./(dashboard)/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const User = useAuth();
  const Router = useRouter();
  
 useEffect(()=>{
   if(User){
     Router.replace('/home');
   }
 },[User])

    return (
      <div className="w-full h-screen flex items-center justify-center"><Loading/></div>
    )
    
}
