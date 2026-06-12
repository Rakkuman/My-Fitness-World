# Registro Fit

App web progresiva para registrar entrenamientos, medidas corporales e historial del plan de 5 dias.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `registro-fit`.
2. Sube todos los archivos de esta carpeta al repositorio.
3. En GitHub entra a `Settings > Pages`.
4. En `Build and deployment`, elige `GitHub Actions`.
5. GitHub publicara la app automaticamente con el workflow incluido.

La URL quedara con este formato:

```text
https://TU-USUARIO.github.io/registro-fit/
```

## Instalar en celular o PC

Cuando abras la URL publicada:

- En Android/Chrome: menu del navegador > `Agregar a pantalla principal` o `Instalar app`.
- En PC/Chrome/Edge: icono de instalar en la barra de direcciones.
- En iPhone/Safari: compartir > `Agregar a pantalla de inicio`.

## Importante sobre los datos

La app guarda los registros en el dispositivo usando `localStorage`. Eso significa:

- Si registras datos en el PC, quedan en ese PC.
- Si registras datos en el celular, quedan en ese celular.
- Puedes usar `Exportar` e `Importar` para mover una copia entre dispositivos.

Para sincronizacion automatica entre PC y celular hace falta agregar una base de datos con login, por ejemplo Firebase o Supabase.
