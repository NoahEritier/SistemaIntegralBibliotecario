import { useState } from 'react'
import { MostradorCirculacion, TablaPrestamos } from '@/components/circulacion'
import { Button } from '@/components/ui/Button'
import { BookOpen, List } from 'lucide-react'
import { cn } from '@/utils/cn'

export function CirculacionPage() {
  const [vista, setVista] = useState<'mostrador' | 'lista'>('mostrador')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-text-primary">Módulo de Circulación</h2>
          <p className="text-sm text-text-secondary mt-1">
            Préstamos y devoluciones de materiales
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={vista === 'mostrador' ? 'default' : 'outline'}
            onClick={() => setVista('mostrador')}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Mostrador
          </Button>
          <Button
            variant={vista === 'lista' ? 'default' : 'outline'}
            onClick={() => setVista('lista')}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            Lista de Préstamos
          </Button>
        </div>
      </div>

      {vista === 'mostrador' ? <MostradorCirculacion /> : <TablaPrestamos />}
    </div>
  )
}



