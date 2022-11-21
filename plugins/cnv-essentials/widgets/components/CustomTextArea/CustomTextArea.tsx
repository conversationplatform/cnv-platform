import React from 'react'
import './CustomTextArea.scss'

interface CustomTextAreaProps {
  keyValue: string
  label: string
  onChange: (key: string, value: string) => void
}

function CustomTextArea({ keyValue, label, onChange }: CustomTextAreaProps) {
  return (
    <div className='custom-textarea-wrapper'>
      <label className='label'>{label}</label>
      <textarea
        maxLength={280}
        className='textarea'
        name={keyValue}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          const key = event.target.getAttribute('name')
          const value = event.target.value
          onChange(key, value)
        }}
      ></textarea>
    </div>
  )
}

export default CustomTextArea
