export interface GameSession {
    gameId: number;
    gameTeam: number;
    gameControllers: number[];
}

export interface TeacherSession {
    gameId: number;
    gameSection: string;
    gameInstructor: string;
}
