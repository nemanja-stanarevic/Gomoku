
var gomoku;

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

window.requestAnimationFrame(function () {

  gomoku = new Gomoku(config.BOARD_SIZE, config.WINNING_LENGTH, config.STRATEGY_MAX_DEPTH);
});