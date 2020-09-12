/** Class representing a pipe */
class Pipe {
	/**
	 * Create a Pipe
	 * @param {string} type
	 * @param {number} column 
	 * @param {number} row 
	 * @param {number} rotation 
	 */
	constructor(type, column, row, rotation) {
		this.type = type;
		this.column = column;
		this.row = row;
		this.rotation = rotation;
	};

	get htmlValue() {
		return this.htmlString();
	};

	htmlString() {
		console.log(this);
		// capitalize first letter to work in URL
		const capitalizedType = this.type.charAt(0).toUpperCase() + this.type.slice(1);
		// const capitalizedType = this.type;
		
		let htmlResult = 
			`<img 
				class="${this.type} pipe rotate${this.rotation}"
				src="assets/pipe${capitalizedType}.svg"
				alt="${capitalizedType} Pipe"
			`;

			// console.log(this.index);
			// if (this.index !== undefined) {
			// 	htmlResult += ` index="${this.index}"`
			// }

			htmlResult += `>`;

		return htmlResult;
	}


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

/** @type {number} how many turns before the water starts */
game.turnsUntilWater = 3;

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

	game.addEndPieces();
};


/**
 * Add the end pipes to the board
 */
game.addEndPieces = () => {
	const startPos = [0, 1];
	const endPos = [game.dimensions.cols - 1, game.dimensions.rows - 2];

	console.log(endPos);
	console.log(endPos[0]);

	// add end pieces into array
	game.board[startPos[1]][startPos[0]].pipe = new Pipe('start', startPos[0], startPos[1], 0);

	game.board[endPos[1]][endPos[0]].pipe = new Pipe('end', endPos[0], endPos[1], 0);


	// add end pieces onto html
	$(`.game .square[x="${startPos[0]}"][y="${startPos[1]}"]`).html(game.board[startPos[1]][startPos[0]].pipe.htmlValue);
	
	$(`.game .square[x="${endPos[0]}"][y="${endPos[1]}"]`).html(game.board[endPos[1]][endPos[0]].pipe.htmlValue);
};



// /**
//  * Listen for click and place pipe on square
//  */
// game.placePipe = () => {
// 	const $game = $('.game');

// 	$game.on('click', '.square', function() {
// 		$(this).html(game.pipes.current);
// 		// console.log($(this));
// 	});
// };


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
	console.table({randomNum});
	let pipeType = '';
	
	if (randomNum >= 9) {
		pipeType = 'fourWay';
	} else if (randomNum >= 6) {
		pipeType = 'straight';
	} else {
		pipeType = 'curved';
	}
	
	return new Pipe(pipeType, -1, -1, 0);
};


// game.selectPipe = () => {
// 	const $pipesMenu = $('.pipes');

// 	$pipesMenu.on('click', '.pipe', function() {
// 		let pipeType = $(this).attr('class');

// 		// remove everything after space in pipeType in order to get only the first class name
// 		pipeType = pipeType.substring(0, pipeType.indexOf(' '));

// 		// console.log(pipeType);

// 		game.pipes.current = game.pipes[pipeType];
// 		// console.log(game.currentPipe);
// 	});
// };


/**
 * Rotate pipe on click
 */
game.rotatePipe = () => {
		const $pipesMenu = $('.pipes');

	// // disable context menu
	// $('body').on('contextmenu', function(e) {
	// 	e.preventDefault();
	// });

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

	// Make squares droppable
	$('.game .square').droppable({
		drop: function() {
			const y = $(this).attr('y');
			const x = $(this).attr('x');

			if (!$(this).hasClass('occupied')) {
				game.currentPipe.row = y;
				game.currentPipe.column = x;

				game.board[y][x].pipe = game.menuPipes.shift();
				game.menuPipes.push(game.randomPipe());

				$(this).addClass('occupied').html(game.currentPipe.htmlValue);
				
				game.refreshPipes();
				game.dragAndDrop();
			}
		},
		classes: {
			"ui-droppable-hover": "ui-state-hover"
		},
	});
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
