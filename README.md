# P2-vidensdeling

Kommando til at starte programmet
node main.js

Kommando til at gennemgå alle test:
node_modules\.bin\tape tests/**/test.*.js | node_modules\.bin\tap-spec

Kommando til at arbejde testbaseret i realtime:
nodemon tests/backend_eller_frontend/mappeMedDinTest/test.filNavn.js | .\node_modules\.bin\tap-spec

eksporter dine funktioner/objekter i bunden af filen dine tests er knyttet til sådan her:

module.exports = {
  functionOne,
  functionTwo,
  objectOne,
  objectTwo
};

For hver eksporteret funktion skal der være en unittest. Eksporteres en Class skal alle metoder unittestes.

=======
## Node moduler
Kør`npm install` for at installerer alle dependencies.
