import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { game, addPlayer, removePlayer } from "./game.js";

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

const port = process.env.PORT || 5000;

// Setup socket io
io.on('connection', (socket: Socket) => {
    

    /**
     * Event to let the user join the game
     */
    socket.on('join', ({ name, gameID }, callback) => {

        console.log(`[Player joined] :: name -> ${name} & gameID -> ${gameID}`);

        const { error, player, opponent } = addPlayer({
            name,
            playerID: socket.id,
            gameID,
        });

        if (error) {
            return callback({ error });
        }

        socket.join(gameID);

        callback({ color: player.color });

        //send welcome message to player1, and also send the opponent player's data
        socket.emit('welcome', {
            message: `Hello ${player.name}, Welcome to the game`,
            opponent,
        });

        // Tell player2 that player1 has joined the game.
        socket.broadcast.to(player.gameID).emit('opponentJoin', {
            message: `${player.name} has joined the game. `,
            opponent: player,
        });

        if (game(gameID).length >= 2) {
            const white = game(gameID).find((player) => player.color === 'w');
            io.to(gameID).emit('message', {
                message: `Let's start the game. White (${white.name}) goes first`,
            });
        }
    });

    /**
     * Event to handle the move made by player
     */
    socket.on('move', ({ from, to, gameID }) => {
        console.log(`[Move fired] :: from -> ${from}, to -> ${to}`);
        socket.broadcast.to(gameID).emit('opponentMove', { from, to });
    });


    /**
     * Exit/end the game
     */
    socket.on('disconnect', () => {
        const player = removePlayer(socket.id);

        if (player) {
            io.to(player.game).emit('message', {
                message: `${player.name} has left the game.`,
            });
            socket.broadcast.to(player.game).emit('opponentLeft');
        }
    });
})

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: "Jai shri ram"
    });
})

httpServer.listen(port, () => {
  console.log(`⚡️ Socket.IO server started at: ${port}`);
});