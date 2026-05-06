kaplay({
    width: 1000,
    height: 825,
})

// sprites 

loadSprite("bg", "assets/page1bg.PNG")
loadSprite("beachbg", "assets/beachbg.PNG")
loadSprite("treebg", "assets/butterflybg.PNG")
loadSprite("cocoon", "assets/butterflycocoon.PNG")
loadSprite("swamp", "assets/salamanderbg.PNG")
loadSprite("body", "assets/hermitbody.PNG")
loadSprite("shell", "assets/shell.PNG")
loadSprite("larvae1", "assets/ladybug_larvae1.PNG")
loadSprite("larvae2", "assets/ladybug_larvae2.PNG")
loadSprite("bubble", "assets/bubble.PNG")
loadSprite("ladybugfood", "assets/ladybugfood.PNG")
loadSprite("bluebg", "assets/bluebg.png")
loadSprite("jellyfish1", "assets/jellyfish1.PNG")
loadSprite("jellyfish2", "assets/jellyfish2.PNG")
loadSprite("hermitfull", "assets/hermitfull.PNG")
loadSprite("butterfly", "assets/butterfly.PNG")



const GAME_DURATION = 60

let gameState = {
    score: 0,
    startTime: 0,
    lastMinigame: null,
    playedMinigames: new Set(),
}

function checkGameTimer() {
    if (time() - gameState.startTime >= GAME_DURATION) {
        go("gameover")
    }
}

function addTimerUI() {
    const timer = add([
        text("Temps Restant: 30"),
        pos(20, 20),
        fixed(),
    ])

    onUpdate(() => {
        const timeLeft = Math.max(
            0,
            Math.ceil(GAME_DURATION - (time() - gameState.startTime))
        )
        timer.text = `Temps restant: ${timeLeft}`
    })
}


function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

// pas de repetitios
function randomMiniGame() {
    const available = miniGames.filter(g => g !== gameState.lastMinigame)
    const chosen = choose(available)
    gameState.lastMinigame = chosen
    return chosen
}
 
