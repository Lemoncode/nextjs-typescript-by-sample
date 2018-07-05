# Hello nextjs

Empecemos con lo más simple, vamos a crear un ejemplo muy sencillo de 'Hello World' utilizando next.

En este ejemplo utilizaremos javaScript como lenguaje base, en los siguientes ejemplo cambiaremos a typescript.

Este ejemplo es bastante parecido al que indican en el tutorial de nextjs:
https://nextjs.org/learn/basics/getting-started/setup

# Pasos

- Vamos a crear nuestro projecto (asegurate de que tu carpeta contenedora no incluye espacios o mayusculas) 

```bash
npm init -y
```

- Comenzamos instalando algunos paquetes básicos:

```bash
npm install react react-dom next --save
```

- Abrimos _package.json_ y le añadimos el siguiente comando npm: 

_package.json_

```diff
"scripts": {
+ "dev": "next",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

- Creamos nuestra primera página (por convención debe incluirse bajo el subdirectorio de _pages_) 

_./pages/index.js_

```javascript
const Index = () => (
  <div>
    <p>Hello Next.js</p>
  </div>
);

export default Index;
```

- Ejecutamos el ejemplo:

```bash
npm run dev
```

- Ahora podemos abrir un navegador y apuntar a: http://localhost:3000 y ver los resultados. 
