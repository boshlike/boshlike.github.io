// Fade in
function fadeIn(targetElement, duration=2) {
    return new Promise(resolve => {
        gsap.fromTo(targetElement, {
            opacity: 0,
            ease: "power1.inOut",
        }, 
        {
            opacity: 1,
            duration: duration,
            ease: "power1.inOut",
            onComplete: resolve
        })
    })
}
// Fade out
function fadeOut(targetElement, duration=2) {
    return new Promise(resolve => {
        gsap.fromTo(targetElement, {
            opacity: 1,
            ease: "power1.inOut",
        }, 
        {
            opacity: 0,
            duration: duration,
            ease: "power1.inOut",
            onComplete: resolve
        })
    })
}
// Pulse
function pulse(targetElement) {
    return new Promise(resolve => {
        const tl = gsap.timeline({repeat: -1})
        tl.to(targetElement, {
            scale: 1.01,
            duration: 0.5,
            ease: Power0.easeNone
          })
        tl.to(targetElement, {
            scale: 0.99,
            duration: 1,
            ease: Power0.easeNone
        })
        tl.to(targetElement, {
            scale: 1,
            duration: 0.5,
            ease: Power0.easeNone
        })
        resolve();
    })
}
// Battle Animations
// Function that plays a sound in the animations
function playSound(soundAudioTag) {
    const audioElement = document.querySelector(soundAudioTag);
    audioElement.play();
}
// Player and enemy bounces
function bounce(target) {
    const rand = Math.random() * 1;
    const t1 = gsap.timeline({repeat: -1, delay: rand});
    t1.to(target, {animationTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",transform: "translate3d(0, 0, 0)" , duration: 0.2});
    t1.to(target, {animationTimingFunction: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",transform: "translate3d(0, -10px, 0) scaleY(1)" , duration: 0.2});
    t1.to(target, {animationTimingFunction: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",transform: "translate3d(0, -15px, 0) scaleY(1)" , duration: 0.2});
    t1.to(target, {animationTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",transform: "translate3d(0, 0, 0) scaleY(0.95)" , duration: 0.2});
    t1.to(target, {transform: "translate3d(0, -4px, 0) scaleY(1.02)" , duration: 0.1});
    return t1;
}
// Function that animates the message text
function updateText(targetElementAsString, text) {
    return new Promise(resolve => {
        document.querySelector(targetElementAsString).innerText = text;
        tl = gsap.timeline({onComplete: resolve()});
        tl.to(targetElementAsString, {x: 10, duration: 0.05});
        tl.to(targetElementAsString, {x: -10, duration: 0.01});
        tl.to(targetElementAsString, {x: 0, duration: 0.01});
        })
}
// Player animations
// Stab attack animation
async function stabAttackAnimation(attacker, target, isHit, startText, successFailText, isAlive, deathText) {
    return new Promise(async resolve => {
        const attackerPosition = attacker.getBoundingClientRect();
        const targetPosition = target.getBoundingClientRect();
        const battlefieldPosition = document.querySelector("#battle-container").getBoundingClientRect();
        const moveX = targetPosition.left - attackerPosition.right - 20;
        const moveY = targetPosition.top - attackerPosition.top;
        const t1 = gsap.timeline({onComplete: () => resolve()});
        t1.call(updateText, ["#message-box", startText]);
        t1.call(playSound, ["#stab-attack"]);
        t1.to(attacker, {duration: 0.2, x: -attackerPosition.left / 3}, "<+=0.2");
        t1.to(attacker, {duration: 0.3, x: moveX, y: moveY, ease: Elastic.easeOut.config(1.2, 1)}, "<+=0.2");
        if (isHit) {
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#hit"]);
            t1.to(target, {duration: 0.3, opacity: 0, repeat: 1}), "-=1";
            t1.to(target, {duration: 0.3, opacity: 1, repeat: 0});
            t1.to(attacker, {duration: 1.5, x: 0, y: 0, ease: "power2.out"}, "-=0.5");
            if (isAlive === false) {
                t1.call(playSound, ["#dead"]);
                t1.call(updateText, ["#message-box", deathText]);
                t1.to(target, {transform: "rotate3d(0, 0, 1, 90deg)", duration: 0.4}, "-=0.75");
                t1.to(target, {opacity: 0, duration: 0.2});
            }
        } else {
            t1.to(target, {x: (battlefieldPosition.right - targetPosition.right)/2, y: -15,duration: 0.1}, ">");
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#miss"]);
            t1.to(target, {x: 0, duration: 1});
            t1.to(attacker, {duration: 1.5, x: 0, ease: "power2.out", y: 0}, ">-0.7");
        }
    })
}
// Player animations
// Chop attack animation
async function chopAttackAnimation(attacker, target, isHit, startText, successFailText, isAlive, deathText, audioTag) {
    return new Promise(async resolve => {
        const attackerPosition = attacker.getBoundingClientRect();
        const targetPosition = target.getBoundingClientRect();
        const battlefieldPosition = document.querySelector("#battle-container").getBoundingClientRect();
        const moveX = targetPosition.left - attackerPosition.right;
        const moveYDestination = targetPosition.top - attackerPosition.top;
        const apexLeapY = -attackerPosition.bottom/3 * 2;
        const motionPath = {
            path: [{x:moveX/2, y:apexLeapY}, {x:moveX, y:moveYDestination}]
        };
        gsap.registerPlugin(MotionPathPlugin);
        const t1 = gsap.timeline({onComplete: () => resolve()});
        t1.call(updateText, ["#message-box", startText]);
        t1.call(playSound, [audioTag]);
        t1.to(attacker, {duration: 0.7, x: -attackerPosition.left / 3});
        t1.to(attacker, {duration: 2, motionPath: motionPath, ease: Elastic.easeOut.config(1.2, 1)});
        if (isHit) {
            t1.to(target, {duration: 0.3, opacity: 0, repeat: 1}, "-=1.5");
            t1.to(target, {duration: 0.2, opacity: 1, repeat: 0});
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#hit"], "-=1.5");
            
            t1.to(attacker, {duration: 1.5, x: 0, y: 0, ease: "power2.out"}, "-=0.5");
            if (isAlive === false) {
                t1.call(playSound, ["#dead"], "-=0.75");
                t1.call(updateText, ["#message-box", deathText]);
                t1.to(target, {transform: "rotate3d(0, 0, 1, 90deg)", duration: 0.4}, "-=0.75");
                t1.to(target, {opacity: 0, duration: 0.2});
            }
        } else {
            t1.to(target, {x: (battlefieldPosition.right - targetPosition.right)/2, y: -15,duration: 0.1}, "-=1.5");
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#miss"], "-=1.5");
            t1.to(target, {x: 0, duration: 1});
            t1.to(attacker, {duration: 1.5, x: 0, ease: "power2.out", y: 0}, ">-0.7");
        }
    })
}
// Take potion animation
function takePotionAnimation(target, text, potionId, potionStock, hitPointElement, hitPointText) {
    return new Promise(async resolve => {
        await updateText("#message-box", text);
        await updateText(potionId, potionStock);
        const t1 = gsap.timeline({onComplete: () => resolve(), repeat: 2});
        t1.call(playSound, ["#drink-health-potion"]);
        t1.to(target, {y: -10, duration: 0.1});
        t1.to(target, {y: 0, duration: 0.1});
        t1.to(target, {y: 10, duration: 0.1});
        await updateText(hitPointElement, hitPointText);
    })
}
// Defend animation
function defendAnimation(target, text, statusEffectId, statusEffectText) {
    return new Promise(async resolve => {
        await updateText("#message-box", text);
        const t1 = gsap.timeline({onComplete: () => resolve(), repeat: 2});
        t1.call(playSound("#defend-self"));
        t1.to(target, {x: -10, duration: 0.1});
        t1.to(target, {x: 0, duration: 0.1});
        t1.to(target, {x: 10, duration: 0.1});
        await updateText(statusEffectId, statusEffectText);
    })
}
// Enemy animations
function shuffleAttackAnimation(attacker, target, isHit, startText, successFailText, isAlive, deathText, playerHP, attackAudioTag) {
    return new Promise(async resolve => {
        const attackerPosition = attacker.getBoundingClientRect();
        const targetPosition = target.getBoundingClientRect();
        const battlefieldPosition = document.querySelector("#battle-container").getBoundingClientRect();
        const moveX = targetPosition.right - attackerPosition.left - 20;
        const moveY = targetPosition.top - attackerPosition.top;
        const t1 = gsap.timeline({onComplete: () => resolve()});
        t1.call(updateText, ["#message-box", startText]);
        t1.call(playSound, [attackAudioTag]);
        t1.to(attacker, {duration: 0.4, x: (battlefieldPosition.right - attackerPosition.right) / 3, ease: "steps(2)"}, "<+=0.2");
        t1.to(attacker, {duration: 0.5, x: moveX, y: moveY, ease: "steps(8)"}, "<+=0.2");
        if (isHit) {
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#hit"]);
            t1.to(target, {duration: 0.3, opacity: 0, repeat: 1}), "-=1";
            t1.to(target, {duration: 0.3, opacity: 1, repeat: 0});
            t1.call(updateText, ["#current-hit-points", playerHP]);
            t1.to(attacker, {duration: 1.8, x: 0, y: 0, ease: "steps(8)"}, "-=0.5");
            if (isAlive === false) {
                t1.call(playSound, ["#dead"]);
                t1.call(updateText, ["#message-box", deathText]);
                t1.to(target, {transform: "rotate3d(0, 0, 1, -90deg)", duration: 0.4}, "-=0.75");
                t1.to(target, {opacity: 0, duration: 0.2});
            }
        } else {
            t1.to(target, {x: (battlefieldPosition.left - targetPosition.left)/2, y: 15,duration: 0.1}, ">");
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#miss"]);
            t1.to(target, {x: 0, y: 0, duration: 1});
            t1.to(attacker, {duration: 1.8, x: 0, ease: "steps(8)", y: 0}, ">-0.7");
        }
    })
}
function slashAttackAnimation(attacker, target, isHit, startText, successFailText, isAlive, deathText, playerHP, attackAudioTag) {
    return new Promise(async resolve => {
        const attackerPosition = attacker.getBoundingClientRect();
        const targetPosition = target.getBoundingClientRect();
        const battlefieldPosition = document.querySelector("#battle-container").getBoundingClientRect();
        const moveX = targetPosition.right - attackerPosition.left - 20;
        const moveYBottom = targetPosition.bottom - attackerPosition.top;
        const moveYTop = targetPosition.top - attackerPosition.bottom;
        const t1 = gsap.timeline({onComplete: () => resolve()});
        t1.call(updateText, ["#message-box", startText]);
        t1.call(playSound, [attackAudioTag]);
        t1.to(attacker, {duration: 0.4, x: (battlefieldPosition.right - attackerPosition.right) / 3, ease: Elastic.easeOut.config(1.2, 1)}, "<+=0.2");
        t1.to(attacker, {duration: 0.5, x: moveX, y: moveYBottom, ease: Elastic.easeOut.config(1.2, 1)}, "<+=0.2");
        t1.to(attacker, {duration: 0.5, x: moveX, y: moveYTop, ease: Elastic.easeOut.config(1.2, 1)}, "<+=0.2");
        if (isHit) {
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#hit"]);
            t1.to(target, {duration: 0.3, opacity: 0, repeat: 1}), "-=1";
            t1.to(target, {duration: 0.3, opacity: 1, repeat: 0});
            t1.call(updateText, ["#current-hit-points", playerHP]);
            t1.to(attacker, {duration: 1.8, x: 0, y: 0, ease: Elastic.easeOut.config(1.2, 1)}, "-=0.5");
            if (isAlive === false) {
                t1.call(playSound, ["#dead"]);
                t1.call(updateText, ["#message-box", deathText]);
                t1.to(target, {transform: "rotate3d(0, 0, 1, -90deg)", duration: 0.4}, "-=0.75");
                t1.to(target, {opacity: 0, duration: 0.2});
            }
        } else {
            t1.to(target, {x: (battlefieldPosition.left - targetPosition.left)/2, y: 15,duration: 0.1}, ">");
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#miss"]);
            t1.to(target, {x: 0, y: 0, duration: 1});
            t1.to(attacker, {duration: 1.8, x: 0, ease: Elastic.easeOut.config(1.2, 1), y: 0}, ">-0.7");
        }
    })
}
function pounceAttackAnimation(attacker, target, isHit, startText, successFailText, isAlive, deathText, playerHP, attackAudioTag) {
    return new Promise(async resolve => {
        const attackerPosition = attacker.getBoundingClientRect();
        const targetPosition = target.getBoundingClientRect();
        const battlefieldPosition = document.querySelector("#battle-container").getBoundingClientRect();
        const moveX = targetPosition.right - attackerPosition.left - 20;
        const moveYDestination = targetPosition.top - attackerPosition.top;
        const apexLeapY = -attackerPosition.bottom/3 * 2;
        const motionPath = {
            path: [{x:moveX/2, y:apexLeapY}, {x:moveX, y:moveYDestination}]
        };
        gsap.registerPlugin(MotionPathPlugin);
        const t1 = gsap.timeline({onComplete: () => resolve()});
        t1.call(updateText, ["#message-box", startText]);
        t1.call(playSound, [attackAudioTag]);
        t1.to(attacker, {duration: 0.4, x: (battlefieldPosition.right - attackerPosition.right) / 3, ease: Elastic.easeOut.config(1.2, 1)}, "<+=0.2");
        t1.to(attacker, {duration: 1, motionPath: motionPath, ease: Elastic.easeOut.config(1.2, 1)}, "<+=0.2");
        if (isHit) {
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#hit"]);
            t1.to(target, {duration: 0.3, opacity: 0, repeat: 1}), ">-=0.5";
            t1.to(target, {duration: 0.3, opacity: 1, repeat: 0});
            t1.call(updateText, ["#current-hit-points", playerHP]);
            t1.to(attacker, {duration: 1.8, x: 0, y: 0, ease: Elastic.easeOut.config(1.2, 1)}, "-=0.5");
            if (isAlive === false) {
                t1.call(playSound, ["#dead"]);
                t1.call(updateText, ["#message-box", deathText]);
                t1.to(target, {transform: "rotate3d(0, 0, 1, -90deg)", duration: 0.4}, "-=0.75");
                t1.to(target, {opacity: 0, duration: 0.2});
            }
        } else {
            t1.to(target, {x: (battlefieldPosition.left - targetPosition.left)/2, y: 15,duration: 0.1}, ">-=0.5");
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#miss"]);
            t1.to(target, {x: 0, y: 0, duration: 1});
            t1.to(attacker, {duration: 1.8, x: 0, ease: Elastic.easeOut.config(1.2, 1), y: 0}, ">-0.7");
        }
    })
}
function drainLifeAnimation(attacker, target, isHit, startText, successFailText, isAlive, deathText, playerHP, attackAudioTag) {
    return new Promise(async resolve => {
        const attackerPosition = attacker.getBoundingClientRect();
        const targetPosition = target.getBoundingClientRect();
        const battlefieldPosition = document.querySelector("#battle-container").getBoundingClientRect();
        const spell = document.createElement("img");
        spell.setAttribute("src", "./assets/monster/doom-bolt.png");
        document.querySelector("#col-2").append(spell);
        const spellPosition = spell.getBoundingClientRect();
        gsap.set(spell, {x: attackerPosition.left - spellPosition.left, y: attackerPosition.top - spellPosition.top + 20, opacity: 0});
        const moveX = targetPosition.right - spellPosition.left;
        const t1 = gsap.timeline({onComplete: () => resolve()});
        t1.call(updateText, ["#message-box", startText]);
        t1.call(playSound, [attackAudioTag]);
        t1.to(attacker, {duration: 0.4, x: (battlefieldPosition.right - attackerPosition.right) / 3}, "<+=0.2");
        t1.to(spell, {duration: 0.6, x: moveX/2, opacity:1, ease: "expo.in"})
        t1.to(spell, {duration: 0.6, x: moveX});
        t1.to(spell, {duration: 0.3, opacity:0, onComplete: () => {spell.remove()}})
        t1.to(attacker, {duration: 0.4, x: 0}, "<+=0.1");
        if (isHit) {
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#hit"]);
            t1.to(target, {duration: 0.3, opacity: 0, repeat: 1}), "-=1.2";
            t1.to(target, {duration: 0.3, opacity: 1, repeat: 0});
            t1.call(updateText, ["#current-hit-points", playerHP]);
            if (isAlive === false) {
                t1.call(playSound, ["#dead"]);
                t1.call(updateText, ["#message-box", deathText]);
                t1.to(target, {transform: "rotate3d(0, 0, 1, -90deg)", duration: 0.4}, "-=0.75");
                t1.to(target, {opacity: 0, duration: 0.2});
            }
        } else {
            t1.to(target, {x: (battlefieldPosition.left - targetPosition.left)/2, y: 15,duration: 0.1}, ">-=0.3");
            t1.call(updateText, ["#message-box", successFailText]);
            t1.call(playSound, ["#miss"]);
            t1.to(target, {x: 0, y: 0, duration: 1});
        }
    })
}