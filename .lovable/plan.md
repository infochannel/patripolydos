
# Plan: Hacer visible el botón "Confirmar Ingreso" en todas las vistas

## Problema Identificado

El botón **"Confirmar Ingreso"** solo aparece en la pestaña **"Fuentes"**, pero la pestaña por defecto es **"Resumen"**. Esto causa que el usuario no vea el botón a menos que haga clic manualmente en la pestaña "Fuentes".

## Soluciones Propuestas

### Opcion A: Agregar botón "Confirmar Ingreso" a la vista de Resumen (Recomendada)

Agregar el botón de confirmación también a las tarjetas de categorías que aparecen en el "Resumen", permitiendo confirmar ingresos desde cualquier pestaña.

### Opcion B: Cambiar la pestaña por defecto a "Fuentes"

Modificar `defaultValue="overview"` a `defaultValue="sources"` para que la primera vista sea la de Fuentes donde ya está el botón.

## Implementacion Recomendada (Opcion A)

Modificare las tarjetas de categorias en la pestaña "Resumen" para incluir una lista expandible de fuentes con el boton de confirmar ingreso.

---

## Cambios Tecnicos

### Archivo: `src/pages/Cashflow.tsx`

1. **Expandir las tarjetas de categoria en el Resumen** (lineas 453-476):
   - Convertir cada tarjeta de categoria de un resumen simple a una vista que muestre las fuentes individuales
   - Agregar el boton "Confirmar Ingreso" a cada fuente dentro de la tarjeta de categoria

2. **Alternativa mas simple**: Agregar una seccion "Fuentes Activas" debajo de las categorias en el Resumen con las tarjetas completas de fuentes incluyendo el boton de confirmacion.

### Estructura propuesta para el Resumen:

```text
+----------------------------------+
| Resumen Tab                      |
+----------------------------------+
| [Quick Actions: Aumentar Meta]   |
+----------------------------------+
| Categorias (overview cards)      |
| - Bienes Raices: €800/mes        |
| - Dividendos: €50/mes            |
+----------------------------------+
| Confirmar Ingresos Recientes     |
| +------------------------------+ |
| | Alquiler Apartamento         | |
| | €800/mes  [Confirmar Ingreso]| |
| +------------------------------+ |
| | Dividendos ETF               | |
| | €150/trim [Confirmar Ingreso]| |
| +------------------------------+ |
+----------------------------------+
```

### Codigo a modificar:

1. Agregar una nueva seccion despues de las categorias en `TabsContent value="overview"`:
   - Titulo: "Confirmar Ingresos"
   - Lista de fuentes con nombre, monto, y boton "Confirmar Ingreso"
   - Reutilizar la logica existente de confirmacion

2. Mantener la funcionalidad completa de edicion/eliminacion solo en la pestaña "Fuentes"

## Beneficios

- El usuario puede confirmar ingresos inmediatamente al entrar a `/cashflow`
- La pestaña "Fuentes" sigue siendo util para gestion completa (agregar/editar/eliminar)
- Mejor experiencia de usuario sin necesidad de navegar entre pestañas

