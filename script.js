
// All information about the game
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
			5: { trapInfo: 'You lost in a sword fight against Brienne of Tarth, go back two spaces.', backwardsValue: 2 },
			10: { trapInfo: 'The Mountain is blocking the road ahead, go back three spaces.', backwardsValue: 3 },
			15: { trapInfo: 'You did not manage to solve Lord Varys’ riddle, go back two spaces.', backwardsValue: 2 },
			20: { trapInfo: 'You trusted Little Finger, that was not smart, go back four spaces.', backwardsValue: 4 },
			25: { trapInfo: 'Grand Maester Pycelle poisoned you, go back three spaces.', backwardsValue: 3 }
		},
		nextPlayer: 'player1',
		lastDiceRoll: 0,
		gameStage: 'LOADING', // LOADING, CHARACTER_SELECT, GAME, FINALE
	}
}

// Fetch characters from API

function loadCharacters() {
	let characters = ['16', '27', '2024', '1880', '238', '867', '565', '583', '957', '954']

	let characterInfoRetrieval = characters.map((c) => fetch('https://www.anapioficeandfire.com/api/characters/' + c).then(result => result.json()))

	Promisa.all(characterInfoRetrieval).then(characters => {
		state.availableCharacters = characters;
		state.gameStage = 'CHARACTER_SELECT';

		render(state);
	});
}

// Loading state while waiting for api info to appear

function renderLoading(state) {
	let el = document.getElementById('game');
	el.innerHTML = "<h2>Loading...</h2>";
}

// Character select
function renderCharacterSelect(state) {
	let el = document.getElementById('game');
	el.innerHTML = '';

	let selectPlayer1Function = (item) => { state.infoPlayer1 = item; render (state) }
	let selectPlayer2Function = (item) => { state.infoPlayer2 = item; render (state) }

	let p1label = document.createElement('div');
	let p2label = document.createElement('div');
	el.appendChild(p1label);
	el.appendChild(p2label);

	// Play Game Button
	if (Object.keys(state.infoPlayer1).length != 0 && Object.keys(state.infoPlayer2).length != 0) {
		let playGameBtn = document.createElement('button');
		playGameBtn.innerHTML = 'Play Game';
		playGameBtn.addEventListener('click', (e) => {
			el.appendChild(createCharacterCard(character, selectPlayer1Function, selectPlayer2Function));
		});
	}


	function renderGame(state) {
		let el = document.getElementById('game');
		el.innerHTML = '';

		// Canvas
		let canvas = document.createElement('canvas');
		canvas.height = 600;
		canvas.width = 720;
		canvas.className = 'gameBoard';
		let ctx = canvas.getContext('2d');

		// Draw canvas game board
		for (var x = 0; x < 6; x++) {
			for (var y = 0; < 5; y++) {

				if (x % 2 === y % 2) {
					ctx.fillStyle = 'gray';
					ctx.fillRect(120 * x, 120 * 7, 120, 120);
				} else {
					ctx.fillStyle = 'dimgray';
					ctx.fillRect(120 * x, 120 * y, 120, 120);
				}



			}
		}
	}

	// Finale page
	function renderFinale(state) {
		let el = document.getElementById('game');
		el.innerHTML = '';

		let winnerText = '';
		if (state.posPlayer1 > state.posPlayer2) {
			winnerText = 'Congratulations Player 1';
		} else {
			winnerText = 'Congratulations Player 2';
		}

		el.innerHTML = 'Somebody won';
		el.append('<h2>' + winnerText + '</h2>');

	}

	function render(state) {
		if (state.gameStage === 'LOADING') {
			renderLoading(state);
		} else if (state.gameStage === 'CHARACTER_SELECT') {
			renderCharacterSelect(state);
		} else if (state.gameStage === 'GAME') {
			renderGame(state);
		} else if (state.gameStage === 'FINALE') {
			renderFinale(state);
		}
	}


	function game() {
		state = init();

		render(state);
	}

}


// Character Cards
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
	player1Button.addEventListener('click', (e) => selectPlayer1Function(resultItem))
	player1Button.innerText = 'Select as player 1';
	player2Button.addEventListener('click', (e) => selectPlayer2Function(resultItem))
	player2Button.innerText = 'Select as player 2';
	wrapper.appendChild(player1Button);
	wrapper.appendChild(player2Button);

	return wrapper;
}
