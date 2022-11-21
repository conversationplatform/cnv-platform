import React from 'react'
import './CustomButton.scss'

enum ButtonType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  INTERNAL = 'INTERNAL'
}
export interface CustomButtonProps {
  disabled: boolean
  text: string
  buttonType?: ButtonType
  sendValueOnClick: () => void
}

const primaryButtonStyles: any = {
  '--color': 'var(--conversation-app-primary-text-color)',
  '--backgroundColor': 'var(--conversation-app-button-color)',
  '--colorHover': 'var(--conversation-app-button-color)',
  '--backgroundColorHover': 'var(--conversation-app-primary-text-color)',
  '--colorDisabled': '#606060',
  '--backgroundColorDisabled': '#d5d4d4'
}

const secondaryButtonStyles: any = {
  '--color': 'var(--conversation-app-primary-text-color)',
  '--backgroundColor': 'var(--conversation-app-button-color)',
  '--colorHover': 'var(--conversation-app-button-color)',
  '--backgroundColorHover': 'var(--conversation-app-primary-text-color)',
  '--colorDisabled': 'var(--conversation-app-primary-text-color)',
  '--backgroundColorDisabled': 'var(--conversation-app-primary-text-color)'
}

const internalButtonStyles: any = {
  '--color': 'var(--conversation-app-primary-text-color)',
  '--backgroundColor': 'var(--conversation-app-button-color)',
  '--colorHover': 'var(--conversation-app-button-color)',
  '--backgroundColorHover': 'var(--conversation-app-primary-text-color)',
  '--colorDisabled': 'var(--conversation-app-primary-text-color)',
  '--backgroundColorDisabled': 'var(--conversation-app-primary-text-color)'
}

function CustomButton({
  disabled,
  text,
  buttonType,
  sendValueOnClick
}: CustomButtonProps) {
  let selectedStyles = primaryButtonStyles
  if (buttonType === ButtonType.SECONDARY)
    selectedStyles = secondaryButtonStyles
  if (buttonType === ButtonType.INTERNAL) selectedStyles = internalButtonStyles

  return (
    <button
      style={selectedStyles}
      className='custom-button-wrapper'
      disabled={disabled}
      onClick={sendValueOnClick}
    >
      {text}
    </button>
  )
}

export default CustomButton
