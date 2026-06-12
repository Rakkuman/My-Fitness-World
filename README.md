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

La app permite iniciar sesion o entrar como invitado. El invitado puede explorar la app, pero sus datos no se guardan al salir o recargar.

Cuando el usuario inicia sesion, los registros se guardan en el dispositivo usando `localStorage` y tambien se sincronizan con Firebase.

- Si registras datos en el PC, quedan en ese PC.
- Si registras datos en el celular, quedan en ese celular.
- Puedes usar `Exportar` e `Importar` para mover una copia entre dispositivos.
- Si entras con cuenta, tus datos se guardan en Firestore y se cargan al iniciar sesion.

## Configurar Firebase

1. En Firebase Console, abre el proyecto `my-fitness-world`.
2. En `Authentication > Sign-in method`, activa `Email/Password`.
3. En `Authentication > Settings > Authorized domains`, agrega el dominio de GitHub Pages:

```text
TU-USUARIO.github.io
```

4. En `Firestore Database`, crea una base de datos.
5. En `Rules`, pega estas reglas y publica:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Estas reglas hacen que cada cuenta solo pueda leer y escribir su propio perfil.
