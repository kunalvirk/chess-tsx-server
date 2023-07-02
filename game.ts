import { IGames, IPlayer } from "./types.js";


// We will store the ongoing games in `games`
const games: IGames = {}


/**
 * Class to create a player
 * @param name: string
 * @param color: string
 * @param playerID: string
 * @param gameID: string
 * 
 */
class Player implements IPlayer {

    name: string;
    color?: string;
    playerID: string;
    gameID: string;
    
    constructor(name: string, color: string, playerID: string, gameID: string) {
        this.name = name;
        this.color = color;
        this.playerID = playerID;
        this.gameID = gameID;
    }

}


/**
 * 
 * Access a game by its room id
 * 
 * @param id 
 * @returns 
 */
export const game = (id: number) => games[id];

// function to add player to game
export const addPlayer = ({ gameID, name, playerID }) => {

    console.log(`Adding player to ${gameID}, name: ${name} and playerID: ${playerID}`);
    console.log('Current game state', games);

    // Check if there is no game room created with the given gameID
    // Create the game and assign the user a random color i.e. White | Black
    if (!games[gameID]) {
        const color = Math.random() <= 0.5 ? 'w' : 'b';
        const player = new Player(name, color, playerID, gameID);
        games[gameID] = [player];
        return {
            message: 'Joined successfully',
            opponent: null,
            player,
        };
    }

    // Right away, throw an error if the given room has 2 players
    if (games[gameID].length >= 2) {
        return { error: 'Oops! Please create another room.' };
    }

    // Let the user join if a room is already created
    const opponent: IPlayer = games[gameID][0];
    const color = opponent.color === 'w' ? 'b' : 'w';
    const player = new Player(name, color, playerID, gameID);
    games[gameID].push(player);

    return {
        message: 'Added successfully',
        opponent,
        player,
    };

}


export const removePlayer = (playerID: string) => {
    for (const game in games) {
        let players = games[game];
        const index = players.findIndex((pl: IPlayer) => pl.playerID === playerID);

        if (index !== -1) {
            return players.splice(index, 1)[0];
        }
    }
};