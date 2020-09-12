/** Class representing a pipe */
class Pipe {
	/**
	 * Create a Pipe
	 * @param {string} type
	 * @param {number} column 
	 * @param {number} row 
	 * @param {number} rotation
	 * @param {boolean} wet
	 */
	constructor(type, column, row, rotation, wet) {
		this.type = type;
		this.column = column;
		this.row = row;
		this.rotation = rotation;
		this.wet = wet;
	};

	get htmlValue() {
		return this.htmlString();
	};

	get exits() {
		return this.exitPoints();
	}

	/** the html string to append to board */
	htmlString() {
		// capitalize first letter to work in URL
		let capitalizedType = this.type.charAt(0).toUpperCase() + this.type.slice(1);

		if (this.wet === true) {
			capitalizedType += 'Wet';
		};
		
		let htmlResult = 
			`<img 
				class="${this.type} pipe rotate${this.rotation}"
				src="assets/pipe${capitalizedType}.svg"
				alt="${capitalizedType} Pipe"
			>`;

		return htmlResult;
	};

	/** place this pipe on the board */
	placeOnBoard() {
		$(`.game .square[x="${this.column}"][y="${this.row}"]`).html(this.htmlValue);
	};

	/** Make this pipe wet */
	makeWet() {
		this.wet = true;
		this.placeOnBoard();
		game.wetPipes.push(this);
	};

	/** return the exit points of this pipe */
	exitPoints() {
		// start pipe
		if (this.type === 'start' || this.type === 'startWet') {
			return [[this.column + 1, this.row]];

		// straight pipe
		} else if (this.type === 'straight' || this.type === 'straightWet') {
			if (this.rotation === 0 || this.rotation === 2) {
				return [[this.column - 1, this.row], [this.column + 1, this.row]];
			} else {
				return [[this.column, this.row - 1], [this.column, this.row + 1]];
			};

		// curved pipe
		} else if (this.type === 'curved' || this.type === 'curvedWet') {
			if (this.rotation === 0) {
				return [[this.column - 1, this.row], [this.column, this.row - 1]];
			} else if (this.rotation === 1) {
				return [[this.column, this.row - 1], [this.column + 1, this.row]];
			} else if (this.rotation === 2) {
				return [[this.column + 1, this.row], [this.column, this.row + 1]];
			} else {
				return [[this.column - 1, this.row], [this.column, this.row + 1]];
			}

		// fourWay pipe
		} else if (this.type === 'fourWay') {
			return [[this.column - 1, this.row], [this.column, this.row - 1], [this.column + 1, this.row], [this.column, this.row + 1]];

		// end pipe
		} else if (this.type === 'end') {
			return [[this.column - 1, this.row]];
		};
	};
};


/**
 * @namespace game
 */
const game = {};

/** @type {object} The board dimensions */
game.dimensions = {
	cols: 12,
	rows: 8,
};

/** @type {object} The currently selected pipe */
game.currentPipe = {};

/** @type {array} The gameboard array */
game.board = [];

/** @type {array} The pipes in the menu */
game.menuPipes = [];

/** @type {number} how many turns have passed */
game.turnCounter = 0;

/** @type {object} The start and endpoints */
game.endPoints = {
	start: [0, 1],
	end: [game.dimensions.cols - 1, game.dimensions.rows - 2]
};

/** @type {array} Array containing the current wet pipes */
game.wetPipes = [];


/**
 * Build the gameboard
 * @param {object} param0 - object containing number of columns and rows to be generated
 */
game.buildBoard = ({cols, rows}) => {
	const boardArray = [];
	const $game = $('.game');

	for (let y = 0; y < rows; y++) {
		boardArray.push([]);

		for (let x = 0; x < cols; x++) {
			const squareDetails = {
				x: x,
				y: y,
				pipe: null,
			};

			boardArray[y].push(squareDetails);

			$game.append(`<div class="square" x="${x}" y="${y}"></div>`);
		};
	};

	game.board = boardArray;
	console.log(game.board);

	game.addEndPieces(game.endPoints);
};


/**
 * Add the end pipes to the board
 * @param {object} param0 - object containing the coordinates to place end pipes
 */
game.addEndPieces = ({start, end}) => {

	const startPipe = new Pipe('start', start[0], start[1], 0, false);
	const endPipe = new Pipe('end', end[0], end[1], 0, false);

	// add end pieces into array
	game.board[start[1]][start[0]].pipe = startPipe;
	game.board[end[1]][end[0]].pipe = endPipe;

	// add end pieces onto html
	// $(`.game .square[x="${start[0]}"][y="${start[1]}"]`).html(game.board[start[1]][start[0]].pipe.htmlValue);

	// $(`.game .square[x="${end[0]}"][y="${end[1]}"]`).html(game.board[end[1]][end[0]].pipe.htmlValue);

	// console.log(game.board[start[1]][start[0]]);
	game.board[start[1]][start[0]].pipe.placeOnBoard();

	game.board[end[1]][end[0]].pipe.placeOnBoard();
};


