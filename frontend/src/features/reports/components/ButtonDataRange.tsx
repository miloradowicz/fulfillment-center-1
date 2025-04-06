import React from 'react'

interface ButtonComponentProps {
  onClick: () => void;
  text: string;
}

const ButtonDataRange: React.FC<ButtonComponentProps> = ({ onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className="px-2 sm:px-4 py-2 w-full sm:w-44 mb-2 bg-[#3679a1] text-white border-none rounded-md cursor-pointer text-sm shadow-sm transition-all duration-300 hover:bg-[#2f6586] hover:shadow-md active:scale-95 active:shadow-lg"
    >
      {text}
    </button>
  )
}

export default ButtonDataRange
