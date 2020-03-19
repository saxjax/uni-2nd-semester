# P2-vidensdeling

# Start:
node main.js

# Alle test:
node_modules\.bin\tape tests/**/test.*.js | node_modules\.bin\tap-spec

# Backend test:
node_modules\.bin\tape tests/backend/**/test.*.js | node_modules\.bin\tap-spec

# Frontend dokument test:
node_modules\.bin\tape tests/frontend/test.*.js | node_modules\.bin\tap-spec

# Frontend meta test:
node_modules\.bin\tape tests/frontend/meta/test.*.js | node_modules\.bin\tap-spec

# Realtime test:
nodemon tests/backend_eller_frontend/mappeMedDinTest/test.filNavn.js | .\node_modules\.bin\tap-spec

# Korrekt Eksport:
module.exports = {
  functionOne,
  functionTwo,
  objectOne,
  objectTwo
};

Alle exports skal unittestes.
Alle metoder i Classes skal unittestes.
Avancerede funktioner kan med fordel unittestes.

## Node moduler
```
npm install express --save
npm install mysql
npm i tape
npm i --save-dev tape-promise
npm i tap-spec
npm install eslint --save-dev
npm i jsdom
npm i fs
call npm i ejs
```
