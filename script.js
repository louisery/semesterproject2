/* Semester Project 2 - Game of Thrones Board Game */

// Information about the game
function init() {
	loadCharacters();
	loadImages();

	return {
		availableCharacters: [],
		maxPosition: 30,
		posPlayer1: 1,
		posPlayer2: 1,
		infoPlayer1: {},
		infoPlayer2: {},
		traps: {
			5: { trapInfo: 'You lost in a sword fight against Brienne of Tarth, you went back two spaces.', backwardsValue: 2 },
			10: { trapInfo: 'The Mountain is blocking the road ahead, you went back three spaces.', backwardsValue: 3 },
			15: { trapInfo: 'You did not manage to solve Lord Varys’ riddle, you went back two spaces.', backwardsValue: 2 },
			20: { trapInfo: 'You trusted Little Finger, that was not smart, you went back four spaces.', backwardsValue: 4 },
			25: { trapInfo: 'Grand Maester Pycelle poisoned you, you went back three spaces.', backwardsValue: 3 }
		},
		nextPlayer: 'player1',
		lastDiceRoll: 0,
		gameStage: 'LOADING', // LOADING, CHARACTER_SELECT, GAME, FINALE
	}
}

// Fetch characters from API
function loadCharacters() {
	let characters = ['16', '867', '957', '1880', '238', '954', '565', '583', '27', '2024']

	let characterInfoRetrieval = characters.map((c) => fetch('https://www.anapioficeandfire.com/api/characters/' + c).then(result => result.json()))

	Promise.all(characterInfoRetrieval).then(characters => {
		state.availableCharacters = characters;
		state.gameStage = 'CHARACTER_SELECT';

		render(state);
	});
}

// Download token images
function loadImages() {
	window.img = new Image();
	window.img2 = new Image();
	img.src = 'images/token_crown.png';
	img2.src = 'images/token_castle.png';
}

// Loading state while waiting for api info to appear
function renderLoading(state) {
	let el = document.getElementById('game');
	el.innerHTML = "<h2>Loading...</h2>";
}

// CHARACTER_SELECT
function renderCharacterSelect(state) {
	let el = document.getElementById('game');
	el.innerHTML = '';
	el.innerHTML = '<h2>Select two characters:</h2>';

	// Player 1 and Player 2 can not be the same character
	let selectPlayer1Function = (item) => {
		if (state.infoPlayer2 !== item) {
			state.infoPlayer1 = item;
			render(state);
		}
	}

	let selectPlayer2Function = (item) => {
		if (state.infoPlayer1 !== item) {
			state.infoPlayer2 = item;
			render(state);
		}
	}

	// Start game
	let startGameFunction = () => { state.gameStage = "GAME"; render(state); }

	// Show chosen characters
	let p1label = document.createElement('div');
	let p2label = document.createElement('div');

	p1label.innerHTML = "Player 1: " + state.infoPlayer1.name;
	p2label.innerHTML = "Player 2: " + state.infoPlayer2.name;
	el.appendChild(p1label);
	el.appendChild(p2label);

	// Play Game Button
	if (Object.keys(state.infoPlayer1).length != 0 && Object.keys(state.infoPlayer2).length != 0) {
		let playGameBtn = document.createElement('button');
		playGameBtn.className = 'btn_play expand';
		playGameBtn.innerHTML = 'Play';
		playGameBtn.addEventListener('click', (e) => startGameFunction());
		el.appendChild(playGameBtn);
	}

	state.availableCharacters.forEach(character => {
		el.appendChild(createCharacterCard(character, selectPlayer1Function, selectPlayer2Function));
	});
}

// GAME
function renderGame(state) {
	let el = document.getElementById('game');
	el.innerHTML = '';

	// Show which player has the crown token and which player has the castle token
	let tokens = document.createElement('div');
	tokens.innerHTML = '<p>Player 1 - Crown Token</p><p>Player 2 - Castle Token</p>';

	el.appendChild(tokens);

	// Canvas
	let canvas = document.createElement('canvas');
	canvas.width = 630;
	canvas.height = 525;
	canvas.className = 'gameBoard';
	let ctx = canvas.getContext('2d');

	// Draw game board
	for (var x = 0; x < 6; x++) {
		for (var y = 0; y < 5; y++) {
			// Every other square is gray/dimgray
			if (x % 2 === y % 2) {
				ctx.fillStyle = 'gray';
				ctx.fillRect(105 * x, 105 * y, 105, 105);
			} else {
				ctx.fillStyle = 'dimgray';
				ctx.fillRect(105 * x, 105 * y, 105, 105);
			}

			let boardNumber = y * 6 + (x + 1);
			if (state.traps[boardNumber] !== undefined) {
				// Traps
				ctx.fillStyle = '#B21917';
				ctx.fillRect(105 * x, 105 * y, 105, 105);
			}
			// Tokens
			if (boardNumber === state.posPlayer1) {
				// Player 1
				ctx.drawImage(img, 105 * x, 105 * y, 105, 105);
			}
			if (boardNumber === state.posPlayer2) {
				// Player 2
				ctx.drawImage(img2, 105 * x, 105 * y, 105, 105);
			}
		}
	}
	el.appendChild(canvas);

	// Who rolled the dice and what number they got
	let diceLabel = document.createElement('div');

	// Show the number you rolled
	if (state.lastDiceRoll !== 0) {
		let lastPlayer = fetchCurrentPlayer(state).name;
		diceLabel.innerText = lastPlayer + ' rolled a ' + state.lastDiceRoll;

		// Show "roll again" message when a player roll a 6
		if (state.lastDiceRoll === 6) {
			diceLabel.innerText = diceLabel.innerText + ' - Roll again!';
		}
		
		el.appendChild(diceLabel);
	}

	// Create roll dice button
	let diceBtn = document.createElement('button');
	diceBtn.className = 'expand';
	diceBtn.innerText = 'Roll Dice';
	diceBtn.addEventListener('click', rollDiceAndMove);

	el.appendChild(diceBtn);
}

