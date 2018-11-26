//API Characters

/*
fetch("https://www.anapioficeandfire.com/api/characters?page=1&pageSize=45")
.then(result => result.json())
.then((res) => {
res.forEach(e => createCharacterCard(e));
});
*/

/*
var characters = ['16', '27', '42', '148', '238', '271', '565', "'583', '957', '1029'];
characters.forEach((c) => /fetch('https://www.anapioficeandfire.com/api/characters/' + c ))


fetch('https://www.anapioficeandfire.com/api/characters/' + id) => createCharacterCard
*/

//Arya 148
//Greyjoy 12
//Daenerys 271
//Bronn 217

var characters = ['16', '27', '2024', '1880', '238', '867', '565', '583', '957', '954']

var characterInfoRetrieval = characters.map((c) => fetch('https://www.anapioficeandfire.com/api/characters/' + c )
	.then(result => result.json()))

Promise.all(characterInfoRetrieval).then(characters => {
	var selectedCharacters = [];
  characters.forEach(c => createCharacterCard(c, (c) => {
    selectedCharacters.push(c);
    if (selectedCharacters.length >= 2) {
    	startGame(selectedCharacters);
    }
  }
  ));
});



function createCharacterCard(resultItem, addSelected) {
  var wrapper = document.createElement('div')
  var character = document.getElementById('character');
  var name = document.createElement('h3');
  var gender = document.createElement('div');
  var culture = document.createElement('div');
  var born = document.createElement('div');
  var titles = document.createElement('div');
  var aliases = document.createElement('div');

  name.innerHTML = resultItem.name;
  gender.innerHTML = 'Gender: ' + resultItem.gender;
  culture.innerHTML = 'Culture: ' + resultItem.culture;
  born.innerHTML = 'Born: ' + resultItem.born;
  titles.innerHTML = 'Titles: ' + resultItem.titles;
  aliases.innerHTML = 'Aliases: ' + resultItem.aliases;

  wrapper.className = 'characterCard';
  wrapper.appendChild(name);
  wrapper.appendChild(gender);
  wrapper.appendChild(culture);
  wrapper.appendChild(born);
  wrapper.appendChild(titles);
  wrapper.appendChild(aliases);

  wrapper.addEventListener("click", (e) => addSelected(resultItem))

  document.getElementById("character").appendChild(wrapper);
}


var state = {
	spiller1: {},
  spiller2: {},
  hvemSinTur: 1,
  spiller1Posisjon: 1,
  spiller2Posisjon: 1,
  feller: [false, false, false, false, true, false, false, false, false, true]
}


/*
characters.innerHTML += "<span>Name: " + resultItem.name + " </span>";
characters.innerHTML += "Gender:   " + resultItem.gender + " </span>";
characters.innerHTML += "Culture: " + resultItem.culture + " </span>";
characters.innerHTML += "Born: " + resultItem.born + " </span>";
characters.innerHTML += "Died: " + resultItem.died + " </span>";
characters.innerHTML += "Titles: " + resultItem.titles + " </span>";
characters.innerHTML += "Aliases: " + resultItem.aliases + " </span>";
*/



/*
var characters = document.getElementById("characters")
var outputDiv = document.createElement("div");
var name = document.createElement("h3");
var gender = document.createElement("div");
var culture = document.createElement("div");
var born = document.createElement("div");
var died = document.createElement("div");
var titles = document.createElement("div");
var aliases = document.createElement("div");

name.innerHTML = resultItem.name;
gender.innerHTML = resultItem.gender;
culture.innerHTML = resultItem.culture;
born.innerHTML = resultItem.born;
died.innerHTML = resultItem.died;
titles.innerHTML = resultItem.titles;
aliases.innerHTML = resultItem.aliases;

outputDiv.className = "characterCard";
outputDiv.appendChild(name);
outputDiv.appendChild(gender);
outputDiv.appendChild(culture);
outputDiv.appendChild(born);
outputDiv.appendChild(died);
outputDiv.appendChild(titles);
outputDiv.appendChild(aliases);
}

/* Dice Roller */

var dice = {
  sides: 6,
  roll: function () {
    var randomNumber = Math.floor(Math.random()* this.sides) + 1;
    return randomNumber;
  }
}

function showNumber(number) {
  var diceRoller = document.getElementById('diceRoller');
  diceRoller.innerHTML = number;
}

function rollDice() {
  var result = dice.roll();
  showNumber(result);
};
