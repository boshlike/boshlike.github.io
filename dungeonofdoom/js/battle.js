//Import Mob to be used in the battle
import { Mob } from "./mob.js";

//Import the initialised instance of the window controls
import { controls } from "./windowControls.js";

// Initiate a battle class. This will encapsulate all logic around a battle.
class Battle {
    constructor(player, frontMonster, numFrontMonster, backMonster, numBackMonster) {
        this.player = player; //The current instance of the player object within Game
        this.mob = new Mob(frontMonster, numFrontMonster, backMonster, numBackMonster);
        this.isOver = false;
    }
    // The below method is called to launch a new battle and run the whole logic for the battle.
    async battleSequence() {
        this.buildBattlefield();
        const messageBox = controls.getMessageBox();
        messageBox.innerText = "Choose an action"
        while(this.isOver === false) {
            this.buildActionButtons();
            this.player.isDefending = false;
            await this.awaitPlayerTurn();
        }
        console.log("done")
    }

    awaitPlayerTurn() {
        const controlPanel = document.querySelector("#control-panel");
        return new Promise(resolve => {
            function handleClick() {
                document.removeEventListener('click', handleClick);
                resolve();
            }
            controlPanel.onclick = event => {
                this.playerTurn(event);
                handleClick();
            }
        })
    }

