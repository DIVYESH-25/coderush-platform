const Datastore = require('nedb-promises');
const path = require('path');

const db = {
    teams: Datastore.create({ filename: path.join(__dirname, 'data/teams.db'), autoload: true }),
    gameState: Datastore.create({ filename: path.join(__dirname, 'data/gameState.db'), autoload: true })
};

module.exports = db;
