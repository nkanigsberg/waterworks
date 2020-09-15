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
		$(`.game .square[x="${this.column}"][y="${this.row}"]`).addClass('occupied').html(this.htmlValue);
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
			// return [];
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

/** @type {Pipe} The currently selected pipe */
game.currentPipe = {};

/** @type {array} The gameboard array */
game.board = [];

/** @type {array} The pipes in the menu */
game.menuPipes = [];

// /** @type {number} how many turns have passed */
// game.turnCounter = 0;

// /** @type {number} how many turns until water starts */
// game.turnsToStart = 5;

/** @type {number} How much time before water starts moving */
game.timeToStart = 0;

/** @type {number} How much time between water moves */
game.timer = 0;

/** @type {object} The start and endpoints */
game.endPoints = {
	start: [0, 1],
	end: [game.dimensions.cols - 1, game.dimensions.rows - 2]
};

/** @type {array} Array containing the current wet pipes */
game.wetPipes = [];

/** @type {boolean} True if game is over, false otherwise */
game.over = false;

/** @type {boolean} True if all pipes are full, false otherwise */
game.pipesFull = false;

/** @type {boolean} True if water has made it to the end pipe*/
game.winCondition = false;



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
 * Apply player settings and start game
 */
game.chooseSettings = () => {
	$('.settings form').on('submit', function(e) {
		e.preventDefault();
		const difficulty = $('#difficulty').val();

		if (difficulty === 'easy') {
			game.timeToStart = 12000;
			game.timer = 4000;
		} else if (difficulty === 'medium') {
			game.timeToStart = 8000;
			game.timer = 3000;
		} else if (difficulty === 'hard') {
			game.timeToStart = 6000;
			game.timer = 2000;
		};

		$('.settings').addClass('hidden');
		$('.pipes-container, .controls').removeClass('hidden');

		game.buildMenu();
		game.dragAndDrop();
		game.rotatePipe();
		game.buttonClick();

		if (difficulty !== 'creative') {
			game.intervalTimer(game.timer);
			game.displayTimer();
		} else {
			$('.timer').html('<p><i class="fas fa-hammer"></i>Creative Mode</p>');
		};
	});
};

/**
 * Build the menu
 */