/**
 * Build the menu
 */
game.buildMenu = () => {
	while (game.menuPipes.length < 4) {
		game.menuPipes.push(game.randomPipe());
	};
	// console.log(game.menuPipes);
	game.refreshPipes();
};

game.refreshPipes = () => {
	game.menuPipes.forEach((pipe, index) => {
		$(`.pipe${index}`).html(pipe.htmlValue);
	});
};

/**
 * Return a random pipe type
 * @returns {Pipe} A random pipe
 */
game.randomPipe = () => {
	// const pipeTypes = ['straight', 'curved', 'fourWay'];
	const randomNum = Math.floor(Math.random() * 10);
	// console.table({randomNum});
	let pipeType = '';
	
	if (randomNum >= 9) {
		pipeType = 'fourWay';
	} else if (randomNum >= 6) {
		pipeType = 'straight';
	} else {
		pipeType = 'curved';
	}
	
	return new Pipe(pipeType, -1, -1, 0, false);
};


/**
 * Rotate pipe on click
 */
game.rotatePipe = () => {
		const $pipesMenu = $('.pipes');

	$pipesMenu.on('click', '.pipe', function() {
		const pipe = game.menuPipes[0];
		const currentRotation = pipe.rotation;
		console.log(currentRotation);

		pipe.rotation = (pipe.rotation + 1) % 4;
		console.log(pipe.rotation);

		$(this).removeClass(`rotate${currentRotation}`).addClass(`rotate${pipe.rotation}`);
	});
};


/**
 * Allow user to drag and drop pipes onto board
 */
game.dragAndDrop = () => {
	const dragListnener = () => {
		// Make pipes draggable
		$('.pipe0 .pipe').draggable({ 
			revert: true,
			start: function() {
				const index = 0;
				let pipeType = $(this).attr('class');

				// remove everything after space in pipeType in order to get only the first class name
				pipeType = pipeType.substring(0, pipeType.indexOf(' '));
				console.log(index);

				game.currentPipe = game.menuPipes[index];
				console.log(game.currentPipe);
			},
			stack: '.pipe',
		});
	};

	dragListnener();

	// Make squares droppable
	$('.game .square').droppable({
		drop: function() {
			const y = parseInt($(this).attr('y'));
			const x = parseInt($(this).attr('x'));

			if (!game.board[y][x].pipe) {
				game.currentPipe.row = y;
				game.currentPipe.column = x;

				game.board[y][x].pipe = game.menuPipes.shift();
				game.menuPipes.push(game.randomPipe());

				console.log('exits:', game.board[y][x].pipe.exits);

				$(this).addClass('occupied').html(game.currentPipe.htmlValue);
				
				game.refreshPipes();
				dragListnener();

				game.waterMove(game.endPoints);
			}
		},
		classes: {
			"ui-droppable-hover": "ui-state-hover"
		},
	});
};


/**
 * Move the water through the pipes
 * @param {object} param0 - the start and end coordinates
 */
game.waterMove = ({start, end}) => {
	game.turnCounter++;

	// only start moving water after an initial number of turns
	if (game.turnCounter > 3) {
	
		// if there are no wet pipes, make start pipe wet
		if (game.wetPipes.length === 0) {
			game.board[start[1]][start[0]].pipe.makeWet();

		} else {
			// the number of pipes to remove from start of wetPipes array
			let numPipesToRemove = game.wetPipes.length;
			console.log(numPipesToRemove);

			// loop through wet pipes and make attached pipes wet
			game.wetPipes.forEach((pipe) => {
				// loop through exits for this pipe and fill attached pipes
				pipe.exits.forEach((exit) => {
					
					if (exit[0] >= 0 && exit[0] < game.dimensions.cols && exit[1] >= 0 && exit[1] < game.dimensions.rows) {
						const nextPipe = game.board[exit[1]][exit[0]].pipe;
						if (nextPipe !== null && nextPipe.wet === false) {

							// loop through exits for attached pipe and check if connected to origin pipe
							nextPipe.exits.forEach((exit) => {
								if (exit[0] === pipe.column && exit[1] === pipe.row){
									nextPipe.makeWet();
								};
							});
						};
					}
				});
			});

			console.log(game.wetPipes);
			// remove old pipes from wetPipes array
			for (let i = 0; i < numPipesToRemove; i++) {
				game.wetPipes.shift();
			};
			console.log(game.wetPipes);
		};
	};
};


/**
 * Initialize Game
 */
game.init = () => {
	game.buildBoard(game.dimensions);
	game.buildMenu();


	// game.addPiece();

	// game.placePipe();
	// game.selectPipe();

	game.dragAndDrop();
	game.rotatePipe();
};


/**
 * Document Ready
 */
$(() => {
	game.init();
});
