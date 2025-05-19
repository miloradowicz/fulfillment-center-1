import React from 'react'

interface CustomTitleProps {
  text: string;
  icon: React.ReactNode;
  className?: string;
}

const CustomTitle: React.FC<CustomTitleProps> = ({ text, icon, className }) => {

  return (
    <div className={className}>
      <h2 className="text-md sm:text-2xl font-semibold text-primary flex items-center gap-1.5">
        {icon}
        {text}
      </h2>
    </div>

  )
}

export default CustomTitle
