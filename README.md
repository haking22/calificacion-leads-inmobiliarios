# Calificación de leads inmobiliarios

App web para Plusval Inmobiliaria, basada en la skill `calificacion-leads-inmobiliarios`. Corre 100% en el navegador (sin backend); los datos se guardan en `localStorage`.

## Funcionalidad

- **Calificar leads**: formulario con los 9 parámetros de intención de compra (escala 0–10, con notas de evidencia y marca de "sin datos"), cálculo automático del score total, clasificación Frío/Tibio/Caliente, y regla de anulación por retiro explícito del lead (Frío/Perdido).
- **Mensajes de apertura**: genera 3 variantes de mensaje de WhatsApp (Directo, Cálido/personalizado, Urgencia/escasez) para leads de Facebook Ads, con tono configurable y placeholders para datos faltantes.
- **Plan de seguimiento**: genera un plan de 32 toques espaciados ~11 días a lo largo de 12 meses, con título y nota editables por toque, y checklist de hecho/pendiente.
- **Exportar a Excel**: descarga un `.xlsx` con todos los leads calificados y sus 9 parámetros.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
