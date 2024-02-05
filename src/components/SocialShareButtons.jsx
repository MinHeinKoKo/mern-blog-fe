import React from 'react'
import { FaFacebookSquare , FaTwitterSquare , FaRedditSquare, FaWhatsappSquare } from 'react-icons/fa'

const SocialShareButtons = ({url , title }) => {
    
  return (
    <div className='flex w-full justify-between'>
        <a href="/" target='_blank' rel="noreferrer">
            <FaFacebookSquare className='text-[#3b5998] w-12 h-auto' />
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${url}`} target='_blank' rel="noreferrer">
            <FaTwitterSquare className='text-[#00acee] w-12 h-auto' />
        </a>
        <a href="/" target='_blank' rel="noreferrer">
            <FaRedditSquare className='text-[#ff4500] w-12 h-auto' />
        </a>
        <a href="/" target='_blank' rel="noreferrer">
            <FaWhatsappSquare className='text-[#25D366] w-12 h-auto' />
        </a>
    </div>
  )
}

export default SocialShareButtons