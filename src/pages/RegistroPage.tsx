import { useState } from 'react'
import { UserPlus, Mail, MapPin, CreditCard, Phone, Lock } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { useToastStore } from '@/store/toastStore'
import { useUsuarioPublicoStore } from '@/store/usuarioPublicoStore'
import { CategoriaUsuario } from '@/store/politicasStore'

export function RegistroPage() {
  const { success, error } = useToastStore()
  const { setUsuarioActual } = useUsuarioPublicoStore()
  const [procesando, setProcesando] = useState(false)
  const [formData, setFormData] = useState({
    legajoDni: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    fechaNacimiento: '',
    categoriaUsuario: 'Estudiante' as CategoriaUsuario,
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categoriasUsuario: CategoriaUsuario[] = [
    'Estudiante',
    'Docente',
    'Investigador',
    'Vecino',
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.legajoDni.trim()) {
      newErrors.legajoDni = 'El DNI/Legajo es requerido'
    } else if (!/^\d{7,8}$/.test(formData.legajoDni)) {
      newErrors.legajoDni = 'El DNI debe tener 7 u 8 dígitos'
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido'
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida'
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida'
    }

    if (!formData.codigoPostal.trim()) {
      newErrors.codigoPostal = 'El código postal es requerido'
    }

    if (!formData.fechaNacimiento.trim()) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      error('Por favor, complete todos los campos correctamente')
      return
    }

    setProcesando(true)

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Crear nuevo usuario
      const nuevoUsuario = {
        id: Date.now(),
        legajoDni: formData.legajoDni,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        categoriaUsuario: formData.categoriaUsuario,
      }

      // Establecer como usuario actual
      setUsuarioActual(nuevoUsuario)

      success(
        `¡Registro exitoso! Bienvenido/a ${formData.nombre} ${formData.apellido}. Ya puede solicitar préstamos.`
      )

      // Limpiar formulario
      setFormData({
        legajoDni: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        fechaNacimiento: '',
        categoriaUsuario: 'Estudiante',
        password: '',
        confirmPassword: '',
      })
      setErrors({})
    } catch (err) {
      error('Error al procesar el registro. Por favor, intente nuevamente.')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-background-secondary border border-accent rounded-md p-6">
        <div className="flex items-center gap-3 mb-2">
          <UserPlus className="w-8 h-8 text-accent-active" />
          <h1 className="text-3xl font-display text-text-primary">Registro de Usuario</h1>
        </div>
        <p className="text-text-secondary">
          Complete el formulario para crear su cuenta y acceder a los servicios de la biblioteca
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-background-secondary border border-accent rounded-md p-6 space-y-6">
        {/* Información Personal */}
        <div className="space-y-4">
          <h2 className="text-xl font-display text-text-primary border-b border-accent pb-2">
            Información Personal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="DNI/Legajo"
              value={formData.legajoDni}
              onChange={(e) => setFormData({ ...formData, legajoDni: e.target.value })}
              error={errors.legajoDni}
              placeholder="12345678"
              icon={<CreditCard className="w-4 h-4 text-text-secondary" />}
            />
            <Input
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              error={errors.nombre}
              placeholder="Juan"
            />
            <Input
              label="Apellido"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              error={errors.apellido}
              placeholder="Pérez"
            />
            <Input
              label="Fecha de Nacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
              error={errors.fechaNacimiento}
            />
            <Select
              label="Categoría de Usuario"
              value={formData.categoriaUsuario}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoriaUsuario: e.target.value as CategoriaUsuario,
                })
              }
            >
              {categoriasUsuario.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="space-y-4">
          <h2 className="text-xl font-display text-text-primary border-b border-accent pb-2">
            Información de Contacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="juan.perez@example.com"
              icon={<Mail className="w-4 h-4 text-text-secondary" />}
            />
            <Input
              label="Teléfono"
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              error={errors.telefono}
              placeholder="+54 11 1234-5678"
              icon={<Phone className="w-4 h-4 text-text-secondary" />}
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-4">
          <h2 className="text-xl font-display text-text-primary border-b border-accent pb-2">
            Dirección
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                error={errors.direccion}
                placeholder="Calle y número"
                icon={<MapPin className="w-4 h-4 text-text-secondary" />}
              />
            </div>
            <Input
              label="Ciudad"
              value={formData.ciudad}
              onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              error={errors.ciudad}
              placeholder="Buenos Aires"
            />
            <Input
              label="Código Postal"
              value={formData.codigoPostal}
              onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
              error={errors.codigoPostal}
              placeholder="1234"
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="space-y-4">
          <h2 className="text-xl font-display text-text-primary border-b border-accent pb-2">
            Contraseña
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              placeholder="Mínimo 6 caracteres"
              icon={<Lock className="w-4 h-4 text-text-secondary" />}
            />
            <Input
              label="Confirmar Contraseña"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              placeholder="Repita la contraseña"
              icon={<Lock className="w-4 h-4 text-text-secondary" />}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4 border-t border-accent">
          <Button type="submit" disabled={procesando} size="lg" className="flex-1">
            {procesando ? 'Registrando...' : 'Registrarse'}
          </Button>
        </div>
      </form>
    </div>
  )
}

