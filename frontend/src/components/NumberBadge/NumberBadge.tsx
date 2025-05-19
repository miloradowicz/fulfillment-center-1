import React from 'react'

type NumberBadgeProps = {
  number: string | undefined;
};

export const NumberBadge: React.FC<NumberBadgeProps> = ({ number }) => {
  return (
    <div className="inline-block text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 transition-colors px-3 py-1.5 rounded-lg shadow-sm">
      {number}
    </div>
  )
}
