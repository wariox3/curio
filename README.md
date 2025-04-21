# POS+ App

[![Angular Version](https://img.shields.io/badge/Angular-17-%23DD0031?logo=angular)](https://angular.io/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

POS+ es una solución de punto de venta moderna desarrollada con Angular 17, diseñada para optimizar las operaciones comerciales de pequeños y medianos negocios. Combina la potencia de un sistema tradicional de caja registradora con herramientas digitales avanzadas para la gestión comercial.

## Requisitos previos

- Node.js v18+
- npm v9+
- Angular CLI v17+

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone git@github.com:wariox3/renio.git
   cd renio
   ```
2. Instalar las dependencias
   ```
   npm install --legacy-peer-deps
   ```

## Variables de entorno
Se debe configurar el archivo `environment.ts` dentro de la carpeta `/environments`
   ```
   export const environment = {
      production: false,
      url_api: 'http://reddocapi.online',
      url_api_subdominio: 'http://subdominio.reddocapi.online',
      dominioApp: '.reddoc.online',
      dominioHttp: 'http',
      appVersion: 'v0.0.1',
      appDocumentacion: 'https://documentacion.reddoc.co/apps/documentacion/',
      sessionLifeTime: 24,
      turnstileSiteKey: '',
   };

   ```

## Ejecución
Servidor de desarrollo:

   ```bash
    ng serve
   ```

Abre http://localhost:4200 en tu navegador.

Build para producción:

   ```bash
    ng build
   ```

Los archivos compilados se guardarán en la carpeta `dist/`.

