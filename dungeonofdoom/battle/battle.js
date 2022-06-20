// Initiate a battle class. This will encapsulate all logic around a battle.
class Battle {
    constructor(player, enemy1, enemy2, enemy3) {
        this.player = player; //The current instance of the player object within Game
        this.enemies = [enemy1, enemy2, enemy3];
        this.enemy1 = this.enemies[0];
        this.enemy2 = this.enemies[1];
        this.enemy3 = this.enemies[2];
        this.isOver = false;
    }
    // The below method is called to launch a new battle and run the whole logic for the battle.
    start() {
        this.buildBattlefield();
        this.battleTurn = new BattleTurn ({
            battle: this,
            onNewEvent: event => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(event, this);
                    battleEvent.start(resolve);
                })
            }
    })
        this.battleTurn.start();
    }
    quitBattle() {
        //
    }
    
    // Method that adds the divs for the game board. Grid is 6x5 and adds a co-ordinate for each box. Grid also adds art for the enemies.
    buildBattlefield() {
        const playScreen = document.querySelector("#play-screen");
        // Create the bare skeleton of the battle screen
        playScreen.innerHTML = `
            <header class="row mb-3 mx-3">
                <h3>Some battle controls go here</h3>
            </header>
            <main>
                <div id="battle-container" class="row m-3 text-center container">
                </div>
                <div class="row m-3 text-center">
                    <h3 id="message-box"></h3>
                </div>
                <div class="row">
                    <div class="col m-3" id="status-panel">
                        <h2 class="text-center">Player Status</h2>
                        <div class="row">
                            <h3>Current Hit Points</h3>
                            <h4 id="current-hit-points"></h4>
                        </div>

                        <div class="row">
                            <h3>Status effects</h3>
                            <ul id="current-status-effect"></ul>
                        </div>

                        <div class="row">
                            <h3>Player Inventory</h3>
                            <ul id="inventory"></ul>
                        </div>

                    </div>
                    <div class="col m-3" id="control-panel">
                        <h2 class="text-center">Actions Pane<h2>
                        <div id="buttons-panel">
                            <div class="row justify-content-center text-center">

                                <div class="btn-group btn-group-sm col-4 d-inline-block my-1" role="group" aria-label="First group" id="attack-buttons">
                                <h4>Attack actions</h4>
                                </div>

                                <div class="btn-group btn-group-sm col-4 d-inline-block my-1" role="group" aria-label="Second group" id="ability-buttons">
                                <h4>Abilities</h4>
                                </div>

                                <div class="btn-group btn-group-sm col-4 d-inline-block my-1" role="group" aria-label="Third group" id="consumable-buttons">
                                <h4>Consumables</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>`

        // Create the 5 rows with 3 columns and append them to the battle container
        const battleContainer = document.querySelector("#battle-container");
        for (let i = 1; i <= 5; i++) {
            const rowDiv = document.createElement("div");
            const rowDivAttributes = {
                        id: `row-${i}`,
                        class: "row battlefield-row"
                    };
            battleContainer.append(rowDiv);
            // Set the attributes for the rows
            for (const attribute in rowDivAttributes) {
                rowDiv.setAttribute(`${attribute}`, `${rowDivAttributes[attribute]}`);
            }
            // BUild the 3 columns, set their attributes and append to the row
            for (let j = 1; j <= 3; j++) {
                const colDiv = document.createElement("div");
                const colDivAttributes = {
                        id: `col-${i}-${j}`,
                        class: "col pt-3 pb-3 tile"
                    };
                //Set the attributes for the columns
                for (const attribute in colDivAttributes) {
                    colDiv.setAttribute(`${attribute}`, `${colDivAttributes[attribute]}`)
                }
                //Append the column to the row
                rowDiv.append(colDiv);
            }
        }
        // Add the player image to the battlefield
        const playerTile = document.querySelector("#col-3-1");
        const playerSprite = document.createElement("img");
        playerSprite.setAttribute("src", this.player.artwork);
        playerSprite.setAttribute("class", "sprite");
        playerSprite.setAttribute("id", "player");
        playerTile.append(playerSprite);
        // Add the enemies to the the battlefield
        const enemyTiles = ["#col-2-3", "#col-3-3", "#col-4-3"];
        for (let i = 0, len = enemyTiles.length; i < len; i++) {
            const enemyTile = document.querySelector(enemyTiles[i]);
            const enemy = this.enemies[i];
            // Create enemy health indicators for testing
            const enemyHealth = document.createElement("p");
            enemyHealth.innerText = `${enemy.currentHitPoints}/${enemy.totalHitPoints}`
            enemyHealth.setAttribute("class", `enemy-health`);
            enemyHealth.setAttribute("id", `enemy-health-${i + 1}`);
            enemy.p = `enemy-health-${i + 1}`;
            //
            enemyTile.append(enemyHealth);
            const enemySprite = document.createElement("img");
            enemySprite.setAttribute("src", enemy.artwork);
            enemySprite.setAttribute("class", "sprite");
            enemySprite.setAttribute("id", `enemy-${i + 1}`);
            enemy.location = `enemy-${i + 1}`;
            enemyTile.append(enemySprite);
        }
        // Add player HP
        const hpElement = document.querySelector("#current-hit-points");
        hpElement.innerText = `${this.player.currentHitPoints}/${this.player.totalHitPoints}`;
        //Add player available inventory
        const inventory = document.querySelector("#inventory");
        const liElement = document.createElement("li")
        liElement.setAttribute("id", "health-potions")
        liElement.innerHTML = `
            <img src="./assets/consumables/ruby.png">
            ${this.player.potions}
        `
        inventory.append(liElement);
    }
}

const battle = new Battle(new Player, new Skeleton, new Skeleton, new Skeleton);
battle.start();