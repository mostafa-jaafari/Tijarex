import React from 'react'

export default function AddBalance() {
  return (
    <section
        className='w-full p-6 flex flex-col items-center'
    >
        <div
            className='w-full p-4 rounded-2xl 
                bg-white border border-gray-200'
        >
            <span>
                <h1
                    className='text-lg font-semibold'
                    >
                    My balance
                </h1>
                <p
                    className='text-gray-500'
                >
                    View and manage your balance purchases transactions.
                </p>
            </span>

            <div
                className='w-full min-h-10 border border-orange-300 
                    p-2 rounded-2xl bg-orange-600/10'
            ></div>
        </div>
    </section>
  )
}
