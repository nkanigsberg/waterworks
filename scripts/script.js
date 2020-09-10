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
};


/**
 * @namespace game
 */
const game = {};

/** @type {object} - The board dimensions */
game.dimensions = {
	cols: 12,
	rows: 8,
};

/** @type {object} The types of pipes in the game */
game.pipes = {
	straight: '<img class="straight pipe rotate0" src="../assets/pipeStraight.svg" alt="Straight Pipe">',
	curved: '<img class="curved pipe rotate0" src="../assets/pipeCurved.svg" alt="Curved Pipe">',
	fourWay: '<img class="fourWay pipe rotate0" src="../assets/pipeFourWay.svg" alt="Four-Way Pipe">',
	current: '',
};

/** @type {array} The gameboard array */
game.board = [];

/** @type {array} The pipes in the menu */
game.menuPipes = [];


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
			const position = {
				x: x,
				y: y,
			};

			boardArray[y].push(position);

			$game.append(`<div class="square" title="x: ${x}, y: ${y}" x="${x}" y="${y}"></div>`);
		};
	};

	game.board = boardArray;
	console.log(game.board);
};


game.addPiece = () => {
	const $game = $('.game');

	$game.find('[x="0"][y="0"]').append(game.pipes.straight);
	// console.log($game.find('[x="0"][y="0"]'));
	// console.log('pipe added');

};


/**
 * Listen for click and place pipe on square
 */
game.placePipe = () => {
	const $game = $('.game');

	$game.on('click', '.square', function() {
		$(this).html(game.pipes.current);
		console.log($(this));
	});

};


/**
 * Build the menu
 */
game.buildMenu = () => {
	const $pipesMenu = $('.pipes');

	game.menuPipes.push(new Pipe('straight', -1, -1, 0));
	game.menuPipes.push(new Pipe('curved', -1, -1, 0));
	game.menuPipes.push(new Pipe('fourWay', -1, -1, 0));
	console.log(game.menuPipes);
	
	game.menuPipes.forEach((pipe, index) => {
		$pipesMenu.append(game.pipes[pipe.type]);
	});

};



game.selectPipe = () => {
	const $pipesMenu = $('.pipes');

	$pipesMenu.on('click', '.pipe', function() {
		let pipeType = $(this).attr('class');

		// remove everything after space in pipeType in order to get only the first class name
		pipeType = pipeType.substring(0, pipeType.indexOf(' '));

		// console.log(pipeType);

		game.pipes.current = game.pipes[pipeType];
		// console.log(game.currentPipe);
	});



	// var str = "Abc: Lorem ipsum sit amet";
	// str = str.substring(str.indexOf(":") + 1);
	// console.log(str);

};


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
	});
};


/**
 * Allow user to drag and drop pipes onto board
 */
game.dragAndDrop = () => {
	// Make pipes draggable
	$('.pipe').draggable({ 
		revert: true,
		start: function() {
			let pipeType = $(this).attr('class');

			// remove everything after space in pipeType in order to get only the first class name
			pipeType = pipeType.substring(0, pipeType.indexOf(' '));

			game.pipes.current = game.pipes[pipeType];
		},
	});

	// Make squares droppable
	$('.square').droppable({
		drop: function(event, ui) {
			$(this).html(game.pipes.current);
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