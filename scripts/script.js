/**
 * @namespace game
 */
const game = {};

/** @type {object} - the board dimensions */
game.dimensions = {
	cols: 12,
	rows: 8,
};

game.pipes = {
	straight: '<img class="straight pipe rotate0" src="../assets/pipeStraight.svg" alt="Straight Pipe">',
	curved: '<img class="curved pipe rotate0" src="../assets/pipeCurved.svg" alt="Curved Pipe">',
	fourWay: '<img class="fourWay pipe" src="../assets/pipeFourWay.svg" alt="Four-Way Pipe">',
	current: '',
};



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

	// console.table(boardArray);
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


game.buildMenu = () => {
	const $pipesMenu = $('.pipes');

	$pipesMenu.append(game.pipes.straight);
	$pipesMenu.append(game.pipes.curved);
	$pipesMenu.append(game.pipes.fourWay);
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
 * Initialize Game
 */
game.init = () => {
	game.buildBoard(game.dimensions);
	game.buildMenu();


	// game.addPiece();

	game.placePipe();
	game.selectPipe();

};


/**
 * Document Ready
 */
$(() => {
	game.init();
});