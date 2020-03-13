For at gå igennem alle test, brug denne kommando fra root directory:
node_modules\.bin\tape tests/**/*.js | node_modules\.bin\tap-spec

For at arbejde testbaseret, lav din unittest og arbejd mens scriptet herunder kører:
nodemon tests/backend_eller_frontend/mappeMedDinTest/test.filNavn.js | .\node_modules\.bin\tap-simple

eksporter sådan her:

module.exports = {
  addTwo,
  addThree,
};

Installer test værktøjer sådan her:
npm i tape-spec -D
npm i nodemon -g