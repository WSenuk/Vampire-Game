let scene = document.querySelector("#scene")
let instruction = document.querySelector("#instruction")
let result = document.querySelector("#result")
let flash = document.querySelector("#death-flash")
let killsText = document.querySelector("#kills")

let vampire = ""
let looking = "front"
let dead = false
let kills = 0
let shootTime = null

function playScream(side) {
  let audio = new Audio("audio/vampire-scream.mp3")
  let ctx = new (window.AudioContext || window.webkitAudioContext)()
  let src = ctx.createMediaElementSource(audio)
  let pan = ctx.createStereoPanner()

  if (side === "left") pan.pan.value = -1
  else if (side === "right") pan.pan.value = 1
  else pan.pan.value = 0

  src.connect(pan).connect(ctx.destination)
  audio.play()
}

function start() {
  dead = false
  looking = "front"
  killsText.textContent = "Kills: " + kills
  result.textContent = ""
  instruction.textContent = "You hear something..."
  scene.src = "images/frontempty.png"

  let sides = ["left", "right", "front"]
  vampire = sides[Math.floor(Math.random() * sides.length)]

  setTimeout(function () {
    playScream(vampire)

    if (vampire === "left") scene.src = "images/vampireleft.png"
    else if (vampire === "right") scene.src = "images/vampireright.png"
    else scene.src = "images/vampirefront.png"

    instruction.textContent = "It's here..."

    shootTime = setTimeout(function () {
      if (!dead) {
        new Audio("audio/player-scream.mp3").play()
        result.className = "result-message fail"
        result.textContent = "The vampire got you!"
        end()
      }
    }, 3000)
  }, 2000)

  document.addEventListener("keydown", press)
}

function press(e) {
  e.preventDefault()

  if (dead && e.key === "Enter") {
    document.removeEventListener("keydown", press)
    start()
    return
  }

  if (e.key === "ArrowLeft") {
    looking = "left"
    scene.src = "images/leftempty.png"
    instruction.textContent = "You face LEFT..."
  } else if (e.key === "ArrowRight") {
    looking = "right"
    scene.src = "images/rightempty.png"
    instruction.textContent = "You face RIGHT..."
  } else if (e.key === "ArrowDown") {
    looking = "front"
    scene.src = "images/frontempty.png"
    instruction.textContent = "You face FRONT..."
  } else if (e.key === " ") {
    fire()
  }
}

function fire() {
  clearTimeout(shootTime)
  new Audio("audio/gunshot.mp3").play()

  if (looking === vampire) {
    kills += 1
    killsText.textContent = "Kills: " + kills
    result.className = "result-message success"
    result.textContent = "✅ You shot the vampire from the " + vampire.toUpperCase() + "!"

    if (looking === "left") scene.src = "images/deadvampireleft.png"
    else if (looking === "right") scene.src = "images/deadvampireright.png"
    else scene.src = "images/deadvampirefront.png"

    document.removeEventListener("keydown", press)
    setTimeout(start, 2000)
  } else {
    result.className = "result-message fail"
    result.textContent = "You turned " + looking.toUpperCase() + ", but it came from the " + vampire.toUpperCase() + "..."
    new Audio("audio/player-scream.mp3").play()
    end()
  }
}

function end() {
  dead = true
  kills = 0
  killsText.textContent = "Kills: 0"
  instruction.textContent = "You died. Press ENTER to try again."

  document.removeEventListener("keydown", press)
  document.addEventListener("keydown", press)

  flash.style.opacity = "1"
  setTimeout(() => flash.style.opacity = "0", 400)
}

window.addEventListener("load", start)
