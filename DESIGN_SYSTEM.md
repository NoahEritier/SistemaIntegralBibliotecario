# Sistema de Diseño - Códice

## Paleta de Colores

### Uso en Tailwind CSS

Los colores están configurados en `tailwind.config.js` y se pueden usar directamente:

```tsx
// Fondo principal (crema pálido)
<div className="bg-background-primary">

// Fondo secundario (blanco puro)
<div className="bg-background-secondary">

// Texto principal (casi negro)
<p className="text-text-primary">

// Texto secundario (marrón tierra)
<p className="text-text-secondary">

// Bordes y acentos
<div className="border-accent">

// Bordes activos (hover, focus)
<button className="hover:border-accent-active">

// Estados
<div className="text-error">Error</div>
<div className="text-success">Éxito</div>
```

## Tipografía

### Títulos (Playfair Display)
```tsx
<h1 className="font-display">Título Principal</h1>
```

### Cuerpo (Inter)
```tsx
<p className="font-body">Texto del cuerpo</p>
```

## Componentes Base

### Botones
```tsx
import { Button } from '@/components/ui'

<Button variant="default">Botón Principal</Button>
<Button variant="outline">Botón Outline</Button>
<Button variant="ghost">Botón Ghost</Button>
```

## Reglas de Diseño

1. **Bordes**: Siempre usar `border-accent` (1px)
2. **Border Radius**: `rounded-md` (6px) o `rounded` (4px)
3. **Sombras**: Evitar. Si es necesario, usar `shadow-subtle`
4. **Espaciado**: Generoso. Usar `p-6`, `p-8`, `space-y-4`, etc.
5. **Transiciones**: Suaves, solo en hover/focus: `transition-colors`

## Prohibiciones

- ❌ Emojis en la UI
- ❌ Bordes redondeados excesivos (pills)
- ❌ Colores neón o brillantes
- ❌ Sombras difusas grandes
- ❌ Gradientes
- ❌ Colores fuera de la paleta definida






