import React from 'react'

import './Login.css'
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlineLockClosed } from "react-icons/hi";
import { TbShirt } from "react-icons/tb";

function Login({
  setEmail, 
  setPassword, 
  email, 
  password, 
  handleEmailAuth, 
  name, 
  setName, 
  isLogin
}) {
  return (
    <div>
        <div className='text-center mb-4 mt-4'>ادخل بيانات حسابك</div>
        <div className='d-flex flex-column gap-3'>
            {!isLogin && (
                <div className='input-container'>
                    <TbShirt className='fs-4 input-icon'/>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ادخل اسمك"
                        className='w-100 pe-5 input-2'
                    />
                </div>
            )}
            <div className='input-container'>
                <MdOutlineEmail className='fs-4 input-icon'/>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-100 pe-5 input-2'
                    placeholder='البريد الالكتروني'
                />
            </div>
            <div className='input-container'>
                <HiOutlineLockClosed className='fs-4 input-icon'/>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ادخل كلمة المرور"
                    className='w-100 pe-5 input-2'
                />
            </div>

            <button 
              onClick={handleEmailAuth} 
              className='main-btn w-100 mt-2 login-btn gradient-btn'
            >
                {isLogin ? "دخول" : "انشاء"}
            </button>
        </div>
    </div>
  )
}

export default Login