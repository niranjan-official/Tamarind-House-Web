import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <div className='w-full flex items-center h-20 p-4 bg-primary shadow-md fixed z-40'>
        <Image src="/images/prc-logo.svg" width={0} height={0} style={{width: 'auto',height:'100%'}} alt="" />
      <h1 className='text-white text-xl font-bold'>Tamarind-House</h1>
    </div>
  )
}
export default Header;