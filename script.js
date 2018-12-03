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

function loadCharacters() {
	let characters = ['16', '27', '2024', '1880', '238', '867', '565', '583', '957', '954']

	let characterInfoRetrieval = characters.map((c) => fetch('https://www.anapioficeandfire.com/api/characters/' + c).then(result => result.json()))

	Promisa.all(characterInfoRetrieval).then(characters => {
		state.availableCharacters = characters;
		state.gameStage = "CHARACTER_SELECT";

		render(state);
	});
}
