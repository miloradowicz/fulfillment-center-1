import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { ClientFullReport } from '@/types'

interface Props {
  data: ClientFullReport[]
}

const ClientInvoiceBarChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map(client => {
    const invoiced = client.invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
    const paid = client.invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0)

    const debt = invoiced - paid

    return {
      name: client.client.name,
      invoiced,
      paid,
      debt,
    }
  })

  return (
    <Card className="w-full p-4 overflow-x-auto">
      <CardContent className="h-[307px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              width={70}
              tick={{ fontSize: 14 }}
              tickFormatter={(value: number) => {
                if (value >= 1_000_000) return `${ (value / 1_000_000).toFixed(1) } млн`
                if (value >= 1_000) return `${ (value / 1_000).toFixed(0) } тыс`
                return value.toString()
              }}
            />
            <Tooltip formatter={(value: number) => `${ value.toLocaleString() } ₽`} />
            <Legend
              layout="horizontal"
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 10 }}
            />
            <Bar dataKey="invoiced" fill="var(--color-chart-3)" name="Выставлено" />
            <Bar dataKey="paid" fill="var(--color-chart-2)" name="Оплачено" />
            <Bar dataKey="debt" fill="var(--color-chart-1)" name="Долг" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default ClientInvoiceBarChart
