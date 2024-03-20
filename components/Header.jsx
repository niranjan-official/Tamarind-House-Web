import Image from 'next/image'
import React from 'react'
import { Philosopher } from 'next/font/google'
const philosopher = Philosopher({
  weight: ['400'],
  subsets: ['latin']
})
const Header = () => {
  return (
    <div className='w-full flex items-center h-20 p-4 gap-4 bg-white shadow-md fixed z-40'>
        <Image src="/images/prc-official.png" width={50} height={50} style={{width: 'auto',height:'100%'}} alt="prc" />
      <h1 className={`text-primary ${philosopher.className} text-3xl`}>Tamarind-House</h1>
    </div>
  )
}
export default Header;