import pool from "../database";

class Piece {
    pieceId: number;
    pieceGameId: number;
    pieceTeamId: number;
    piecetypeId: number;
    piecePositionId: number;
    pieceContainerId: number;
    pieceVisible: number;
    pieceMoves: number;
    pieceFuel: number;

    //not in database
    pieceDisabled: boolean;

    constructor(pieceId: number) {
        this.pieceId = pieceId;
    }

    async init() {
        let queryString = "SELECT * FROM pieces WHERE pieceId = ?";
        let inserts = [this.pieceId];
        let [rows, fields] = await pool.query(queryString, inserts);

        if (rows.length != 1) {
            return null;
        }

        Object.assign(this, rows[0]);

        queryString = "SELECT * FROM goldenEyePieces WHERE pieceId = ?";
        inserts = [this.pieceId];
        [rows, fields] = await pool.query(queryString, inserts);

        if (rows.length === 0) {
            Object.assign(this, { pieceDisabled: false });
        } else {
            Object.assign(this, { pieceDisabled: true });
        }

        return this;
    }
}

export default Piece;
