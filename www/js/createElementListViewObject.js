// const listType = {
//     VERTICAL: `vertical`,
//     HORISONTAL: `horisontal`,
//     TIMEMACHINE:`timemachine`
// }

// const elementTypes = {
//     QUIZZ : 'quizz',
//     FLASHCARD : 'flashcard',
//     AFSNIT :'afsnit'
// }


// let items = [`lidt her`,`lidt der`, 'lidt her', 'og lidt mere her']
// let deck = new Array()


const titles = [`Key word 1`, `Key word 2`, `Key word 3`, `Key word 4`, `Key word 5`, `Key word 6`, `Key word 7`, `Key word 8`, `Key word 9`, `Key word 10`, `Key word 11`, `Key word 12`, `Key word 13`];
const content = [`Content : Key word 1 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 2 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 3 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 4 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 5 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 6 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 7 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 8 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 9 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 10 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 11 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 12 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`, `Content : Key word 13 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok`];
const elementTypes = [`Section`, `Quizz`, `Flashcard`];
let deck = new Array();


// class Card {
// 	constructor(){
// 		this.Title = title
// 		this.Content = content
// 		this.ElementType = elementType
//		this.keyword
// 		this.SectionID = id
// 		this.Buttons = {if (this.ElementType == "flashCard") }
// 	}
// }

async function sendGetReqeustForSection(sectionID) {
  const data = await fetch(`/sections/${sectionID}`).then((response) => response)
  .then((result) => console.log(result));
  //renderElementList(array)
}


async function getDeck() {
  const deck = new Array();

  for (let i = 0; i < elementTypes.length; i++) {
    for (let x = 0; x < titles.length; x++) {
      const card = {
        Value: titles[x], Content: content[x], ElementType: elementTypes[i], SectionID: x,
      };
      deck.push(card);


      switch (card.ElementType) {
        case `Section`:
          card.Content = readText(card.SectionID);
          break;

        case `Quizz`:
          card.Value = `What is ${getKeywordsFrom(card.SectionID)}`;
          break;

        case `Flashcard`:
          card.Value = `Define ${getKeywordsFrom(card.SectionID)}`;
          break;

        default:  break;
      }
    }
  }

  return deck;
}

function shuffle() {
  // for 1000 turns
  // switch the values of two random titles
  for (let i = 0; i < 1000; i++) {
    const location1 = Math.floor((Math.random() * deck.length));
    const location2 = Math.floor((Math.random() * deck.length));
    const tmp = deck[location1];

    deck[location1] = deck[location2];
    deck[location2] = tmp;
  }

  renderElementList();
}


function readText(path) {
  return  `Section #${path}----- P2-vidensdeling

	Kommando til at starte programmet
	node main.js
	
	Kommando til at gennemgå alle test:
	node_modules\.bin\tape tests/**/test.*.js | node_modules\.bin\tap-spec
	
	Kommando til at arbejde testbaseret i realtime:
	nodemon tests/backend_eller_frontend/mappeMedDinTest/test.filNavn.js | .\node_modules\.bin\tap-simple
	
	eksporter dine funktioner/objekter i bunden af filen dine tests er knyttet til sådan her:
	
	module.exports = {
	  functionOne,
	  functionTwo,
	  objectOne,
	  objectTwo
	};
	
	For hver eksporteret funktion skal der være en unittest. Eksporteres en Class skal alle metoder unittestes.
	
	## Node moduler
	
	npm install express --save
	npm install mysql
	npm i tape
	npm i --save-dev tape-promise
	npm i tap-spec
	npm install eslint --save-dev
	npm install ejs`;
}

function getKeywordsFrom(SectionID) {
  return titles[SectionID];
}


function renderElementList(elementList) {
  document.getElementById(`deck`).innerHTML = ``;
  for (let i = 0; i < elementList.length; i++) {
    const card = document.createElement(`div`);
    const value = document.createElement(`div`);
    const elementType = document.createElement(`div`);
    const content = document.createElement(`div`);
    // switch (card.className) {
    //     case "Section": card.className =

    //         break;

    //     default:
    //         break;
    // }

    card.className = `card`;
    value.className = `value`;
    content.className = `content${elementList[i].ElementType}`;
    elementType.className = `elementType${elementList[i].ElementType}`;

    // card.classList.add("card")

    elementType.innerHTML = elementList[i].ElementType;
    value.innerHTML = elementList[i].Value;
    content.innerHTML = elementList[i].Content;

    card.appendChild(elementType);
    card.appendChild(value);
    card.appendChild(content);

    document.getElementById(`deck`).appendChild(card);
  }
}

async function load() {
  deck = await getDeck();
  // shuffle();
  renderElementList(deck);
}


window.onload = load;

const button = document.querySelector(`#section_id_77`);
button.addEventListener(`click`, () => {
  sendGetReqeustForSection(`77`);
});