game.buildMenu = () => {

	while (game.menuPipes.length < 4) {
		game.menuPipes.push(game.randomPipe());
	};

	game.refreshPipes();

	$('.timer span').text(`${game.timeToStart / 1000}`);
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
	const randomNum = Math.floor(Math.random() * 20);
	let pipeType = '';
	
	if (randomNum >= 17) {
		pipeType = 'fourWay';
	} else if (randomNum >= 11) {
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
		const menuIndex = parseInt($(this).parent('.square').attr('pipe'));
		const pipe = game.menuPipes[menuIndex];
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
	let index = 0;
	const dragListnener = () => {
		// Make pipes draggable
		$('.pipes .pipe').draggable({ 
			revert: true,
			start: function() {
				index = parseInt($(this).parent('.square').attr('pipe'));
				// console.log(index);

				let pipeType = $(this).attr('class');

				// remove everything after space in pipeType in order to get only the first class name
				pipeType = pipeType.substring(0, pipeType.indexOf(' '));
				// console.log(index);

				game.currentPipe = game.menuPipes[index];
				console.log(game.currentPipe);
			},
			stack: '.pipe',
		});
	};

	// inital call of drag listener
	dragListnener();

	// Make squares droppable
	$('.game .square').droppable({
		drop: function() {
			const y = parseInt($(this).attr('y'));
			const x = parseInt($(this).attr('x'));

			if (!game.board[y][x].pipe) {
				let canPlace = false;
				game.currentPipe.row = y;
				game.currentPipe.column = x;

				// place new piece only if connected to an existing piece
				game.currentPipe.exits.forEach((exit) => {
					if (game.pipeNotHittingWall(exit)) {
						console.log(exit);
						const nextPipe = game.board[exit[1]][exit[0]].pipe;
						console.log(nextPipe);
						// if the next pipe is connected
						if (nextPipe && game.checkPipesConnected(game.currentPipe, nextPipe) && nextPipe.type !== 'end') {
							canPlace = true;
						};
					};
				});

				if (canPlace) {
					game.board[y][x].pipe = game.menuPipes.splice(index, 1)[0];
					game.currentPipe.placeOnBoard();

					game.menuPipes.push(game.randomPipe());
					game.refreshPipes();

					// refresh drag listener for new pipes
					dragListnener();
				}
				// game.waterMove();
			};
		},
		classes: {
			"ui-droppable-hover": "ui-state-hover"
		},
	});
};


/**
 * Move the water through the pipes
 */
game.waterMove = () => {
	const { start, end } = game.endPoints;

	// if game isn't over
	if (!game.over) {
		// if there are no wet pipes, make start pipe wet
		if (game.wetPipes.length === 0) {
			game.board[start[1]][start[0]].pipe.makeWet();

		} else {
			// the number of pipes to remove from start of wetPipes array
			let numPipesToRemove = game.wetPipes.length;
			// console.log(numPipesToRemove);

			// Loop through wet pipes and make attached pipes wet
			game.waterToAttachedPipes(end);
			// console.log(game.wetPipes);

			// remove old pipes from wetPipes array
			for (let i = 0; i < numPipesToRemove; i++) {
				game.wetPipes.shift();
			};
			// console.log(game.wetPipes);
		};
	};
};


/**
 * Loop through wet pipes and make attached pipes wet 
 * @param {array} end - The end coordinates
 * */
game.waterToAttachedPipes = (end) => {
	let fullPipes = false;

	game.wetPipes.forEach((pipe) => {
		// loop through exits for this pipe and fill attached pipes
		pipe.exits.forEach((exit) => {

			// if not hitting a wall
			if (game.pipeNotHittingWall(exit)) {
				const nextPipe = game.board[exit[1]][exit[0]].pipe;
				// if the next pipe exists and isn't wet
				if (nextPipe !== null && !nextPipe.wet) {

					// if pipes are connected, make next pipe wet
					if (game.checkPipesConnected(pipe, nextPipe)) {
						nextPipe.makeWet();
					} else {
						// if not connected, lose the game
						game.lose(exit);
					};
				// if pipe doesn't exist, lose the game
				} else if (nextPipe === null) {
					game.lose(exit);
				};
			};

			// if water flows into the endpoint, win the game
			if (exit[0] === end[0] && exit[1] === end[1]) {
				game.win();
			};
		});
	});
};


/**
 * Check if two pipes are connected
 * @param {Pipe} pipe1 
 * @param {Pipe} pipe2 
 * @returns {boolean} true if connected, false if not
 */
game.checkPipesConnected = (pipe1, pipe2) => {
	let pipe1Connected = false;
	let pipe2Connected = false;

	pipe1.exits.forEach((exit) => {
		// if the pipes are connected together
		if (exit[0] === pipe2.column && exit[1] === pipe2.row) {
			pipe1Connected = true;
		};
	});
	console.log(pipe1Connected);
	
	pipe2.exits.forEach((exit) => {
		// if the pipes are connected together
		if (exit[0] === pipe1.column && exit[1] === pipe1.row) {
			pipe2Connected = true;
		};
	});
	console.log(pipe2Connected);

	return pipe1Connected & pipe2Connected;
};

/**
 * Check if pipe exits into wall
 * @param {array} exit - the exit points to check
 * @returns {boolean} True if pipe doesn't exit into wall
 */
game.pipeNotHittingWall = (exit) => {
	return exit[0] >= 0 && exit[0] < game.dimensions.cols && exit[1] >= 0 && exit[1] < game.dimensions.rows;
};


/**
 * Lose the game
 * @param {array} param0 the coordinates of the leak
 */
game.lose = ([x, y]) => {
	$(`.game .square[x="${x}"][y="${y}"]`).addClass('leak');
	// alert('Game over! Water is leaking!');
	if (!game.over) {
		Swal.fire('Game over! Water is leaking!');
	}
	game.over = true;
};

/**
 * Win the game
 */
game.win = () => {
	game.winCondition = true;
	// alert('You win!');
	if (!game.over) {
		Swal.fire('You win!');
	}
	game.over = true;
};


/**
 * Move water on an interval
 * @param {number} interval - the time interval between water movement
 */
game.intervalTimer = (interval) => {
	setInterval(() => {
		if (game.timeToStart <= 0) {
			game.waterMove();
		};
	}, interval);
};

/**
 * Display the timer
 */
game.displayTimer = () => {
	const $timer = $('.timer span');
	setInterval(() => {
		if (game.timeToStart > 0 && !game.over) {
			game.timeToStart -= 1000;
			$timer.text(`${game.timeToStart / 1000}`);
		} else {
			$timer.text('--');
		};
	}, 1000);
};


/**
 * Button Listeners
 */
game.buttonClick = () => {
	// on click of done buttons move water to end
	$('.controls .done').on('click', function() {
		setInterval(() => {
			game.waterMove();
		}, 100);
	});

	// on click of restart button, refresh page
	$('.controls .restart').on('click', function () {
		location.reload();
	});
};



/**
 * Initialize Game
 */
game.init = () => {
	game.buildBoard(game.dimensions);
	game.chooseSettings();
	// game.buildMenu();
	// game.dragAndDrop();
	// game.rotatePipe();
	// game.buttonClick();
	// game.intervalTimer(game.timer);
	// game.displayTimer();
};


/**
 * Document Ready
 */
$(() => {
	game.init();
});


game.test = () => {
	$('.memoryCard').on('click', function() {
		$(this).addClass('flip');
	});
}


function scroll(id) {
		element.scrollIntoView(id)
}