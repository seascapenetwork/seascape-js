let lpMining = require("./lp_mining.js");
let cws = require("./cws.js");

/**
 *   Returns a game related functions by game id.
 *
 *   Each game has different set of methods
 */
let gameById = function(gameId) {
    if (gameId != 1) {
	throw "Invalid game ID";
    }

    return lpMining;
}

module.exports = {
    cws: cws,
    gameById: gameById,
    games: {
	0: function() { return {};},
	1: lpMining,
    },
};
