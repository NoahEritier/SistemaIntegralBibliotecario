import { useForm } from 'react-hook-form'
import { Input, Select, Textarea, Button } from '@/components/ui'

interface FormularioManifestacionProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

// Datos mockeados para selects - En producción vendrán de la API
const editoriales = [
  { value: '1', label: 'Editorial Planeta' },
  { value: '2', label: 'Penguin Random House' },
  { value: '3', label: 'Editorial Sudamericana' },
]

const formatos = [
  { value: '1', label: 'Libro' },
  { value: '2', label: 'Revista' },
  { value: '3', label: 'DVD' },
  { value: '4', label: 'CD' },
]

const idiomas = [
  { value: '1', label: 'Español' },
  { value: '2', label: 'Inglés' },
  { value: '3', label: 'Francés' },
]

const paises = [
  { value: '1', label: 'Argentina' },
  { value: '2', label: 'España' },
  { value: '3', label: 'México' },
]

export function FormularioManifestacion({
  onSubmit,
  onCancel,
  initialData,
}: FormularioManifestacionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {},
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Datos Principales */}
      <div className="space-y-4">
        <h3 className="text-base font-display text-text-primary border-b border-accent pb-2">
          Datos Principales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Título"
            {...register('tituloPropio', { required: 'El título es requerido' })}
            error={errors.tituloPropio?.message as string}
          />
          <Input
            label="Subtítulo"
            {...register('subtitulo')}
          />
          <Input
            label="ISBN/ISSN"
            {...register('isbnIssn')}
          />
          <Select
            label="Editorial"
            options={editoriales}
            {...register('idEditorial', { required: 'La editorial es requerida' })}
            error={errors.idEditorial?.message as string}
          />
          <Input
            label="Número de Edición"
            {...register('numeroEdicion')}
          />
          <Input
            label="Año de Publicación"
            type="number"
            {...register('anioPublicacion')}
          />
        </div>
      </div>

      {/* Autoridades */}
      <div className="space-y-4">
        <h3 className="text-base font-display text-text-primary border-b border-accent pb-2">
          Autoridades
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Autor Principal"
            {...register('autorPrincipal')}
          />
          <Input
            label="Otros Autores"
            {...register('otrosAutores')}
            placeholder="Separados por comas"
          />
        </div>
      </div>

      {/* Detalles Físicos */}
      <div className="space-y-4">
        <h3 className="text-base font-display text-text-primary border-b border-accent pb-2">
          Detalles Físicos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Formato"
            options={formatos}
            {...register('idFormato', { required: 'El formato es requerido' })}
            error={errors.idFormato?.message as string}
          />
          <Select
            label="Idioma"
            options={idiomas}
            {...register('idIdioma', { required: 'El idioma es requerido' })}
            error={errors.idIdioma?.message as string}
          />
          <Select
            label="País"
            options={paises}
            {...register('idPais')}
          />
          <Input
            label="Lugar de Publicación"
            {...register('lugarPublicacion')}
          />
          <Input
            label="Descripción Física"
            {...register('descripcionFisica')}
            placeholder="Ej: 300 p.; 23 cm"
          />
          <Input
            label="URL Imagen de Tapa"
            type="url"
            {...register('imagenTapaUrl')}
          />
        </div>
        <Textarea
          label="Notas Generales"
          rows={3}
          {...register('notasGenerales')}
        />
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-accent">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="default">
          Guardar
        </Button>
      </div>
    </form>
  )
}






