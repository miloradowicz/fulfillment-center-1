import React from 'react'

type StatusBadgeProps = {
  status: string;
  stylesMap: Record<string, string>;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, stylesMap }) => {
  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  const statusClass =
    stylesMap[status] || 'bg-primary/10 text-primary/80 border font-bold px-4 py-2 rounded-lg'

  return <span className={statusClass}>{capitalizeFirstLetter(status)}</span>
}
