export interface IPlayer {
    name: string;
    color?: string;
    playerID: string;
    gameID: string;
}

export interface IGames {
    [key: number]: IPlayer[]
}