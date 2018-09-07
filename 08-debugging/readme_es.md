# Depurando NextJS con Visual Studio Code

En este ejemplo, vamos a cubrir los pasos básicos para poder depurar nuestra aplicación usando NextJS y VSCode

# Depuración del lado del servidor

- Vamos a comenzar este tutorial partiendo del ejemplo 07 (abriremos una nueva instancia de VSCode sobre una copia del mismo). Antes que nada, descargamos las dependencias necesarias
```bash
npm install
```

- No nos va a hacer falta añadir ninguna línea de código para este ejemplo, sino que vamos a trabajar sobre los archivos de configuración de VSCode. Pinchamos sobre el icono de depuración que aparece al lado izquierdo de la ventana de VSCode para abrir el menú de depuración (o, alternativamente, usamos el atajo de teclado  ```Ctrl``` + ```Shift``` + ```D```). Podremos ver un menú desplegable sobre la columna izquierda de nuestra ventana de VSCode que indica ```No configuration```, justo a la derecha del botón verde de _play_. Haciendo click sobre este menú, veremos que no hay configuraciones de depuración disponibles (en principio), por lo que pinchamos en ```Add configuration...```. Esto abrirá un nuevo menú en la parte superior de nuestra instancia de VSCode. De principio, la única opción que debería aparecer en este nuevo menú sería la correspondiente a ```Node.js``` que viene por defecto con VSCode. Si la seleccionamos, se creará un fichero ```launch.json``` dentro de la carpeta ```.vscode``` en la carpeta que tengamos abierta. Los contenidos de este fichero deberían ser los siguientes:
```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}\\index.js"
    }
  ]
}
```

- Vamos a modificar los contenidos de este fichero para que el depurador de VSCode pueda engancharse a la parte de nuestro código de front-end que se renderiza en nuestro servidor.
```diff
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
-      "request": "launch",
-      "name": "Launch Program",
-      "program": "${workspaceFolder}\\index.js"
+      "request": "attach",
+      "name": "NextJS - Node",
+      "port": 9229,
    }
  ]
}
```

- El puerto que especifiquemos tiene que coincider con el que se utiliza para depurar aplicaciones de NodeJS, que por defecto es el 9229. En cualquier caso, necesitamos lanzar nuestra aplicación de tal modo que dicho puerto esté disponible para poder depurar el código. A efectos de este tutorial, vamos a crear un nuevo script NPM para gestionar esto. Abrimos nuestro ```package.json``` y añadimos la siguiente línea:
```diff
 "scripts": {
    "dev": "node server.js",
+   "debug": "node server.js --inspect",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- Si, por algún motivo, no pudieramos utilizar el puerto 9229, se puede definir un puerto alternativo sobre el flag inspect (```--inspect=12345```). Si arrancamos ahora nuestra aplicación usando el nuevo script (```npm run debug```), deberíamos poder ver en el terminal de la consola un mensaje que confirma que el websocket de depuración está disponible. De hecho, para asegurarnos de que esto es así, podemos ir a ```localhost:9229/json/version``` en nuestro navegador, y deberíamos de poder ver que se carga un JSON indicando detalles sobre la version de NodeJS que estamos utilizando.

- Dado que el puerto 9229 está ahora abierto para el depurar, podemos lanzar la configuración de depuración que habíamos definido previamente para acoplar nuestro depurador de VSCode a nuestro proceso NodeJS. Para ello, volvemos al menú de depuración y, sobre el menú desplegable, deberíamos poder ver el nombre de la configuración que habíamos definido (```NextJS - Node```). Si hacemos click en el botón de _play_, deberíamos ver cómo el depurador de VSCode se acopla con éxito a nuestros proceso Node.

- Ahora vamos a añadir un punto de ruptura en el código, por ejemplo, en la línea 12 de _pages/index.ts_. Normalmente, el punto de ruptura aparecería en rojo, pero lo más probable es que aparezca como una circunferencia grisácea. Si abrimos nuestra aplicación en el navegador ```localhost:3000```, lo que esperaríamos que pasase sería que se detuviera la ejecución en el punto de ruptura que hemos habilitado. Sin embargo, lo más probable es que no ocurra así. Esto se debe a un problema en la forma en que VSCode detecta nuestros _sourcemaps_ (para más detalles, [consultar este enlace](https://github.com/Microsoft/vscode-recipes/issues/103)). Para solucionarlo, necesitamos modificar nuestro fichero ```launch.json``` ligeramente.
```diff
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "NextJS - Node",
      "port": 9229,
