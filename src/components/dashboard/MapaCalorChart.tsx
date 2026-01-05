// Mapa de calor implementado con HTML/CSS puro

interface MapaCalorChartProps {
  data: Array<{
    dia: string
    hora: string
    valor: number
  }>
}

// Convertir datos a formato de matriz para el heatmap
function transformDataForHeatmap(data: MapaCalorChartProps['data']) {
  const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const horas = Array.from({ length: 12 }, (_, i) => `${8 + i}:00`)

  return horas.map((hora) => ({
    hora,
    ...dias.reduce((acc, dia) => {
      const item = data.find((d) => d.dia === dia && d.hora === hora)
      acc[dia] = item?.valor || 0
      return acc
    }, {} as Record<string, number>),
  }))
}

export function MapaCalorChart({ data }: MapaCalorChartProps) {
  const heatmapData = transformDataForHeatmap(data)
  const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  // Calcular valores para colorear
  const valores = data.map((d) => d.valor)
  const maxValor = Math.max(...valores, 1)
  const minValor = Math.min(...valores, 0)

  const getColor = (valor: number) => {
    const ratio = (valor - minValor) / (maxValor - minValor || 1)
    if (ratio < 0.25) return '#F5F5F5'
    if (ratio < 0.5) return '#D1D1D1'
    if (ratio < 0.75) return '#8C7B75'
    return '#2C1E1A'
  }

  return (
    <div className="bg-background-secondary border border-accent rounded-md p-6">
      <h3 className="text-lg font-display text-text-primary mb-6">
        Mapa de Calor - Afluencia por Día y Hora
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-xs text-text-secondary font-medium text-left">Hora</th>
              {dias.map((dia) => (
                <th
                  key={dia}
                  className="p-2 text-xs text-text-secondary font-medium text-center min-w-[60px]"
                >
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 text-xs text-text-secondary font-medium">
                  {row.hora}
                </td>
                {dias.map((dia) => {
                  const valor = Number(row[dia as keyof typeof row]) || 0
                  return (
                    <td
                      key={dia}
                      className="p-2 text-center"
                      style={{
                        backgroundColor: getColor(valor),
                        color: valor > maxValor * 0.5 ? '#FFFFFF' : '#2C1E1A',
                      }}
                    >
                      <span className="text-xs font-medium">{valor}</span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
        <span>Baja afluencia</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-[#F5F5F5] border border-accent"></div>
          <div className="w-4 h-4 bg-[#D1D1D1] border border-accent"></div>
          <div className="w-4 h-4 bg-[#8C7B75] border border-accent"></div>
          <div className="w-4 h-4 bg-[#2C1E1A] border border-accent"></div>
        </div>
        <span>Alta afluencia</span>
      </div>
    </div>
  )
}

