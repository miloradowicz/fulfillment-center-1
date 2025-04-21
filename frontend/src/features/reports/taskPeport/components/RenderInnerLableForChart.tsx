import { PieLabelRenderProps } from 'recharts'

const RenderInnerLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  value,
}: PieLabelRenderProps) => {
  const r = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5
  const x = Number(cx) + r * Math.cos(-midAngle * (Math.PI / 180))
  const y = Number(cy) + r * Math.sin(-midAngle * (Math.PI / 180))

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={16}
      fontWeight="400"
    >
      {value}
    </text>
  )
}
export default RenderInnerLabel
