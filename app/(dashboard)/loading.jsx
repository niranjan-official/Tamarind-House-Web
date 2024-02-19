import Image from 'next/image'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex w-full h-full justify-center items-center '>
        <Image src={'/images/prc-logo.svg'} width={60} height={60} alt='loading' className='animate-pulse'/>
    </div>
  )
}

export default Loading
