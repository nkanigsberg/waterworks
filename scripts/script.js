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
	straight: '<img src="../assets/pipeStraight.svg" alt="Straight Pipe">',
}


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
game.clickSquare = () => {
	const $game = $('.game');

	$game.on('click', '.square', function() {
		$(this).append(game.pipes.straight);
		console.log($(this));
	});

};


/**
 * Initialize Game
 */
game.init = () => {
	game.buildBoard(game.dimensions);
	// game.addPiece();

	game.clickSquare();
};


/**
 * Document Ready
 */
$(() => {
	game.init();
});