
/* All information about the game */
function init() {
	loadCharacters();

	return {
		availableCharacters: [],
		maxPosition: 30,
		posPlayer1: 1,
		posPlayer2: 1,
		infoPlayer1: {},
		infoPlayer2: {},
		traps: {
			5: { trapInfo: "You lost in a sword fight against Brienne of Tarth, go back two spaces.", backwardsValue: 2 },
			10: { trapInfo: "The Mountain is blocking the road ahead, go back three spaces.", backwardsValue: 3 },
			15: { trapInfo: "You did not manage to solve Lord Varys’ riddle, go back two spaces.", backwardsValue: 2 },
			20: { trapInfo: "You trusted Little Finger, that was not smart, go back four spaces.", backwardsValue: 4 },
			25: { trapInfo: "Grand Maester Pycelle poisoned you, go back three spaces.", backwardsValue: 3 }
		},
		nextPlayer: "player1",
		lastDiceRoll: 0,
		gameStage: "LOADING", // LOADING, CHARACTER_SELECT, GAME, FINALE
	}
}

/* Fetch characters from API */

function loadCharacters() {
	let characters = ['16', '27', '2024', '1880', '238', '867', '565', '583', '957', '954']

	let characterInfoRetrieval = characters.map((c) => fetch('https://www.anapioficeandfire.com/api/characters/' + c).then(result => result.json()))

	Promisa.all(characterInfoRetrieval).then(characters => {
		state.availableCharacters = characters;
		state.gameStage = "CHARACTER_SELECT";

		render(state);
	});
}

/* Character Cards */
function createCharacterCard(resultItem, selectPlayer1Function, selectPlayer2Function) {
    var wrapper = document.createElement('div')
    var character = document.getElementById('character');
    var name = document.createElement('h3');
    var gender = document.createElement('div');
    var culture = document.createElement('div');
    var born = document.createElement('div');
    var died = document.createElement('div');
    var titles = document.createElement('div');
    var aliases = document.createElement('div');

    name.innerHTML = resultItem.name;
    gender.innerHTML = 'Gender: ' + resultItem.gender;
    culture.innerHTML = 'Culture: ' + resultItem.culture;
    born.innerHTML = 'Born: ' + resultItem.born;
    died.innerHTML = 'Died: ' + resultItem.died;
    titles.innerHTML = 'Titles: ' + resultItem.titles;
    aliases.innerHTML = 'Aliases: ' + resultItem.aliases;

    wrapper.className = 'characterCard';
    wrapper.appendChild(name);
    wrapper.appendChild(gender);
    wrapper.appendChild(culture);
    wrapper.appendChild(born);
    wrapper.appendChild(died);
    wrapper.appendChild(titles);
    wrapper.appendChild(aliases);

    var player1Button = document.createElement('button')
    var player2Button = document.createElement('button')
    player1Button.addEventListener("click", (e) => selectPlayer1Function(resultItem))
    player1Button.innerText = "Select as player 1";
    player2Button.addEventListener("click", (e) => selectPlayer2Function(resultItem))
    player2Button.innerText = "Select as player 2";
    wrapper.appendChild(player1Button);
    wrapper.appendChild(player2Button);

    return wrapper;
  }
