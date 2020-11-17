# P2-vidensdeling
Dette er et semesterprojekt lavet af 7 studerende fra Aalborg Universitet på deres 2. semester.

En demo af programmet kan findes her: https://grouphub.skaalum.tech/

## Start server:
node main.js

## Test
### Alle test:
node_modules\.bin\tape tests/**/test.*.js | node_modules\.bin\tap-spec
### mac version
./node_modules/.bin/tape tests/**/test.*.js | ./node_modules/.bin/tap-spec

### Backend test:
node_modules\.bin\tape tests/backend/**/test.*.js | node_modules\.bin\tap-spec

### Frontend dokument test:
node_modules\.bin\tape tests/frontend/test.*.js | node_modules\.bin\tap-spec

### Frontend meta test:
node_modules\.bin\tape tests/frontend/meta/test.*.js | node_modules\.bin\tap-spec

### Realtime test:
nodemon tests/backend_eller_frontend/mappeMedDinTest/test.filNavn.js | .\node_modules\.bin\tap-spec

## Korrekt Eksport:
module.exports = {
  functionOne,
  functionTwo,
  objectOne,
  objectTwo
};

## Node moduler
Kør`npm install` for at installerer alle dependencies.