// FINALE
function renderFinale(state) {
	let el = document.getElementById("game");
	el.innerHTML = '';

	// Heading with typewriter effect
	let typewriterDiv = document.createElement('div');
	typewriterDiv.innerHTML = '<h2>You defeated the white walkers!</h2>';
	typewriterDiv.className = 'typewriter';

	el.appendChild(typewriterDiv);

	// Canvas
	let canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = 500;
	let ctx = canvas.getContext('2d');

	el.appendChild(canvas);

	// Draw bouncing balls
	let width = window.innerWidth;
	let height = 500;
	let balls = [
		{ x: 0, y: 0, dx: 3, dy: 7, r: 10 },
		{ x: 90, y: 90, dx: 7, dy: 3, r: 15 },
		{ x: 100, y: 100, dx: 6, dy: 4, r: 20 },
		{ x: 150, y: 150, dx: 4, dy: 6, r: 10 },
		{ x: 200, y: 200, dx: 3, dy: 7, r: 15 },
		{ x: 250, y: 250, dx: 4, dy: 6, r: 20 },
		{ x: 250, y: 250, dx: 7, dy: 3, r: 25 },
		{ x: 300, y: 300, dx: 6, dy: 4, r: 10 },
		{ x: 350, y: 350, dx: 7, dy: 3, r: 15 },
		{ x: 400, y: 400, dx: 3, dy: 7, r: 20 },
		{ x: 450, y: 450, dx: 4, dy: 6, r: 25 }
	];

	let ballPath = (ball, ctx) => {
		ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
		ctx.moveTo(ball.x + ball.y, ball.r);

	}
	let moveBall = (ball) => {
		if (ball.x < 0 || ball.x > width) ball.dx = -ball.dx;
		if (ball.y < 0 || ball.y > height) ball.dy = -ball.dy;
		ball.x += ball.dx;
		ball.y += ball.dy;
	}
	let onMove = () => {
		ctx.clearRect(0, 0, width, height);
		ctx.font = '3.5vw mason-serif';
		ctx.textAlign = 'center';
		ctx.fillText('Congratulations ' + fetchLeadingPlayer(state).name + ' !!!', window.innerWidth / 2, window.innerHeight / 2);
		ctx.fillStyle = '#FFFF19';
		ctx.beginPath();
		var i;
		for (i = 0; i < balls.length; i++) {
			moveBall(balls[i]);
			ballPath(balls[i], ctx);
		}
		ctx.fill();
	}

	setInterval(onMove, 15);

	// Extra text with fun remark
	var funText = document.createTextNode("P.S. Winter is still coming");
	el.appendChild(funText);

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
}


function game() {
	state = init();

	render(state);
}

// Dice
function rollDice() {
	return Math.floor(Math.random() * 6) + 1;
}

// Move according to dice roll
function rollDiceAndMove() {
	state.lastDiceRoll = rollDice();

	if (state.nextPlayer === 'player1') {
		state.posPlayer1 += state.lastDiceRoll;

		// If the value is not equal it's a trap
		if (state.traps[state.posPlayer1] !== undefined) {
			// Replace alert with modal
			(function() {
				var proxied = window.alert;
				window.alert = function() {
					$("#trapModal .modal-body").text(arguments[0]);
					$("#trapModal").modal('show');
				};
			})();

			alert(state.traps[state.posPlayer1].trapInfo);
			state.posPlayer1 -= state.traps[state.posPlayer1].backwardsValue
		}
		// If player 1 has reached the max position(30) the Finale page appear
		if (state.posPlayer1 >= state.maxPosition) {
			state.gameStage = 'FINALE';
		}
		// If the dice shows a number less than 6 it is player2's turn
		if (state.lastDiceRoll < 6) {
			state.nextPlayer = 'player2'
		}
	} else {
		state.posPlayer2 += state.lastDiceRoll;

		if (state.traps[state.posPlayer2] !== undefined) {
			(function() {
				var proxied = window.alert;
				window.alert = function() {
					$('#trapModal .modal-body').text(arguments[0]);
					$('#trapModal').modal('show');
				};
			})();
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

	var player1Button = document.createElement('button')
	var player2Button = document.createElement('button')
	player1Button.addEventListener('click', (e) => selectPlayer1Function(resultItem))
	player1Button.innerText = 'Select as player 1';
	player1Button.className = 'expand';
	player2Button.addEventListener('click', (e) => selectPlayer2Function(resultItem))
	player2Button.innerText = 'Select as player 2';
	player2Button.className = 'expand';
	wrapper.appendChild(player1Button);
	wrapper.appendChild(player2Button);

	return wrapper;
}

// Current player (roll dice)
function fetchCurrentPlayer(state) {
	if (state.nextPlayer === "player1") {
		return state.infoPlayer2;
	} else {
		return state.infoPlayer1;
	}
}

// Leading player
function fetchLeadingPlayer(state) {
	if (state.posPlayer1 > state.posPlayer2) {
		return state.infoPlayer1;
	} else {
		return state.infoPlayer2;
	}
}

game();
