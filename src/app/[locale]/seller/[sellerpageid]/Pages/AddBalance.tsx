"use client";
import { useUserInfos } from '@/context/UserInfosContext';
import { CircleCheckBig, Info, Warehouse } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

export default function AddBalance() {
    const { isLoadingUserInfos, userInfos } = useUserInfos();
  return (
    <section
        className='w-full p-6 flex flex-col items-center'
    >
        <div
            className='w-full p-4 rounded-2xl 
                bg-white border border-gray-200'
        >
            {/* --- Title & Description --- */}
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
            {/* --- Notice --- */}
            <div
                className='w-full min-h-10 border border-orange-200 
                    px-4 py-2 mt-6 rounded-2xl bg-orange-600/10 
                    shadow shadow-orange-100 flex items-start gap-2'
            >
                <Info size={20} className='text-orange-700' />
                <span>
                    <h1 className='flex items-center gap-1 font-semibold'>Dear, <span className='text-orange-800'>{isLoadingUserInfos ? (<span className='flex w-25 h-3 rounded-full bg-orange-700/50 animate-pulse'/>) : userInfos?.fullname}.</span></h1>
                    <p
                        className='text-gray-700 px-2 py-1'
                    >
                        We’re just getting started, and we know how important online payments are for you. That’s why we’re working hard to bring card payment support very soon.
                    </p>
                </span>
            </div>
        </div>
        
        {/* --- Payment options --- */}
        <div
            className='w-full flex items-center justify-center 
                gap-6 my-6'
        >
            {["", "/Paypal.png", "/Stripe.png", "/Cashplus.png"].map((card, idx) => {
                return (
                    <div
                        key={idx}
                        className={`relative border w-40 h-30 rounded-2xl
                            ${idx === 1 || idx === 2 || idx === 3 ? "border-gray-100 cursor-not-allowed brightness-0 opacity-20" : "cursor-pointer border-gray-200"}
                            ${idx === 0 && "outline-2 hover:shadow-lg shadow-blue-700/30 bg-blue-50 outline-blue-500 transition-all duration-200 text-blue-600"}
                        `}
                    >
                        {idx !== 0 && (
                            <Image
                                src={card}
                                alt=''
                                fill
                                className={`overflow-hidden rounded-2xl object-contain p-2 ${idx === 3 && "scale-160"}`}
                                quality={100}
                                priority
                            />
                        )}
                        {idx === 0 && (
                            <div
                                className='relative w-full h-full flex 
                                    flex-col gap-1 items-center 
                                    justify-center'
                            >
                                <Warehouse size={20} />
                                <b className=''>
                                    Banque transfert
                                </b>
                                <span
                                    className='absolute -right-2 -top-2 
                                        p2 rounded-full bg-white'
                                >
                                    <CircleCheckBig size={20} />
                                </span>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
        {/* --- --- */}
        <div
            className='min-w-[500px] bg-white rounded-2xl 
                border border-gray-200 min-h-[400px] 
                overflow-hidden p-6'
        >
            {/* --- MasterCard Card --- */}
            {/* <div 
                className='relative w-full h-60'>
                <Image 
                    src="/MasterCardPhotopea.png"
                    alt=''
                    fill
                    className='object-cover scale-180'
                />
            </div> */}
            <span
                className='mb-4'
            >
                <h1
                    className='textlg font-semibold'
                >
                    Balance purchase
                </h1>
                <p
                    className='text-sm text-neutral-600'
                >
                    Enter the amount of credit you would like to purchase.
                </p>
            </span>
            {/* --- Input Amount --- */}
            <div
                className='flex flex-col my-4'
            >
                <label 
                    htmlFor="Amount"
                    className='text-sm text-gray-600 px-2 font-semibold'
                >
                    Amount <span className='text-red-700'>*</span>
                </label>
                <input 
                    type="text"
                    id='Amount'
                    autoFocus
                    name='Amount'
                    placeholder='minimun amount is 300,00 dh'
                    className='border border-gray-200 rounded-lg py-2 px-4
                        outline-blue-600'
                />
            </div>
            {/* --- Bank Transfert Details --- */}
            <div
                className='w-full bg-blue-50 rounded-lg border 
                    border-blue-100 p-4'
            >
                <h1
                    className='text-lg text-gray-500 mb-2'
                >
                    Bank Transfert Details
                </h1>
                <p
                    className='text-sm text-gray-600'
                >
                    Please transfert the Amount to one of the following bank accounts
                </p>
                <div
                    className='p-4 border border-gray-300 rounded-lg mt-2'
                >
                    <span className='flex items-center gap-2'><h1 className='font-semibold text-gray-600'>Name: </h1><span className='pr-1 text-gray-600'>Jamla.ma</span><button className='text-xs cursor-pointer text-blue-600'>Copy</button></span>
                    <span className='flex items-center gap-2'><h1 className='font-semibold text-gray-600'>Bank: </h1><span className='pr-1 text-gray-600'>CIH Bank</span><button className='text-xs cursor-pointer text-blue-600'>Copy</button></span>
                    <span className='flex items-center gap-2'><h1 className='font-semibold text-gray-600'>Account Number: </h1><span className='pr-1 text-gray-600'>1234 1234 1234 1234</span><button className='text-xs cursor-pointer text-blue-600'>Copy</button></span>
                </div>
            </div>
            <div
                className='mt-4 w-full flex justify-end gap-2'
            >
                <button
                    className='primary-button cursor-pointer py-1 px-6 rounded-lg border border-gray-300'
                >
                    Deposit
                </button>
            </div>
        </div>
    </section>
  )
}
