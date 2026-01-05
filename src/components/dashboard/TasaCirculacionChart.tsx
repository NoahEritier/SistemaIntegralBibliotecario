import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface TasaCirculacionChartProps {
  data: Array<{
    mes: string
    tasa: number
    promedio: number
  }>
}

export function TasaCirculacionChart({ data }: TasaCirculacionChartProps) {
  return (
    <div className="bg-background-secondary border border-accent rounded-md p-6">
      <h3 className="text-lg font-display text-text-primary mb-6">
        Tasa de Circulación Mensual
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
            label={{ value: 'Tasa (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #8C7B75',
              borderRadius: '4px',
              fontSize: '12px',
            }}
            formatter={(value: number) => `${value.toFixed(1)}%`}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
          <Bar
            dataKey="tasa"
            name="Tasa Actual"
            fill="#2C1E1A"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="promedio"
            name="Promedio Anual"
            fill="#8C7B75"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}




