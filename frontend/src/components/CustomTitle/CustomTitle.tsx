import React from 'react'

interface CustomTitleProps {
  text: string;
  icon: React.ReactNode;
}

const CustomTitle: React.FC<CustomTitleProps> = ({ text, icon }) => {

  return (
    <h2 className="text-md sm:text-2xl font-semibold flex-grow text-primary flex items-center gap-2">
      {icon}
      {text}
    </h2>
  )
}

export default CustomTitle
