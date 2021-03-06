class BattleEvent {
    constructor(event, battle) {
      this.event = event;
      this.battle = battle;
    }
    // Find index of action in Object's list of actions by the id that the event returns
    findAction(id) {
        const actions = this.event.currentCombatant.actions;
        let actionControlObject = "EMPTY";
        let actionIndex = ""; // Initalise the variable to hold the action control object
        actions.forEach((action, index) => {
            for (let key in action) {
                if (key === "id"){
                    if (action[key] === id) {
                        actionControlObject = action;
                        actionIndex = index;
                    }
                }
            }
        })
        return [actionControlObject, actionIndex];        
    }
    // Battle log text push
    addBattleLog(text) {
        const logBodyUl = document.querySelector("#modal-battle-log-body ul");
        const li = document.createElement("li");
        li.innerText = text;
        logBodyUl.append(li);
    }
    // Player action methods
    async defend(resolve) {
        // Get the action data object for the event and initialise the defend() method on the player
        const actionControlArr = this.findAction(this.event.action);
        const actionControlObject = actionControlArr[0];
        const actionMethod = actionControlObject.methodId;
        this.event.currentCombatant[actionMethod]();
        const statusEffect = document.createElement("li");
        statusEffect.setAttribute("id", "defend-status");
        document.querySelector("#current-status-effect").append(statusEffect);
        const playerSprite = document.querySelector("#player");
        //Handle animation
        this.battle.player.bounceTimeline.pause(0);
        await window[actionControlObject.animation](playerSprite, actionControlObject.text, "#defend-status", actionControlObject.statusOnComplete);
        this.battle.player.bounceTimeline.resume();
        this.addBattleLog( actionControlObject.text);
        resolve();
    }
    async targetSingleEnemyAttack(resolve) {
        // Get the action data object for the event and initialise the swordAttack() method on the player
        const actionControlArr = this.findAction(this.event.action);
        const actionControlObject = actionControlArr[0];
        const actionMethod = actionControlObject.methodId;
        const attackResult = this.event.currentCombatant[actionMethod]();
        const attackTarget = this.event.currentCombatantTarget;
        const playerSprite = document.querySelector("#player");
        const targetSprite = document.querySelector(`#${attackTarget.location}`);
        //Handle the state change for a hit
        if (attackResult[0] === true) {
            attackTarget.takeDamage(attackResult[1]);
            attackTarget.checkDeathStatus();
        }
        // Handle the animation
        const successFailText = attackResult[0] ? actionControlObject.success : actionControlObject.failure;
        this.battle.player.bounceTimeline.pause(0);
        await window[actionControlObject.animation](playerSprite, targetSprite, attackResult[0], actionControlObject.text, successFailText, attackTarget.isAlive, attackTarget.deathText, actionControlObject.audio);
        this.battle.player.bounceTimeline.resume();
        this.addBattleLog(actionControlObject.text);
        this.addBattleLog(successFailText);
        if (attackTarget.isAlive === false) {
            this.addBattleLog(attackTarget.deathText);
        }
        resolve();
    }
    // Take potion
    async healthPotion(resolve) {
        const actionControlArr = this.findAction(this.event.action);
        const actionControlObject = actionControlArr[0];
        const playerSprite = document.querySelector("#player");
        const lifeGained = this.battle.player.drinkPotion();
        this.battle.player.bounceTimeline.pause(0);
        await window[actionControlObject.animation](playerSprite, `${actionControlObject.text} ${lifeGained} hit points`, "#health-potions p", `${this.battle.player.potions}`, "#current-hit-points", `${this.battle.player.currentHitPoints}/${this.battle.player.totalHitPoints}`);
        this.battle.player.bounceTimeline.resume();
        this.addBattleLog(`${actionControlObject.text} ${lifeGained} hit points`);
        resolve();
    }
    // Enemy action methods
    // Enemy basic attack
    async basicAttack(resolve) {
        // Get the action data object for the event and initialise the swordAttack() method on the player
        const actionControlArr = this.findAction(this.event.action);
        const actionControlObject = actionControlArr[0];
        const actionControlIndex = actionControlArr[1];
        const actionMethod = this.event.currentCombatant.actions[actionControlIndex].action;
        const attackResult = this.event.currentCombatant[actionMethod]();
        const attackTarget = this.event.currentCombatantTarget;
        const playerSprite = document.querySelector("#player");
        const enemySprite = document.querySelector(`#${this.event.currentCombatant.location}`)
        if (attackResult[0]) {
            attackTarget.takeDamage(attackResult[1]);
            attackTarget.checkDeathStatus();
        }
        // Handle the animation
        const successFailText = attackResult[0] ? actionControlObject.success : actionControlObject.failure;
        const playerHP = `${Math.max(attackTarget.currentHitPoints, 0)}/${attackTarget.totalHitPoints}`;
        this.event.currentCombatant.bounceTimeline.pause(0);
        await window[actionControlObject.animation](enemySprite, playerSprite, attackResult[0], actionControlObject.text, successFailText, attackTarget.isAlive, attackTarget.deathText, playerHP, actionControlObject.audio);
        this.event.currentCombatant.bounceTimeline.resume();
        this.addBattleLog(actionControlObject.text);
        this.addBattleLog(successFailText);
        if (attackTarget.isAlive === false) {
            this.addBattleLog(attackTarget.deathText);
        }
        resolve()
    }
    //Start the battle event
    start(resolve) {
        const actionControlObject = this.findAction(this.event.action)[0];
        this[actionControlObject.action](resolve);
    }
}