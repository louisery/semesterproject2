
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

	Promise.all(characterInfoRetrieval).then(characters => {
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
	let startGameFunction = () => { state.gameStage = 'GAME'; render(state); }

	let p1label = document.createElement('div');
	let p2label = document.createElement('div');

	p1label.innerHTML = "Player 1: " + state.infoPlayer1.name;
	p2label.innerHTML = "Player 2: " + state.infoPlayer2.name;
	el.appendChild(p1label);
	el.appendChild(p2label);

	// Play Game Button
	if (Object.keys(state.infoPlayer1).length != 0 && Object.keys(state.infoPlayer2).length != 0) {
		let playGameBtn = document.createElement('button');
		playGameBtn.innerHTML = 'Play Game';
		playGameBtn.addEventListener('click', (e) => startGameFunction());
		el.appendChild(playGameBtn);
	}

	state.availableCharacters.forEach(character => {
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
		for (var y = 0; y < 5; y++) {
			// Every other square is gray/dimgray
			if (x % 2 === y % 2) {
				ctx.fillStyle = 'gray';
				ctx.fillRect(120 * x, 120 * y, 120, 120);
			} else {
				ctx.fillStyle = 'dimgray';
				ctx.fillRect(120 * x, 120 * y, 120, 120);
			}

			let boardNumber = y * 6 + (x + 1);
			if (state.traps[boardNumber] !== undefined) {
				// Traps
				ctx.fillStyle = 'red';
				ctx.fillRect(120 * x, 120 * y, 120, 120);
			}
			if (boardNumber === state.posPlayer1) {
				// Player 1
				ctx.fillStyle = 'green';
				ctx.fillRect(120 * x, 120 * y, 60, 60);
			}
			if (boardNumber === state.posPlayer2) {
				// Player 2
				ctx.fillStyle = 'blue';
				ctx.fillRect(120 * x, (120 * y) + 60, 60, 60);
			}
		}
	}

	/*
	window.onload = function() {
	    var c = document.getElementById("myCanvas");
	    var ctx = c.getContext("2d");

			window.onload = function() {
			var img = document.getElementById('token_castle');
			ctx.drawImage(img, 60, 60);
			}
	}
	*/

	el.appendChild(canvas);
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

// Render options, which page to appear
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
	console.log(state);
}


function game() {
	state = init();

	render(state);
}

// Dice
var dice = {
	sides: 6,
	roll: function() {
		var randomNumber = Math.floor(Math.random() * 6) + 1;
		return randomNumber;
	}
}

//Show the dice
function showNumber(number) {
	var diceRoller = document.getElementById("diceRoller");
	diceRoller.innerHTML = number;
}

function rollDice() {
	var result = dice.roll();
	showNumber(result);
	return result;
}

// Move according to dice roll
function rollDiceAndMove() {
	state.lastDiceRoll = rollDice();

	if (state.nextPlayer === 'player1') {
		state.posPlayer1 += state.lastDiceRoll;

		//If the value is not equal to undefined it's a trap
		if (state.traps[state.posPlayer1] !== undefined) {
			alert(state.traps[state.posPlayer1].trapInfo);
			state.posPlayer1 -= state.traps[state.posPlayer1].backwardsValue
		}
		//If player1 has reached the max position(30) the Finale page appear
		if (state.posPlayer1 >= state.maxPosition) {
			state.gameStage = 'FINALE';
		}
		//If the dice shows a number less than 6 it is player2's turn
		if (state.lastDiceRoll < 6) {
			state.nextPlayer = 'player2'
		}
	} else {
		state.posPlayer2 += state.lastDiceRoll;

		if (state.traps[state.posPlayer2] !== undefined) {
			alert(state.traps[state.posPlayer2].trapInfo);
			state.posPlayer2 -= state.traps[state.posPlayer2].backwardsValue
		}

		if (state.posPlayer2 >= state.maxPosition) {
			state.gameStage = 'FINALE';
		}
		if (state.lastDiceRoll < 6) {
			state.nextPlayer = 'player1';
		}
	}

	render(state);

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

game();
