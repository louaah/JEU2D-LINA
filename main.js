kaplay({
    width: 1000,
    height: 825,
})

// sprites 

loadSprite("bg", "assets/industrial-background.jpg")
loadSprite("beachbg", "assets/beachbg.PNG")
loadSprite("treebg", "assets/butterflybg.PNG")
loadSprite("cocoon", "assets/butterflycocoon.PNG")
loadSprite("swamp", "assets/salamanderbg.PNG")
loadSprite("body", "assets/bigcrab.PNG")
loadSprite("shell", "assets/bigshell.PNG")



const GAME_DURATION = 60

let gameState = {
    score: 0,
    startTime: 0,
}

function checkGameTimer() {
    if (time() - gameState.startTime >= GAME_DURATION) {
        go("gameover")
    }
}

function addTimerUI() {
    const timer = add([
        text("Time: 30"),
        pos(20, 20),
        fixed(),
    ])

    onUpdate(() => {
        const timeLeft = Math.max(
            0,
            Math.ceil(GAME_DURATION - (time() - gameState.startTime))
        )
        timer.text = `Time: ${timeLeft}`
    })
}


function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

//  title screen 
scene("titlescreen", () => {

    add([
        sprite("bg"),
        pos(0, 0),
    ])

    add([
        text("Metamorphosis\nPress SPACE to begin!"),
        pos(center()),
        anchor("center")
    ])

    onKeyPress("space", () => {
        gameState.score = 0
        gameState.startTime = time()
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

function randomMiniGame() {
    return choose(miniGames)
}

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

    const counterText = add([
        text("Clicks: 0 / 10"),
        pos(20, 60),
        fixed(),
    ])

    const box = add([
        sprite("cocoon"),
        scale(0.3),
        pos(center()),
        anchor("center"),
        area(),
    ])

    function completeGame() {
        gameState.score += 1
        go("minigamepicker")
    }

    box.onClick(() => {
        clickCount++
        counterText.text = `Clicks: ${clickCount} / 10`
        if (clickCount >= 10) {
            completeGame()
        }
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
        text("Match each crab to its shell!"),
        pos(width() / 2, height() * 0.10),
        anchor("center"),
        fixed(),
    ])
 
    function completeGame() {
        gameState.score += 1
        go("minigamepicker")
    }
 
    const centerX = width() / 3
    const topRowY = height() * 0.5
    const bottomRowY = height() * 0.7
    const spacing = 350
 
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
 
    onUpdate(() => {
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
        text("Grab all the food!"),
        pos(width() / 2, 60),
        anchor("center"),
        fixed(),
    ])

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
        text(`Worms: 0 / ${foodLeft}`),
        pos(20, 60),
        fixed(),
    ])

    const foods = foodPositions.map(fp => {
        return add([
            
            rect(28, 28),
            color(180, 100, 20),
            pos(fp.x, fp.y),
            anchor("center"),
            area(),
            "food",
        ])
    })

    
    onUpdate(() => {
        
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
                foodCounter.text = `Worms: ${foodPositions.length - foodLeft} / ${foodPositions.length}`
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
        sprite("bg"),   
        pos(0, 0),
    ])

    addTimerUI()

    add([
        text("Grab all the food!"),
        pos(width() / 2, 60),
        anchor("center"),
        fixed(),
    ])

    function completeGame() {
        gameState.score += 1
        go("minigamepicker")
    }

    const MOVE_SPEED = 240

    setGravity(1800)

    
    const platforms = [
       
        { x: 0,   y: 780, w: 1000, h: 20 },
        
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
        rect(44, 44),
        color(255, 150, 160),
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
        text(`Apples: 0 / ${foodLeft}`),
        pos(20, 60),
        fixed(),
    ])

    const foods = foodPositions.map(fp => {
        return add([
            circle(16),
            color(220, 40, 40),
            pos(fp.x, fp.y),
            anchor("center"),
            area(),
            "food",
        ])
    })

    onUpdate(() => {
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
                foodCounter.text = `Apples: ${foodPositions.length - foodLeft} / ${foodPositions.length}`
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
        sprite("bg"),   
        pos(0, 0),
    ])

    addTimerUI()

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
        text(`Reach ${target}°C!`),
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

    
    const mercury = add([
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
        pos(cx - 80 - BAR_W, BTN_Y - 45),
        anchor("center"),
        color(80, 120, 220),
        area(),
        fixed(),
    ])
    add([
        text("-", { size: 40 }),
        pos(cx - 80 - BAR_W, BTN_Y - 45),
        anchor("center"),
        fixed(),
    ])

    
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

    onUpdate(() => {
        const diff = Math.abs(current - target)
        const inRange = diff <= TOLERANCE

        
        tempLabel.text = `${current}°C`

        if (inRange) {
            holdTimer += dt()
            feedbackLabel.text = `Hold it! (${(HOLD_TIME - holdTimer).toFixed(1)}s)`
        } else {
            holdTimer = 0
            feedbackLabel.text = diff <= 10 ? "Getting close…" : current < target ? "Too cold! ▲" : "Too hot! ▼"
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
        sprite("bg"),
        pos(0, 0),
    ])

    add([
        text(`The end!\nScore: ${gameState.score}\nPress SPACE to go back to the title.`),
        pos(center()),
        anchor("center")
    ])

    onKeyPress("space", () => {
        go("titlescreen")
    })
})

go("titlescreen")
