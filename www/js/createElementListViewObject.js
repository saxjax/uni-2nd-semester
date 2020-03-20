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


var titles = ["Key word 1", "Key word 2", "Key word 3", "Key word 4", "Key word 5", "Key word 6", "Key word 7", "Key word 8", "Key word 9", "Key word 10", "Key word J", "Key word Q", "Key word K"];
var content = ["Content : Key word 1 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 2 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 3 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 4 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 5 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 6 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 7 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 8 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 9 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 10 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 11 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 12 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok", "Content : Key word 13 Ave verum corpus,est in ad hoc triagtig fyldingen snustrok"];
var elementTypes = ["Section", "Quizz", "Flashcard"];
var deck = new Array();

function getDeck()
{
	var deck = new Array();

	for(var i = 0; i < elementTypes.length; i++)
	{
		for(var x = 0; x < titles.length; x++)
		{
			var card = {Value: titles[x], Content: content[x], ElementType: elementTypes[i]};
			deck.push(card);
		}
	}

	return deck;
}

function shuffle()
{
	// for 1000 turns
	// switch the values of two random titles
	for (var i = 0; i < 1000; i++)
	{
		var location1 = Math.floor((Math.random() * deck.length));
		var location2 = Math.floor((Math.random() * deck.length));
		var tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}

	renderDeck();
}

function renderDeck()
{
	document.getElementById('deck').innerHTML = '';
	for(var i = 0; i < deck.length; i++)
	{
		var card = document.createElement("div");
		var value = document.createElement("div");
        var elementType = document.createElement("div");
        let content = document.createElement("div");
        // switch (card.className) {
        //     case "Section": card.className =
                
        //         break;
        
        //     default:
        //         break;
        // }
		card.className = "card";
        value.className = "value";
        content.className = "content"+ deck[i].ElementType;
        elementType.className = "elementType" + deck[i].ElementType;
        
        elementType.innerHTML = deck[i].ElementType
        value.innerHTML = deck[i].Value;
        content.innerHTML = deck[i].Content
        
        card.appendChild(elementType);
        card.appendChild(value);
        card.appendChild(content);
        
		document.getElementById("deck").appendChild(card);
	}
}

function load()
{
	deck = getDeck();
	// shuffle();
	renderDeck();
}

window.onload = load;
