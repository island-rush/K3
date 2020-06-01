-- This file contains the database table creations

CREATE TABLE IF NOT EXISTS games (
	gameId INT(3) PRIMARY KEY NOT NULL UNIQUE AUTO_INCREMENT,
    gameSection VARCHAR(16) NOT NULL,  -- ex: M1A1
    gameInstructor VARCHAR(32) NOT NULL, -- ex: Adolph
    
    gameAdminPassword VARCHAR(32) NOT NULL, -- MD5 Hash
    gameActive INT(1) NOT NULL DEFAULT 0, -- 0 inactive, 1 active
    
    gameBluePassword VARCHAR(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99', -- MD5 Hash
    gameRedPassword VARCHAR(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99',
    
    gameBlueController0 INT(1) NOT NULL DEFAULT 0, -- 0 not logged in, 1 logged in
    gameBlueController1 INT(1) NOT NULL DEFAULT 0,
    gameBlueController2 INT(1) NOT NULL DEFAULT 0,
    gameBlueController3 INT(1) NOT NULL DEFAULT 0,
    gameBlueController4 INT(1) NOT NULL DEFAULT 0,
    gameRedController0 INT(1) NOT NULL DEFAULT 0, -- COCOM
    gameRedController1 INT(1) NOT NULL DEFAULT 0, -- JFACC
    gameRedController2 INT(1) NOT NULL DEFAULT 0, -- JFLCC
    gameRedController3 INT(1) NOT NULL DEFAULT 0, -- JFMCC
    gameRedController4 INT(1) NOT NULL DEFAULT 0, -- JFSOCC
    
	gameBlueStatus INT(1) NOT NULL DEFAULT 0,  -- 0: still active, 1: waiting for other player
	gameRedStatus INT(1) NOT NULL DEFAULT 0,
    
    gameBluePoints INT(5) NOT NULL DEFAULT 5000,
    gameRedPoints INT(5) NOT NULL DEFAULT 5000,
    
    gamePhase INT(1) NOT NULL DEFAULT 0, -- 0: news, 1: buy, 2: combat, 3: place inv
    gameRound INT(1) NOT NULL DEFAULT 0, -- 0, 1, 2  rounds of movement
    gameSlice INT(1) NOT NULL DEFAULT 0, -- 0: planning, 1: events/movement
    
    flag0 INT(1) NOT NULL DEFAULT 1, -- Dragon bottom
    flag1 INT(1) NOT NULL DEFAULT 1, -- Dragon top
    flag2 INT(1) NOT NULL DEFAULT 1, -- HR Republic
    flag3 INT(1) NOT NULL DEFAULT -1, -- Montaville
    flag4 INT(1) NOT NULL DEFAULT 1, -- Lion Island
    flag5 INT(1) NOT NULL DEFAULT -1, -- Noyarc
    flag6 INT(1) NOT NULL DEFAULT -1, -- Fuler Island
    flag7 INT(1) NOT NULL DEFAULT -1, -- Rico Island
    flag8 INT(1) NOT NULL DEFAULT 0, -- Tamu Island
    flag9 INT(1) NOT NULL DEFAULT 0, -- Shor
    flag10 INT(1) NOT NULL DEFAULT -1, -- Keoni
    flag11 INT(1) NOT NULL DEFAULT 0, -- Eagle Top
    flag12 INT(1) NOT NULL DEFAULT 0, -- Eagle Bottom

    airfield0 INT(1) NOT NULL DEFAULT 1, -- Dragon bottom
    airfield1 INT(1) NOT NULL DEFAULT 1, -- Dragon top
    airfield2 INT(1) NOT NULL DEFAULT 1, -- HR Republic
    airfield3 INT(1) NOT NULL DEFAULT -1, -- Montaville
    airfield4 INT(1) NOT NULL DEFAULT -1, -- Lion
    airfield5 INT(1) NOT NULL DEFAULT -1, -- Fuller
    airfield6 INT(1) NOT NULL DEFAULT -1, -- Rico
    airfield7 INT(1) NOT NULL DEFAULT -1, -- Keoni
    airfield8 INT(1) NOT NULL DEFAULT 0, -- Eagle bottom
    airfield9 INT(1) NOT NULL DEFAULT 0 -- Eagle top
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS shopItems (
    shopItemId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    shopItemGameId INT(3) NOT NULL,
    shopItemTeamId INT(1) NOT NULL,
    shopItemTypeId INT(2) NOT NULL,
    FOREIGN KEY (shopItemGameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS invItems (
    invItemId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    invItemGameId INT(3) NOT NULL,
    invItemTeamId INT(1) NOT NULL,
    invItemTypeId INT(2) NOT NULL,
    FOREIGN KEY (invItemGameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS pieces (
	pieceId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    pieceGameId INT(3) NOT NULL,
    pieceTeamId INT(1) NOT NULL,
    pieceTypeId INT(2) NOT NULL,
    piecePositionId INT(4) NOT NULL,
    pieceContainerId INT(8),
    pieceVisible INT(1) NOT NULL,
    pieceMoves INT(2) NOT NULL,
    pieceFuel INT(2) NOT NULL,
    FOREIGN KEY (pieceGameId) REFERENCES games (gameId) ON DELETE CASCADE,
    FOREIGN KEY (pieceContainerId) REFERENCES pieces (pieceId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS plans(
    planGameId INT(2) NOT NULL,
    planTeamId INT(1) NOT NULL,
    planPieceId INT(8) NOT NULL,
    planMovementOrder INT(2) NOT NULL,
    planPositionId INT(4) NOT NULL,
    FOREIGN KEY (planGameId) REFERENCES games (gameId) ON DELETE CASCADE,
    FOREIGN KEY (planPieceId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    PRIMARY KEY (planPieceId, planMovementOrder)
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS news(
	newsId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    newsGameId INT(4) NOT NULL,
    newsOrder INT(4) NOT NULL,
    newsTitle VARCHAR(100) NOT NULL,
    newsInfo VARCHAR(800) NOT NULL,
    FOREIGN KEY (newsGameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS battleQueue(
	battleId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    battleGameId INT(4) NOT NULL,
    battlePosA INT(4) NOT NULL DEFAULT -1,
    battlePosB INT(4) NOT NULL DEFAULT -1,
    FOREIGN KEY (battleGameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS battlePieces(
	battleId INT(8) NOT NULL,
    battlePieceId INT(8) NOT NULL,
    battlePieceTargetId INT(8) DEFAULT -1,
    FOREIGN KEY (battleId) REFERENCES battleQueue (battleId) ON DELETE CASCADE,
    FOREIGN KEY (battlePieceId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    PRIMARY KEY (battleId, battlePieceId)
);

CREATE TABLE IF NOT EXISTS battleItemsTemp(
    battlePieceId INT(8) PRIMARY KEY NOT NULL,
    gameId INT(4) NOT NULL,
    battlePosA INT(4) NOT NULL DEFAULT -1,
    battlePosB INT(4) NOT NULL DEFAULT -1,
    FOREIGN KEY (battlePieceId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS battleItemsTargetsTemp(
	battleId INT(8) NOT NULL,
    battlePieceId INT(8) NOT NULL,
    battlePieceTargetId INT(8) DEFAULT -1,
    gameId INT(4) NOT NULL DEFAULT -1,
    FOREIGN KEY (battleId) REFERENCES battleQueue (battleId) ON DELETE CASCADE,
    FOREIGN KEY (battlePieceId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE,
    PRIMARY KEY (battleId, battlePieceId)
);

-- starting to not use the naming convention as much, keeps it simple (easier to understand)
CREATE TABLE IF NOT EXISTS pieceRefuelTemp(
	pieceId INT(8) NOT NULL,
    gameId INT(8) NOT NULL,
    teamId INT(1) NOT NULL, -- 0 or 1
    newFuel INT(8) DEFAULT -1,
    FOREIGN KEY (pieceId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE,
    PRIMARY KEY (pieceId)
);

CREATE TABLE IF NOT EXISTS rodsFromGod(
	rodsFromGodId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	gameId INT(8) NOT NULL,
    teamId INT(1) NOT NULL,
    positionId INT(4) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS remoteSensing(
	remoteSensingId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	gameId INT(8) NOT NULL,
    teamId INT(1) NOT NULL,
    positionId INT(4) NOT NULL,
    roundsLeft INT(2) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS insurgency(
	insurgencyId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	gameId INT(8) NOT NULL,
    teamId INT(1) NOT NULL,
    positionId INT(4) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS biologicalWeapons(
	biologicalWeaponsId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	gameId INT(8) NOT NULL,
    teamId INT(1) NOT NULL,
    positionId INT(4) NOT NULL,
    roundsLeft INT(2) NOT NULL,
    activated INT(1) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS raiseMorale(
	raiseMoraleId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	gameId INT(8) NOT NULL,
    teamId INT(1) NOT NULL,
    commanderType INT(2) NOT NULL,
    roundsLeft INT(2) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS commInterrupt(
	commInterruptId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	gameId INT(8) NOT NULL,
    teamId INT(1) NOT NULL,
    positionId INT(4) NOT NULL,
    roundsLeft INT(2) NOT NULL,
    activated INT(1) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS goldenEye(
	goldenEyeId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	gameId INT(8) NOT NULL,
    teamId INT(1) NOT NULL,
    positionId INT(4) NOT NULL,
    roundsLeft INT(2) NOT NULL,
    activated INT(1) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS goldenEyePieces(
	goldenEyeId INT(8) NOT NULL,
    pieceId INT(8) NOT NULL,
    FOREIGN KEY (goldenEyeId) REFERENCES goldenEye (goldenEyeId) ON DELETE CASCADE,
    FOREIGN KEY (pieceId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    PRIMARY KEY (goldenEyeId, pieceId)
);

CREATE TABLE IF NOT EXISTS seaMines(
	seaMineId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    gameId INT(8) NOT NULL,
    gameTeam INT(2) NOT NULL,
    positionId INT(3) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS droneSwarms(
	droneSwarmId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    gameId INT(8) NOT NULL,
    gameTeam INT(2) NOT NULL,
    positionId INT(3) NOT NULL,
    roundsLeft INT(4) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS atcScramble(
	atcScrambleId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    gameId INT(8) NOT NULL,
    teamId INT(2) NOT NULL,
    positionId INT(3) NOT NULL,
    roundsLeft INT(4) NOT NULL,
    activated INT(1) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS nukes(
	nukeId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    gameId INT(8) NOT NULL,
    teamId INT(2) NOT NULL,
    positionId INT(3) NOT NULL,
    activated INT(1) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS missileAttacks(
	missileAttackId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    gameId INT(8) NOT NULL,
    teamId INT(2) NOT NULL,
    missileId INT(8) NOT NULL,
    targetId INT(8) NOT NULL,
    FOREIGN KEY (missileId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    FOREIGN KEY (targetId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS bombardments(
	bombardmentId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    gameId INT(8) NOT NULL,
    teamId INT(2) NOT NULL,
    destroyerId INT(8) NOT NULL,
    targetId INT(8) NOT NULL,
    FOREIGN KEY (destroyerId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    FOREIGN KEY (targetId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS antiSatMissiles(
	antiSatId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    gameId INT(8) NOT NULL,
    teamId INT(2) NOT NULL,
    roundsLeft INT(4) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS missileDisrupts(
	missileDisruptId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    gameId INT(8) NOT NULL,
    teamId INT(2) NOT NULL,
    missileId INT(8) NOT NULL,
    roundsLeft INT(4) NOT NULL,
    activated INT(1) NOT NULL,
    FOREIGN KEY (missileId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS cyberDefenses(
	cyberDefenseId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    gameId INT(8) NOT NULL,
    teamId INT(2) NOT NULL,
    roundsLeft INT(4) NOT NULL,
    FOREIGN KEY (gameId) REFERENCES games (gameId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS newsEffects (
    newsEffectId INT(8) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    newsId INT(8) NOT NULL,
    newsEffectGameId INT(8) NOT NULL,
    roundsLeft INT(4) NOT NULL,
    newsEffectType INT(4) NOT NULL,
    FOREIGN KEY (newsId) REFERENCES news (newsId) ON DELETE CASCADE
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS newsEffectPieces(
	newsEffectId INT(8) NOT NULL,
    pieceId INT(8) NOT NULL,
    FOREIGN KEY (newsEffectId) REFERENCES newsEffects (newsEffectId) ON DELETE CASCADE,
    FOREIGN KEY (pieceId) REFERENCES pieces (pieceId) ON DELETE CASCADE,
    PRIMARY KEY (newsEffectId, pieceId)
);

CREATE TABLE IF NOT EXISTS newsEffectPositions(
	newsEffectId INT(8) NOT NULL,
    positionId INT(8) NOT NULL,
    FOREIGN KEY (newsEffectId) REFERENCES newsEffects (newsEffectId) ON DELETE CASCADE,
    PRIMARY KEY (newsEffectId, positionId)
);