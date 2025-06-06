import { Loader } from 'lucide-react'
import React from 'react'

const LoaderSpinner = () => {
  return (
    <div data-testid="loader-spinner" className='flex-center h-screen w-full'>
        <Loader className='animate-spin text-red-1'
        size={30}/>
    </div>
  )
}

export default LoaderSpinner