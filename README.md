# Partido Amarillo | Elecciones 2026

Dashboard electoral academico para analizar resultados electorales, comportamiento territorial y red de voluntariado en Antioquia, el Area Metropolitana del Valle de Aburra y Medellin.

El proyecto fue preparado como trabajo final de un programa de analisis de datos. La aplicacion presenta una narrativa ejecutiva para un cliente politico ficticio, con visualizaciones interactivas, mapas y datos agregados.

## Modulos principales

- **Diagnostico territorial:** mapas y graficos para explorar resultados electorales por Antioquia, AMVA y Medellin.
- **Perfil de votantes:** lectura de afinidad, volumen y oportunidades territoriales.
- **Red de voluntariado:** resumen agregado por municipio, subregion y caracteristicas generales, sin exponer datos personales.

## Stack

- React 19
- TypeScript
- Vite
- Firebase Hosting
- Firebase Auth
- Firestore
- Leaflet / React Leaflet
- Chart.js / React Chart.js 2
- Tailwind CSS

## Requisitos

- Node.js instalado
- npm instalado
- Firebase CLI instalado si se va a publicar:

```powershell
npm install -g firebase-tools
```

## Instalacion local

```powershell
git clone https://github.com/Grajales-Camilo/electoral.git
cd electoral
npm install
npm run dev
```

Vite mostrara una URL local similar a:

```text
http://localhost:5173/
```

## Compilar para produccion

```powershell
npm run build
```

La salida de produccion queda en:

```text
dist/
```

## Publicar en Firebase

El proyecto esta configurado para desplegar Firebase Hosting desde `dist`.

```powershell
npm run build
firebase deploy --only hosting
```

Sitio publicado:

[https://ivc-26.web.app](https://ivc-26.web.app)

## Privacidad y datos

La seccion de voluntariado esta disenada para mostrar informacion agregada. No debe exponer nombres, telefonos, correos, enlaces de contacto ni observaciones sensibles de personas.

Los datos electorales se presentan con fines academicos y de demostracion analitica.

## Estructura general

```text
src/
  components/        Componentes de UI, mapas y dashboards
  hooks/             Hooks responsivos y de optimizacion
  styles/            Sistema visual y estilos auxiliares
  firebaseConfig.js  Configuracion de Firebase
public/
  images/            Imagenes y recursos publicos
dist/                Build de produccion generado por Vite
```

## Scripts disponibles

```powershell
npm run dev      # servidor local de desarrollo
npm run build    # build de produccion
npm run preview  # previsualizar build local
```

## Notas de mantenimiento

- Mantener los datos personales fuera de la interfaz publica.
- Ejecutar `npm run build` antes de publicar.
- Revisar que los mapas carguen correctamente despues de cambios en datos territoriales.
- Evitar subir archivos temporales, reportes locales o documentos de trabajo al repositorio.