// Popup 8s
function showInstructionPopup(minigameName, instructionText, onDone) {
    if (gameState.playedMinigames.has(minigameName)) {
        //skip popup
        onDone()
        return
    }
    gameState.playedMinigames.add(minigameName)
 
    const POPUP_DURATION = 8
 
    // Dim overlay
    const overlay = add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0),
        opacity(0.6),
        fixed(),
        z(100),
    ])
 
    // Popup box
    const boxW = 600
    const boxH = 220
    const box = add([
        rect(boxW, boxH, { radius: 16 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(240, 240, 240),
        fixed(),
        z(101),
    ])
 
    // Instruction text
    const instrText = add([
        text(instructionText, { size: 22, width: 540, align: "center" }),
        pos(width() / 2, height() / 2 - 30),
        anchor("center"),
        color(30, 30, 30),
        fixed(),
        z(102),
    ])
 
    // space skip
    const skipText = add([
        text("Appuie sur ESPACE pour sauter cette fenêtre...", { size: 16 }),
        pos(width() / 2, height() / 2 + 70),
        anchor("center"),
        color(100, 100, 100),
        fixed(),
        z(102),
    ])
 
    // Countdown
    const countdownText = add([
        text(`Commance dans ${POPUP_DURATION}secondes…`, { size: 16 }),
        pos(width() / 2, height() / 2 + 95),
        anchor("center"),
        color(150, 100, 50),
        fixed(),
        z(102),
    ])
 
    let popupStart = time()
    let popupPauseStart = time()
    let dismissed = false
 
    function dismiss() {
        if (dismissed) return
        dismissed = true
        gameState.startTime += time() - popupPauseStart 
        destroy(overlay)
        destroy(box)
        destroy(instrText)
        destroy(skipText)
        destroy(countdownText)
        onDone()
    }
 
    // space skips popup
    const skipHandler = onKeyPress("space", () => {
        skipHandler.cancel()
        dismiss()
    })
 
    // dismiss
    const timerHandler = onUpdate(() => {
        const elapsed = time() - popupStart
        const left = Math.max(0, Math.ceil(POPUP_DURATION - elapsed))
        countdownText.text = `Commence dans ${left}secondes…`
        if (elapsed >= POPUP_DURATION) {
            timerHandler.cancel()
            skipHandler.cancel()
            dismiss()
        }
    })
}
 
// mediation (à ajouter)
const minigameInstructions = {
    minigame1: "Le savait-tu? Les papillions doivent se libérer de leur concons pour se metamorphoser! Utilise la souris pour liberer le papillion.",
    minigame2: "Le savait-tu? Quand les bernad-l'ermites grandissent, ils doivent changer de coquille! Utilise la souris pour amener les corps des crabes a leur coquille correspondante.",
    minigame3: "Le savait-tu? Quand un salamndre devient adulte, ses poumons se developpe en avalant de l'air. Utilise les flèches pour attraper toute les bulles d'air! ",
    minigame4: "Le savait-tu? Pour qu'un bébé coccinelle grandisse, il faut qu'il mange beaucoup, et très vite! Utilise toute les flèches pour attraper la nourriture.",
    minigame5: "Le savait-tu? Pour qu'une méduse grandisse, il faut que la température de l'eau change. Utilise les boutons + et - pour arriver à la bonne température d'eau!",
}

//  title screen 
scene("titlescreen", () => {

    add([
        sprite("bg"),
        pos(0, 0),
    ])


    onKeyPress("space", () => {
        gameState.score = 0
        gameState.startTime = time()
        gameState.lastMinigame = null
        gameState.playedMinigames = new Set()
        go("minigamepicker")
    })
})

//
const miniGames = [
    "minigame1",
    "minigame2",
    "minigame3",
    "minigame4",
    "minigame5"
]

scene("minigamepicker", () => {

    add([
        sprite("bg"),
        pos(0, 0),
    ])

    if (time() - gameState.startTime >= GAME_DURATION) {
        go("gameover")
        return
    }

    go(randomMiniGame())
})

// minigame 1
scene("minigame1", () => {

    add([
        sprite("treebg"),
        pos(0, 0),
        scale(0.23)
    ])

    addTimerUI()

    let clickCount = 0
    let gameActive = false

    const counterText = add([
        text("Cliques: 0 / 10"),
        pos(20, 60),
        fixed(),
    ])

    const box = add([
        sprite("cocoon"),
        scale(0.2),
        pos(center()),
        anchor("center"),
        area(),
    ])

    function completeGame() {
        box.use(sprite("butterfly"))
        box.use(scale(0.2))

        let flyTime = 0
        const flyHandler = onUpdate (() => {
            flyTime += dt()
            box.pos.x += 180 * dt()
            box.angle = Math.sin(flyTime * 8) * 12

            if (box.pos.y < -100 || box.pos.x > width() + 100) {
                flyHandler.cancel()
                gameState.score += 1
                go("minigamepicker")
            }
        })
    }

    box.onClick(() => {
        clickCount++
        counterText.text = `Cliques: ${clickCount} / 10`
        if (clickCount >= 10) {
            completeGame()
        }
    })

    showInstructionPopup("minigame1", minigameInstructions["minigame1"], () => {
        gameActive = true
    })

    onUpdate(() => {
        checkGameTimer()
    })
})

// minigame2
scene("minigame2", () => {
 
    add([
        sprite("beachbg"),
        pos(0, 0),
        scale(0.23)
    ])
 
    addTimerUI()
 
    add([
        text("Associe les bons corps au bonnes coquilles!"),
        pos(width() / 2, height() * 0.10),
        anchor("center"),
        fixed(),
    ])

    let gameActive = false 
 
    function completeGame() {
        gameState.score += 1
        go("minigamepicker")
    }
 
    const centerX = width() / 2
    const topRowY = height() * 0.5
    const bottomRowY = height() * 0.7
    const spacing = 300
 
    let matchCount = 0
    let selectedBody = null
 
    const sizeConfigs = [
        { sizeValue: 0, scaleValue: 0.12 },
        { sizeValue: 1, scaleValue: 0.18 },
        { sizeValue: 2, scaleValue: 0.24 },
    ]
 
    const bodyIndices = shuffleArray([0, 1, 2])
 
    const shells = []
    const bodies = []
 
    sizeConfigs.forEach((cfg, i) => {
        const shell = add([
            sprite("shell"),
            pos(centerX + (i - 1) * spacing, bottomRowY),
            anchor("center"),
            area(),
            scale(cfg.scaleValue),
            { sizeValue: cfg.sizeValue, filled: false }
        ])
        shells.push(shell)
    })
 
    sizeConfigs.forEach((cfg, i) => {
        const posIndex = bodyIndices[i]
        const spawnPos = vec2(centerX + (posIndex - 1) * spacing, topRowY)
        const body = add([
            sprite("body"),
            pos(spawnPos),
            anchor("center"),
            area(),
            scale(cfg.scaleValue),
            {
                sizeValue: cfg.sizeValue,
                dragging: false,
                offset: vec2(0, 0),
                placed: false,
                originalPos: spawnPos,
            }
        ])
        bodies.push(body)
    })
 
    onMousePress(() => {
        if (!gameActive) return
        for (let i = bodies.length - 1; i >= 0; i--) {
            const body = bodies[i]
            if (body.isHovering() && !body.placed) {
                selectedBody = body
                body.dragging = true
                body.offset = mousePos().sub(body.pos)
                break
            }
        }
    })
 
    onMouseRelease(() => {
        if (!selectedBody) return
 
        selectedBody.dragging = false
        let matched = false
 
        shells.forEach(shell => {
            if (
                !shell.filled &&
                selectedBody.isOverlapping(shell) &&
                selectedBody.sizeValue === shell.sizeValue
            ) {
                selectedBody.pos = shell.pos
                selectedBody.placed = true
                shell.filled = true
                matched = true
                matchCount++

                selectedBody.use(sprite("hermitfull"))

                shell.hidden = true
 
                if (matchCount === sizeConfigs.length) {
                    completeGame()
                }
            }
        })
 
        if (!matched) {
            selectedBody.pos = selectedBody.originalPos
        }
 
        selectedBody = null
    })

    showInstructionPopup("minigame2", minigameInstructions["minigame2"], () => {
        gameActive = true
    })
 
    onUpdate(() => {
        if (!gameActive) return
        if (selectedBody && selectedBody.dragging && !selectedBody.placed) {
            selectedBody.pos = mousePos().sub(selectedBody.offset)
        }
        checkGameTimer()
    })
})

// minigame3
scene("minigame3", () => {

    // background 
    add([
        sprite("swamp"),   
        pos(0, 0),
        scale(0.23)
    ])

    addTimerUI()

    add([
        text("Attrape toute les bulles!"),
        pos(width() / 2, 60),
        anchor("center"),
        fixed(),
    ])

    let gameActive = false

    function completeGame() {
        gameState.score += 1
        go("minigamepicker")
    }

    
    const MOVE_SPEED   = 280

    setGravity(1800)

    
    const platforms = [
        // ground
        { x: 0,   y: 690, w: 1000, h: 20 },
        // floating platforms
        { x: 100, y: 620, w: 220,  h: 18 },
        { x: 420, y: 520, w: 220,  h: 18 },
        { x: 700, y: 400, w: 220,  h: 18 },
        { x: 200, y: 310, w: 180,  h: 18 },
        { x: 580, y: 240, w: 200,  h: 18 },
    ]

    platforms.forEach(p => {
        add([
            rect(p.w, p.h),
            pos(p.x, p.y),
            color(120, 80, 40),
            area(),
            body({ isStatic: true }),
        ])
    })

    
    const player = add([
        rect(40, 40),
        color(255, 200, 50),
        pos(80, 640),
        anchor("center"),
        area(),
        body({ jumpForce: 900 }),
    ])

   
    const foodPositions = [
        { x: 200, y: 595 },
        { x: 530, y: 495 },
        { x: 810, y: 375 },
        { x: 280, y: 285 },
        { x: 675, y: 215 },
    ]

    let foodLeft = foodPositions.length

    const foodCounter = add([
        text(`bulles: 0 / ${foodLeft}`),
        pos(20, 60),
        fixed(),
    ])

    const foods = foodPositions.map(fp => {
        return add([
            sprite("bubble"),
            scale(0.1),
            pos(fp.x, fp.y),
            anchor("center"),
            area(),
            "food",
        ])
    })

    showInstructionPopup("minigame3", minigameInstructions["minigame3"], () => {
        gameActive = true
    })

    onUpdate(() => {
        if (!gameActive) return
        
        if (isKeyDown("left"))  player.move(-MOVE_SPEED, 0)
        if (isKeyDown("right")) player.move(MOVE_SPEED, 0)

        
        if (isKeyPressed("space") || isKeyPressed("up")) {
            if (player.isGrounded()) {
                player.jump()
            }
        }

        
        foods.forEach((food, i) => {
            if (food && food.exists() && player.isOverlapping(food)) {
                destroy(food)
                foods[i] = null
                foodLeft--
                foodCounter.text = `bubbles: ${foodPositions.length - foodLeft} / ${foodPositions.length}`
                if (foodLeft <= 0) completeGame()
            }
        })

        checkGameTimer()
    })
})

// minigame 4
scene("minigame4", () => {

    // background 
    add([
        sprite("bluebg"),   
        pos(0, 0),
    ])

    addTimerUI()

    add([
        text("Attrape toute la nourriture!"),
        pos(width() / 2, 60),
        anchor("center"),
        fixed(),
    ])

    let gameActive = false

    function completeGame() {
        gameState.score += 1
        go("minigamepicker")
    }

    const MOVE_SPEED = 240

    setGravity(1800)

    
    const platforms = [
       //ground
        { x: 0,   y: 780, w: 1000, h: 20 },
        //platforms
        { x: 50,  y: 650, w: 200,  h: 18 },
        { x: 320, y: 560, w: 200,  h: 18 },
        { x: 600, y: 470, w: 200,  h: 18 },
        { x: 350, y: 360, w: 280,  h: 18 },
        { x: 100, y: 470, w: 160,  h: 18 },
    ]

    platforms.forEach(p => {
        add([
            rect(p.w, p.h),
            pos(p.x, p.y),
            color(80, 160, 80),
            area(),
            body({ isStatic: true }),
        ])
    })

    
    const player = add([
        sprite("larvae1"),
        scale(0.1),        
        pos(80, 640),
        anchor("center"),
        area(),
        body({ jumpForce: 900 }),
    ])

    
    const foodPositions = [
        { x: 140,  y: 625 },
        { x: 415,  y: 535 },
        { x: 695,  y: 445 },
        { x: 480,  y: 335 },
        { x: 175,  y: 445 },
    ]

    let foodLeft = foodPositions.length

    const foodCounter = add([
        text(`nourriture: 0 / ${foodLeft}`),
        pos(20, 60),
        fixed(),
    ])

    const foods = foodPositions.map(fp => {
        return add([
            sprite("ladybugfood"),
            scale(0.1),        
            pos(fp.x, fp.y),
            anchor("center"),
            area(),
            "food",
        ])
    })

    showInstructionPopup("minigame4", minigameInstructions["minigame4"], () => {
        gameActive = true
    })

    onUpdate(() => {
        if (!gameActive) return

        if (isKeyDown("left")) { 
            player.move(-MOVE_SPEED, 0)
            player.flipX = true 
        }

        if (isKeyDown("right")) { 
            player.move(MOVE_SPEED, 0)
            player.flipX = false 
        }

        if (!player.isGrounded()) {
            player.use(sprite("larvae2"))
        } else {
            player.use(sprite("larvae1"))
        }

        if (isKeyPressed("space") || isKeyPressed("up")) {
            if (player.isGrounded()) {
                player.jump()
            }
        }

        foods.forEach((food, i) => {
            if (food && food.exists() && player.isOverlapping(food)) {
                destroy(food)
                foods[i] = null
                foodLeft--
                foodCounter.text = `food: ${foodPositions.length - foodLeft} / ${foodPositions.length}`
                if (foodLeft <= 0) completeGame()
            }
        })

        checkGameTimer()
    })
})

// minigame5
scene("minigame5", () => {

    // background 
    add([
        sprite("bluebg"),   
        pos(0, 0),
    ])

    addTimerUI()

    let gameActive = false

    function completeGame() {
        gameState.score += 1
        go("minigamepicker")
    }

    
    const MIN_TEMP    = 0
    const MAX_TEMP    = 100
    const TOLERANCE   = 2   
    const HOLD_TIME   = 1.5 

    
    const target = Math.floor(Math.random() * 71) + 15

    let current  = Math.floor(Math.random() * 71) + 15
    
    while (Math.abs(current - target) <= TOLERANCE) {
        current = Math.floor(Math.random() * 71) + 15
    }

    let holdTimer = 0
    let lastChange = 0
    const CLICK_COOLDOWN = 0.12  

    
    const cx = width() / 2

    
    add([
        text(`Arrive à ${target}°C!`),
        pos(cx, 90),
        anchor("center"),
        fixed(),
    ])

    
    const BAR_X = cx - 30
    const BAR_TOP = 160
    const BAR_H   = 480
    const BAR_W   = 60

    add([
        rect(BAR_W, BAR_H),
        pos(BAR_X, BAR_TOP),
        color(180, 180, 180),
        fixed(),
    ])

    
    const mercure = add([
        pos(BAR_X, BAR_TOP),
        fixed(),
        {
            draw() {
                const fillH = (current / MAX_TEMP) * BAR_H
                const r = current < 33 ? 50  : current < 66 ? 255 : 220
                const g = current < 33 ? 120 : current < 66 ? 200 : 40
                const b = current < 33 ? 220 : current < 66 ? 50  : 40
                drawRect({
                    pos: vec2(0, BAR_H - fillH),
                    width: BAR_W,
                    height: fillH,
                    color: rgb(r, g, b),
                })
            }
        }
    ])

    
    const targetY = BAR_TOP + BAR_H - (target / MAX_TEMP) * BAR_H
    add([
        rect(BAR_W + 20, 4),
        pos(BAR_X - 10, targetY),
        color(255, 220, 0),
        fixed(),
    ])
    add([
        text(`${target}°`, { size: 18 }),
        pos(BAR_X + BAR_W + 18, targetY),
        anchor("left"),
        color(255, 220, 0),
        fixed(),
    ])

    
    const tempLabel = add([
        text(`${current}°C`),
        pos(cx, BAR_TOP + BAR_H + 30),
        anchor("center"),
        fixed(),
    ])

    
    const feedbackLabel = add([
        text(""),
        pos(cx, BAR_TOP + BAR_H + 65),
        anchor("center"),
        fixed(),
    ])

    
    const PROG_W = 200
    const progressBg = add([
        rect(PROG_W, 22),
        pos(cx - PROG_W / 2, BAR_TOP + BAR_H + 95),
        color(60, 60, 60),
        fixed(),
    ])
    const progressFill = add([
        rect(0, 22),
        pos(cx - PROG_W / 2, BAR_TOP + BAR_H + 95),
        color(80, 200, 80),
        fixed(),
    ])

    
    const BTN_Y = BAR_TOP + BAR_H / 2

    const btnPlus = add([
        rect(70, 70),
        pos(cx + 80, BTN_Y - 45),
        anchor("center"),
        color(220, 80, 80),
        area(),
        fixed(),
    ])
    add([
        text("+", { size: 40 }),
        pos(cx + 80, BTN_Y - 45),
        anchor("center"),
        fixed(),
    ])

    const btnMinus = add([
        rect(70, 70),
        pos(cx - 30 - BAR_W, BTN_Y - 45),
        anchor("center"),
        color(80, 120, 220),
        area(),
        fixed(),
    ])
    add([
        text("-", { size: 40 }),
        pos(cx - 30 - BAR_W, BTN_Y - 45),
        anchor("center"),
        fixed(),
    ])

    const JELLY_SCALE = 0.12   
    const JELLY_BOB   = 18     
    const JELLY_SPEED = 1.2    
 
    
    const jellyLeft = [
        { baseY: BAR_TOP + 80,  phase: 0    },
        { baseY: BAR_TOP + 260, phase: 1.5  },
        { baseY: BAR_TOP + 440, phase: 0.8  },
    ]
    
    const jellyRight = [
        { baseY: BAR_TOP + 160, phase: 1.0  },
        { baseY: BAR_TOP + 340, phase: 0.3  },
        { baseY: BAR_TOP + 500, phase: 1.8  },
    ]
 
    const LEFT_X  = BAR_X - 130
    const RIGHT_X = BAR_X + BAR_W + 130
 
    function makeJellyfish(x, baseY, phase) {
        const j1 = add([
            sprite("jellyfish1"),
            pos(x, baseY),
            anchor("center"),
            scale(JELLY_SCALE),
            fixed(),
            z(1),
        ])
        const j2 = add([
            sprite("jellyfish2"),
            pos(x, baseY),
            anchor("center"),
            scale(JELLY_SCALE),
            fixed(),
            z(1),
        ])
        j2.hidden = true
        return { j1, j2, baseY, phase, frameTimer: 0, showingFirst: true }
    }
 
    const jellies = []
    jellyLeft.forEach(cfg  => jellies.push(makeJellyfish(LEFT_X,  cfg.baseY, cfg.phase)))
    jellyRight.forEach(cfg => jellies.push(makeJellyfish(RIGHT_X, cfg.baseY, cfg.phase)))

    btnPlus.onClick(() => {
        if (time() - lastChange < CLICK_COOLDOWN) return
        current = Math.min(MAX_TEMP, current + 1)
        lastChange = time()
    })

    btnMinus.onClick(() => {
        if (time() - lastChange < CLICK_COOLDOWN) return
        current = Math.max(MIN_TEMP, current - 1)
        lastChange = time()
    })

    
    onKeyPress("up",   () => { current = Math.min(MAX_TEMP, current + 1) })
    onKeyPress("down", () => { current = Math.max(MIN_TEMP, current - 1) })

    showInstructionPopup("minigame5", minigameInstructions["minigame5"], () => {
        gameActive = true
    })

    onUpdate(() => {
        
        jellies.forEach(jelly => {
            const bobY = jelly.baseY + Math.sin(time() * JELLY_SPEED + jelly.phase) * JELLY_BOB
            jelly.j1.pos.y = bobY
            jelly.j2.pos.y = bobY

            jelly.frameTimer += dt()
            if (jelly.frameTimer >= 0.5) {
                jelly.frameTimer = 0
                jelly.showingFirst = !jelly.showingFirst
                jelly.j1.hidden = !jelly.showingFirst
                jelly.j2.hidden =  jelly.showingFirst
            }
        })
 
        if (!gameActive) return

        const diff = Math.abs(current - target)
        const inRange = diff <= TOLERANCE

        
        tempLabel.text = `${current}°C`

        if (inRange) {
            holdTimer += dt()
            feedbackLabel.text = `Reste-là! (${(HOLD_TIME - holdTimer).toFixed(1)}s)`
        } else {
            holdTimer = 0
            feedbackLabel.text = diff <= 10 ? "Tu t'y approche…" : current < target ? "Trop froid! ▲" : "Trop chaud! ▼"
        }

        // progress bar
        progressFill.width = PROG_W * Math.min(holdTimer / HOLD_TIME, 1)

        if (holdTimer >= HOLD_TIME) {
            completeGame()
        }

        checkGameTimer()
    })
})

// gameover
scene("gameover", () => {

    add([
        sprite("bluebg"),
        pos(0, 0),
    ])

    add([
        text(`Fin!\nScore: ${gameState.score}\nAppuie sur ESPACE pour\nrevenir à la page de titre.`),
        pos(center()),
        anchor("center")
    ])

    onKeyPress("space", () => {
        go("titlescreen")
    })
})

go("titlescreen")
