'use client'
import { getStudentTokenHistory } from '@/Functions/functions';
import HistoryCard from '@/components/HistoryCard';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Loading from '../loading';

const History = () => {

  const [email, setEmail] = useState('');
  const [studentHistory, setStudentHistory] = useState('');
  const [load, setLoad] = useState(true);

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
      fetchHistory()
    }
  },[email])
  const fetchHistory =async()=>{
    const data = await getStudentTokenHistory(email);
    if(data){
      console.log("Data: ",data);
      setStudentHistory(data);
      setLoad(false);
    }
  }
  if(!load){
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
    return <Loading/> ;
  }
}

export default History