    playerTurn(event) {
        if (event.target.id === "control-panel") {
            controls.resetControlPanelDiv();
            return;
        }
        const playerAction = String(event.target.id);
        if (playerAction === "defend") {
            this.player.defend();
            controls.getMessageBox().innerText = "You are defending!"
            controls.resetControlPanelDiv();
            return;
        }
        if (playerAction === "take-potion") {
            this.player.drinkPotion();
            controls.getMessageBox().innerText = "You drank a potion!"
            controls.resetControlPanelDiv();
            return;
        }
        const attackStatus = this.player.attack()
        if (attackStatus[0] === false) {
            controls.getMessageBox().innerText = "You missed your target!"
            controls.resetControlPanelDiv();
            return;
        }
        let target = "";
        let targetTileId = "";
        controls.getMessageBox().innerText = "You hit your target!"
        switch(playerAction) {   
            case "front-enemy-1-square":
                targetTileId = "#col-2-4";
                target = this.mob.frontRank.filter(enemy => enemy.placement === targetTileId)[0];
                target.takeDamage(attackStatus[1]);
                console.log("Front Rank Target 1 current HP: ", target.currentHitPoints);
                target.checkDeathStatus();
                if (target.isAlive === false) {
                    controls.deathAnimation(targetTileId);
                }
                break;
            case "front-enemy-2-square":
                targetTileId = "#col-3-4";
                target = this.mob.frontRank.filter(enemy => enemy.placement === targetTileId)[0];
                target.takeDamage(attackStatus[1]);
                console.log("Front Rank Target 2 current HP: ", target.currentHitPoints);
                target.checkDeathStatus();
                if (target.isAlive === false) {
                    controls.deathAnimation(targetTileId);
                }
                break;
            case "front-enemy-3-square":
                targetTileId = "#col-4-4";
                target = this.mob.frontRank.filter(enemy => enemy.placement === targetTileId)[0];
                target.takeDamage(attackStatus[1]);
                console.log("Front Rank Target 3 current HP: ", target.currentHitPoints);
                target.checkDeathStatus();
                if (target.isAlive === false) {
                    controls.deathAnimation(targetTileId);
                }
                break;
            case "back-enemy-1-square":
                targetTileId = "#col-2-5";
                target = this.mob.backRank.filter(enemy => enemy.placement === targetTileId)[0];
                target.takeDamage(attackStatus[1]);
                console.log("Back Rank Target 1 current HP: ", target.currentHitPoints);
                target.checkDeathStatus();
                if (target.isAlive === false) {
                    controls.deathAnimation(targetTileId);
                }
                break;
            case "back-enemy-2-square":
                targetTileId = "#col-3-5";
                target = this.mob.backRank.filter(enemy => enemy.placement === targetTileId)[0];
                target.takeDamage(attackStatus[1]);
                console.log("Back Rank Target 2 current HP: ", target.currentHitPoints);
                target.checkDeathStatus();
                if (target.isAlive === false) {
                    controls.deathAnimation(targetTileId);
                }
                break;
            case "back-enemy-3-square":
                targetTileId = "#col-4-5";
                target = this.mob.backRank.filter(enemy => enemy.placement === targetTileId)[0];
                target.takeDamage(attackStatus[1]);
                console.log("Back Rank Target 3 current HP: ", target.currentHitPoints);
                target.checkDeathStatus();
                if (target.isAlive === false) {
                    controls.deathAnimation(targetTileId);
                }
                break;
        }
        controls.resetControlPanelDiv();
        this.battleOver();
        if (this.isOver) {
            setTimeout(this.endBattleMessage(true), 5000);
            return;
        }
    }
    // Method that sets the logic for the enemy turn
    enemyTurn() {
        // Determine which enemies are alive
        const frontRankAlive = this.mob.frontRank.filter(enemy => enemy.isAlive);
        const backRankAlive = this.mob.backRank.filter(enemy => enemy.isAlive);
        // alive enemies choose action
        // enemies cycle through and put that action into effect
        // display result message of that action
        // Check if the battle is over
        // Display defeat message
    }
    // Check if the battle is over and update the status of the battle if it is
    battleOver() {
        // Determine if the player is dead
        if (this.player.isAlive === false) {
            this.isOver = true;
            return;
        }
        // Determine if all the monsters in the mob are dead
        const frontRankAlive = this.mob.frontRank.some(element => element.isAlive);
        const backRankAlive = this.mob.backRank.some(element => element.isAlive);
        if (frontRankAlive === false && backRankAlive === false) {
            this.isOver = true;
            return;
        }
    }
    // Display a message to the screen when the battle is over. Take a boolean - true if player wins, false if otherwise.
    endBattleMessage(result) {
        const messageBox = controls.getMessageBox();
        if (result) {
            messageBox.innerText = "You defeated the enemies"
        } else {
            messageBox.innerText = "You died"
        }   
    }
    quitBattle() {
        //
    }
    // Method that adds the divs for the game board. Grid is 6x5 and adds a co-ordinate for each box. Grid also adds art for the enemies.
    buildBattlefield() {
        controls.createBattleFieldGrid()
        // Add the initial player art to the board
        const playerStartTile = controls.getSquare("#col-3-2");
        const playerImg = document.createElement("img")
        const playerImgAttributes = {
                    id: "player-img", 
                    src: this.player.artwork
                };
        //Set the attributes for the player
        for (const attribute in playerImgAttributes) {
            playerImg.setAttribute(`${attribute}`, `${playerImgAttributes[attribute]}`)
        }
        playerStartTile.append(playerImg);
        // Add the initial enemies to the board
        // Set the particulars about the current enemy setup
        const frontRankTiles = ["col-2-4", "col-3-4", "col-4-4"];
        const backRankTiles = ["col-2-5", "col-3-5", "col-4-5"];
        const frontRankLen = this.mob.frontRank.length;
        const backRankLen = this.mob.backRank.length;
        // Determine how many enemies in the rank and place the enemies according to this
        switch(frontRankLen) {
            case 3:
                this.mob.frontRank.forEach((enemy, index) => {
                    const enemyImg = document.createElement("img")
                    const enemyImgAttributes = {
                            id: `fr-enemy-${index + 1}-img`, 
                            src: enemy.artwork
                        };
                    enemy.placement = `#${frontRankTiles[index]}`;
                    enemy.attackButton = `front-enemy-${index + 1}-square`
                    console.log(enemy.attackButton);
                    for (const attribute in enemyImgAttributes) {
                        enemyImg.setAttribute(`${attribute}`, `${enemyImgAttributes[attribute]}`)
                    }
                    const tile = document.querySelector(`#${frontRankTiles[index]}`);
                    tile.append(enemyImg);
                })
                break;
            case 2:
                this.mob.frontRank.forEach((enemy, index) => {
                    const enemyImg = document.createElement("img")
                    const enemyImgAttributes = {
                            id: `fr-enemy-${index + 1}-img`, 
                            src: enemy.artwork
                        };
                    enemy.placement = `#${frontRankTiles[index]}`;
                    enemy.attackButton = `front-enemy-${index + 1}-square`
                    console.log(enemy.attackButton)
                    for (const attribute in enemyImgAttributes) {
                        enemyImg.setAttribute(`${attribute}`, `${enemyImgAttributes[attribute]}`)
                    }
                    const tile = document.querySelector(`#${frontRankTiles[index]}`);
                    tile.append(enemyImg);
                })
                break;
            case 1:
                const enemyImg = document.createElement("img")
                const enemyImgAttributes = {
                            id: `fr-enemy-1-img`, 
                            src: this.mob.frontRank[0].artwork
                        };
                this.mob.frontRank[0].placement = `#${frontRankTiles[1]}`;
                this.mob.frontRank[0].placement = `front-enemy-1-square`;
                console.log(this.mob.frontRank[0].placement)
                for (const attribute in enemyImgAttributes) {
                    enemyImg.setAttribute(`${attribute}`, `${enemyImgAttributes[attribute]}`)
                }
                const tile = document.querySelector(`#${frontRankTiles[1]}`);
                tile.append(enemyImg);
                break;
            case 0:
                break;
        }
        switch(backRankLen) {
            case 3:
                this.mob.backRank.forEach((enemy, index) => {
                    const enemyImg = document.createElement("img")
                    const enemyImgAttributes = {
                            id: `fr-enemy-${index + 1}-img`, 
                            src: enemy.artwork
                        };
                    enemy.placement = `#${backRankTiles[index]}`;
                    enemy.attackButton = `back-enemy-${index + 1}-square`
                    console.log(enemy.attackButton);
                    for (const attribute in enemyImgAttributes) {
                        enemyImg.setAttribute(`${attribute}`, `${enemyImgAttributes[attribute]}`)
                    }
                    const tile = document.querySelector(`#${backRankTiles[index]}`);
                    tile.append(enemyImg);
                })
                break;
            case 2:
                this.mob.backRank.forEach((enemy, index) => {
                    const enemyImg = document.createElement("img")
                    const enemyImgAttributes = {
                            id: `fr-enemy-${index + 1}-img`, 
                            src: enemy.artwork
                        };
                    enemy.placement = `#${backRankTiles[index]}`;
                    enemy.attackButton = `back-enemy-${index + 1}-square`
                    console.log(enemy.attackButton);
                    for (const attribute in enemyImgAttributes) {
                        enemyImg.setAttribute(`${attribute}`, `${enemyImgAttributes[attribute]}`)
                    }
                    const tile = document.querySelector(`#${backRankTiles[index]}`);
                    tile.append(enemyImg);
                })
                break;
            case 1:
                const enemyImg = document.createElement("img")
                const enemyImgAttributes = {
                            id: `fr-enemy-1-img`, 
                            src: this.mob.backRank[0].artwork
                        };
                this.mob.backRank[0].placement = `#${backRankTiles[1]}`;
                this.mob.frontRank[0].placement = `back-enemy-1-square`;
                console.log(this.mob.frontRank[0].placement)
                for (const attribute in enemyImgAttributes) {
                    enemyImg.setAttribute(`${attribute}`, `${enemyImgAttributes[attribute]}`)
                }
                const tile = document.querySelector(`#${backRankTiles[1]}`);
                tile.append(enemyImg);
                break;
            case 0:
                break;
        }
    }
    // Method determines the available actions of the player and add relevant buttons to the DOM for that action
    buildActionButtons() {
        const controlPanel = controls.getControlPanelDiv();
        //Create buttons to attack viable targets. Can only attack the front rank if it is still alive
        if (this.mob.frontRank.some(enemy => enemy.isAlive === true)) {
            this.mob.frontRank.forEach((enemy, index) => {
                if (enemy.isAlive) {
                    const attackButton = controls.createButton(`Attack front ${enemy.name} ${index + 1}`, `front-enemy-${index + 1}-square`);
                    controlPanel.append(attackButton);
                }
            })
        } else {
            this.mob.backRank.forEach((enemy, index) => {
                if (enemy.isAlive) {
                    const attackButton = controls.createButton(`Attack back ${enemy.name} ${index + 1}`, `back-enemy-${index + 1}-square`);
                    controlPanel.append(attackButton);
                }
            })
        }
        // Creates the button to defend
        const defendButton = controls.createButton("Defend", "defend");
        controlPanel.append(defendButton);
        // Allow the potion action if player has potions. Creates a take potion button and appends to the control panel
        if (this.player.potions > 0) {
            const potionButton = controls.createButton("Take potion", "take-potion");
            controlPanel.append(potionButton);
        }
    }
    // Method to map 
}

export { Battle };