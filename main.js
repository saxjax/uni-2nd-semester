const { MasterController } = require(`./node/MasterController.js`);

const settings = {
  name: `Server`,   // Angiver funktionaliteten af disse settings. Har ingen funktionsmæssig betydning.
  root: __dirname,  // Medsender root directoriet så MasterController altid henviser til main.js root
  port: 3000,       // Angiver porten som programmet skal kører på.
  debug: true,      // Angiver om programmet skal køre i udviklingsmode eller i productionmode.
  skipAccess: true, // Angiver om programmet automatisk skal logges ind som Test User i Tester Group
};
const Start = new MasterController(settings);

Start.startServer();
/*
<% data.keywords.forEach((keyword) => { %>
    <a href="/view/evaluations/<%= evaluation.idEvaluation %>">
      <strong><%= evaluation.title %></strong>
    </a>
    <p><strong>Nøgleord: </strong> PT. ikke implementeret</p>
  <% }); %>
  <button class="btn btn-info">
    <a href="/post/evaluation/<%= data.document[0].idDocument %>">
        Opret Evaluering til Afsnit i <%= data.document[0].title %>
    </a>
  </button>
  */
