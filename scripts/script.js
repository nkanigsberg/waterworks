/**
 * @namespace game
 */
const game = {};

/** @type {object} - the board dimensions */
game.dimensions = {
	cols: 12,
	rows: 8,
};


/**
 * Build the gameboard
 * @param {object} param0 - object containing number of columns and rows to be generated
 */
game.buildBoard = function({cols, rows}) {
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

			$game.append(`<div class="square"></div>`);
		};
	};

	console.table(boardArray);
};






/**
 * Initialize Game
 */
game.init = function() {
	game.buildBoard(game.dimensions);
};


/**
 * Document Ready
 */
$(function() {
	game.init();
});