'use client'
import { getStudentTokenHistory } from '@/Functions/functions';
import HistoryCard from '@/components/HistoryCard';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Loading from '../loading';
import Image from 'next/image';

const History = () => {

  const [email, setEmail] = useState('');
  const [studentHistory, setStudentHistory] = useState('');
  const [load, setLoad] = useState(true);
  const [empty, setEmpty] = useState(false);

  useLayoutEffect(()=>{
    const userData = JSON.parse(localStorage.getItem("studentData"));
    if(userData){
      setEmail(userData.email);
    }
  },[])
  useEffect(()=>{
    if(email){
      fetchHistory()
    }
  },[email])
  const fetchHistory =async()=>{
    const data = await getStudentTokenHistory(email);
    if(data){
      console.log("Data: ",data);
      setStudentHistory(data);
    }else{
      setEmpty(true);
    }
    setLoad(false);
  }

  if(!load){
    if(!empty){
      return (
        <div className='w-full flex flex-1 flex-col gap-4 p-4 overflow-y-scroll'>
          {
            studentHistory ? 
            studentHistory.map((obj,key)=>{
              return(
                <HistoryCard key={key} tokenNumber={obj.key} dispenseTime={obj.value.dispenseTime} generationTime={obj.value.timestamp} date={'01-12-24'}/>
              )
            }) : null
          }
        </div>
      )
    }else{
      return(
        <div className='w-full flex flex-1 flex-col p-4'>
          <div className='w-full h-max'>
            <Image src="/images/empty.svg" width={0} height={0} style={{width: '100%', height: 'auto'}} />
          </div>
          <h1 className='text-center text-4xl font-bold text-red-400'>No Tokens in the History !!</h1>
        </div>
      )
    }
  }else{
    return <Loading/> ;
  }
}

export default History
