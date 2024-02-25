import SignupForm from '@/components/SignupForm'
import Image from 'next/image'
import React from 'react'

const Signup = () => {
  return (
    <div className='flex min-h-screen flex-col bg-secondary'>
      <div className='absolute top-0 left-0 z-0'>
        <Image height={300} width={300} src="/images/Rectangle.svg" alt='rectangle'/>
      </div>
      <div className='flex flex-col flex-1 items-center pt-12 justify-center px-14 z-10'>
        <Image src="/images/prc-logo.svg" height={150} width={150} alt='prc-logo'/>
        <h1 className='text-5xl font-bold mt-4'>SIGNUP</h1>
        <SignupForm/>
      </div>
    </div>
  )
}

export default Signup
