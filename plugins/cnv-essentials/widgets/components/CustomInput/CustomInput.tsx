import React from 'react'
import './CustomInput.scss'

interface CustomInputProps {
  keyValue: string
  label: string
  onChange: (key: string, value: string) => void
}

function CustomInput({ keyValue, label, onChange }: CustomInputProps) {
  return (
    <div className='custom-input-wrapper'>
      <label className='label'>{label}</label>
      <input
        className='input'
        type='text'
        name={keyValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const key = event.target.getAttribute('name')
          const value = event.target.value
          onChange(key, value)
        }}
      />
    </div>
  )
}

export default CustomInput
