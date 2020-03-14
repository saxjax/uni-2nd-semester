Kommando til at gennemgå alle test:
node_modules\.bin\tape tests/**/*.js | node_modules\.bin\tap-spec

Kommando til at arbejde testbaseret i realtime:
nodemon tests/backend_eller_frontend/mappeMedDinTest/test.filNavn.js | .\node_modules\.bin\tap-simple

SÅDAN LAVES EN TEST
Lav en mappe der har dit filnavn i tests/backend eller tests/frontend.
I mappen, lav en fil pr. navngivet funktion.
Den første unittest i hver fil er den der tester for hvad funktionen skal returnere efter hensigten (kravsspecifikationen).
De resterende unittest er til for at teste fejlkilder (forkert input, forkert udregning, andre funktionaliteter i funktionen)
Hvordan de laves er der templates for i tests/templates.mjs
En test tester kravsspecifikationen til funktionen, altså "hvad bør denne funktion gøre?"

eksporter dine funktioner/objekter i bunden af ikke-test filen sådan her:

module.exports = {
  functionOne,
  functionTwo,
  objectOne,
  objectTwo
};
