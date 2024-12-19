import React from 'react'

const InputBox = ({ label, type, id, value, placeholder, onChange }) => {
    return (
        <>
            <label htmlFor="firstname" className='block text-lg font-medium text-white mt-4'>
                {label}<span className="text-red-500">*</span>
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                className='w-full h-[50px] bg-white/10 rounded-sm p-3 mt-1 text-white text-sm'
            />
        </>
    )
}

export default InputBox