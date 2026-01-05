import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface PrestamosChartProps {
  data: Array<{
    mes: string
    prestamos: number
    devoluciones: number
  }>
}

export function PrestamosChart({ data }: PrestamosChartProps) {
  return (
    <div className="bg-background-secondary border border-accent rounded-md p-6">
      <h3 className="text-lg font-display text-text-primary mb-6">
        Evolución de Préstamos vs Devoluciones
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
          <XAxis
            dataKey="mes"
            stroke="#5C4B45"
            style={{ fontSize: '12px' }}
            tickLine={false}
          />
          <YAxis
            stroke="#5C4B45"
            style={{ fontSize: '12px' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #8C7B75',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="prestamos"
            name="Préstamos"
            stroke="#2C1E1A"
            strokeWidth={1.5}
            dot={{ fill: '#2C1E1A', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="devoluciones"
            name="Devoluciones"
            stroke="#4A5D44"
            strokeWidth={1.5}
            dot={{ fill: '#4A5D44', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}






