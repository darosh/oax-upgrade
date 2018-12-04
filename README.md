# OAX &mdash; OpenAPI Specification Explorer [![demo: online](https://img.shields.io/badge/demo-online-brightgreen.svg?style=flat-square)](https://darosh.github.io/oax/)

## Resources

* Online [demo](https://darosh.github.io/oax/)
* Automated [screenshots](./doc/screenshots/README.md)
* [Research](./doc/RESEARCH.md) notes

## Status

Feature|Status|Note
:---|:---|:---
OpenApi directory browser|![100%](https://placehold.it/12/44cc11?text=+) 100%| 500+ API specifications powered by [APIs.guru](https://apis.guru/openapi-directory/)
SDK code generator|![100%](https://placehold.it/12/44cc11?text=+) 100%| powered by [swagger-codegen](https://github.com/swagger-api/swagger-codegen) via [generator.swagger.io](https://generator.swagger.io/) 
Markdown & syntax highlight|![100%](https://placehold.it/12/44cc11?text=+) 100%| using [showdown](https://github.com/showdownjs/showdown) & [highlight.js](https://highlightjs.org/) with 40 language highlighters 
Using web worker|![100%](https://placehold.it/12/44cc11?text=+) 100%| for non-blocked user interface
Light & dark theme|![100%](https://placehold.it/12/44cc11?text=+) 100%| thanks to [Vuetify](https://vuetifyjs.com/)
Built-in HTTP reference|![100%](https://placehold.it/12/44cc11?text=+) 100%| by [know-your-http-well](https://github.com/for-GET/know-your-http-well) 
Responsive & mobile|![100%](https://placehold.it/12/44cc11?text=+) 100%|  
Offline & progressive|![80%](https://placehold.it/12/44cc11?text=+) 80%| 
Keyboard shortcuts & navigation|![80%](https://placehold.it/12/44cc11?text=+) 80%|
View & layout options|![80%](https://placehold.it/12/44cc11?text=+) 80%| 
Schema & examples|![75%](https://placehold.it/12/dfb317?text=+) 75%| 
Try out API|![50%](https://placehold.it/12/dfb317?text=+) 50%| 
CORS proxy|![50%](https://placehold.it/12/dfb317?text=+) 50%| 
Edit specification|![50%](https://placehold.it/12/dfb317?text=+) 50%| using [CodeMirror](http://codemirror.net/) editor and web worker<br><br>TODO:<br>hinting<br>scroll to operation<br>markdown<br>YAML
Search|![10%](https://placehold.it/12/dfb317?text=+) 10%| 
Security definitions|![25%](https://placehold.it/12/e05d44?text=+) 25%| 
Customization & configuration|![10%](https://placehold.it/12/e05d44?text=+) 10%| 
SEO & SSR|![0%](https://placehold.it/12/e05d44?text=+) 0%| 
Local storage for user settings|![0%](https://placehold.it/12/e05d44?text=+) 0%| 
Cross-browser compatibility|![0%](https://placehold.it/12/e05d44?text=+) 0%| not tested yet (Chrome browser should work) 
Print style & PDF export|![0%](https://placehold.it/12/e05d44?text=+) 0%|
OpenAPI version 3.0|![0%](https://placehold.it/12/e05d44?text=+) 0%|

## Build Setup

### Install

``` bash
npm install # or yarn (yarn required for NUXT build)
```

### Webpack

``` bash
npm run webpack:dev # serve with hot reload at localhost:8080

npm run webpack:build # build for production with minification 

npm run webpack:report # build for production and view the bundle analyzer report
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your end-to-end tests
```
yarn run test:e2e
```

### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