+     "sourceMapPathOverrides": {
+       "webpack:///*": "${workspaceRoot}/*",
+     }
    }
  ]
}
```

- Con este cambio, si volvemos a lanzar nuestra tarea de depuración, ahora sí deberían verse los breakpoints del color rojo habitual y, efectivamente, si refrescamos la página principal que contiene la lista de usuarios, la ejecución se detendrá en la línea 12, conforme a lo esperado.

- También destacar la peculiaridad de que si añadimos un _breakpoint_ en la línea 11 de _pages/user-info.tsx_, este punto de ruptura no se alcanzará como tal cuando naveguemos a la vista de detalles de usuario desde la tabla. No obstante, si refrescamos el navegador desde la vista de detalles de usuario, el punto de ruptura sí que detendrá la ejecución como sería de esperar.


# Lanzar una instancia de depuración de Chrome desde VSCode.
- Llegados a este punto somos capaces de acoplar el depurador de VSCode a la parte de nuestra aplicación NextJS que se renderiza en el lado del servidor. Sin embargo, si quisiéramos depurar las partes de la aplicación que se renderizan en el lado del cliente, necesitaríamos en principio utilizar el depurador del navegador. En este apartado, vamos a añadir una nueva configuración de depuración para lanzar una instancia del navegador de Chrome que ya esté conectado al depurador de VSCode. Para ello, antes que nada necesitamos instalar el plugin (```Debugger for Chrome```) correspondiente en nuestro entorno de VSCode.

- Una vez hayamos instalado la extensión para el depurador de Chrome, procederemos a crear la configuración de depuración correspondiente. Vamos a modificar el fichero ```launch.json``` con las líneas siguientes:
```diff
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "NextJS - Node",
      "port": 9229,
      "sourceMapPathOverrides": {
        "webpack:///*": "${workspaceRoot}/*",
      }
-   }
+   },
+   {
+     "type": "chrome",
+     "request": "launch",
+     "name": "NextJS - Chrome",
+     "url": "http://localhost:3000",
+     "webRoot": "${workspaceFolder}",
+     "sourceMapPathOverrides": {
+       "webpack:///*": "${webRoot}/*",
+     },
+   },
  ]
```

- Si lanzamos ahora nuestra nueva configuración ```NextJS - Chrome``` desde el menú desplegable, veremos como se abre una nueva instancia del navegador Chrome, abriendo la url que hemos especificado en nuestro fichero ````launch.json```. Si habíamos mantenido activos los puntos de rupturas del apartado anterior, veremos que la ejecución se detendrá en este caso sin necesidad de refrescar el navegador, es decir, si navegamos desde la página principal a las páginas de detalle de cada usuario, la aplicación se detendrá como corresponde en los puntos de ruptura definidos. Esto es así porque ahora nuestro depurador está trabajando desde el lado del cliente, por lo que funciona de forma similar al consabido depurador del navegador, en lugar de responder únicamente a las cargas iniciales de la aplicación.


# Depurando en cliente y servidor a la vez
- Por último, vamos a finalizar el tutorial con una nueva configuración de depuración que se va a encargar de aunar las dos configuraciones previamente definidas. Esto lo podemos conseguir definiendo un array en la propiedad ```compounds``` del fichero ```launch.json```, tal cual se detalla a continuación:
```diff
  "configurations": [
    ...
  ],
+ "compounds": [
+   {
+     "name": "NextJS - Full",
+     "configurations": ["NextJS - Node", "NextJS - Chrome"],
+   }
+ ],
```

- Esto creará una nueva configuración con el nombre ```NextJS - Full```, que, si la lanzamos, lanzará al unísono las dos configuraciones que habíamos definido en los apartados anteriores.
