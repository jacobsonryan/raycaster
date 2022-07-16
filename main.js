const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const mapWidth = 24
const mapHeight = 24
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const map = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]

let player = {
	posX: 22,
	posY: 12,
	dirX: -1,
	dirY: 0
}

let	posX = 22
let posY = 12
let dirX = -1
let dirY = 0
let planeX = 0
let planeY = 0.90

let arrowLeft = false
let arrowRight = false
let arrowUp = false
let arrowDown = false
let frameTime, oldTime, fps


const main = () => {
	for(let x = 0; x < canvas.width; x++) {
		let cameraX = 2 * x / canvas.width - 1
		let rayDirX = player.dirX + planeX * cameraX
		let rayDirY = player.dirY + planeY * cameraX
		let mapX = Math.floor(player.posX)
		let mapY = Math.floor(player.posY) 
		let sideDistX, sideDistY
		let deltaDistX = (rayDirX == 0) ? 1e30 : Math.abs(1 / rayDirX)
		let deltaDistY = (rayDirY == 0) ? 1e30 : Math.abs(1 / rayDirY)
		let perpWallDist
		let stepX, stepY
		let hit = 0
		let side
		if(rayDirX < 0) {
			stepX = -1
			sideDistX = (player.posX - mapX) * deltaDistX
		} else {
			stepX = 1
			sideDistX = (mapX + 1.0 - player.posX) * deltaDistX
		}
		if(rayDirY < 0) {
			stepY = -1
			sideDistY = (player.posY - mapY) * deltaDistY
		} else {
			stepY = 1
			sideDistY = (mapY + 1.0 - player.posY) * deltaDistY
		}

		while(hit == 0) {
			if(sideDistX < sideDistY) {
				sideDistX += deltaDistX;
				mapX += stepX;
				side = 0;
			} else {
					sideDistY += deltaDistY;
					mapY += stepY;
					side = 1;
			}
			if (map[Math.floor(mapX)][Math.floor(mapY)] > 0){
				hit = 1
			}
		}

		if(side == 0) {
			perpWallDist = (sideDistX - deltaDistX)
		} else {
			perpWallDist = (sideDistY - deltaDistY)
		}

		let lineHeight = (canvas.height / perpWallDist)
		let drawStart = -lineHeight / 2 + canvas.height / 2
		if(drawStart < 0) drawStart = 0
		let drawEnd = lineHeight / 2 + canvas.height / 2
		if(drawEnd >= canvas.height) drawEnd = canvas.height - 1

		let color = {
			default: "#bf0000",
			shade: "#820000"
		}

		ctx.fillStyle = "#292929"
		ctx.fillRect(x, drawStart, 1, lineHeight - canvas.height)
		ctx.fillStyle = "#a3a3a3"
		ctx.fillRect(x, drawStart, 1, lineHeight + drawEnd)

		if(side == 1) {
			ctx.fillStyle = color.shade
		} else {
			ctx.fillStyle = color.default
		}
		ctx.fillRect(x, drawStart, 1, lineHeight)
	}
	let moveSpeed = frameTime * 5.0
	let rotSpeed = frameTime * 3.0
	let fps = (1 / frameTime) 
	ctx.font = "20px Comic Sans MS"
	ctx.fillStyle = "white"
	ctx.fillText(fps, 5, 20);

	if(arrowUp) {
		if(map[Math.floor(player.posX + player.dirX * moveSpeed)][Math.floor(player.posY)] == false) player.posX += player.dirX * moveSpeed 	
		if(map[Math.floor(player.posX)][Math.floor(player.posY + player.dirY * moveSpeed)] == false) player.posY += player.dirY * moveSpeed
	} 
	if(arrowDown) {
		if(map[Math.floor(player.posX - player.dirX * moveSpeed)][Math.floor(player.posY)] == false) player.posX -= player.dirX * moveSpeed 
		if(map[Math.floor(player.posX)][Math.floor(player.posY - player.dirY * moveSpeed)] == false) player.posY -= player.dirY * moveSpeed 
	} 
	if(arrowRight) {
		let oldDirX = player.dirX
		player.dirX = player.dirX * Math.cos(-rotSpeed) - player.dirY * Math.sin(-rotSpeed)
		player.dirY = oldDirX * Math.sin(-rotSpeed) + player.dirY * Math.cos(-rotSpeed)
		let oldPlaneX = planeX
		planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed)
		planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed)
	}
	if(arrowLeft) {
		let oldDirX = player.dirX
		player.dirX = player.dirX * Math.cos(rotSpeed) - player.dirY * Math.sin(rotSpeed)
		player.dirY = oldDirX * Math.sin(rotSpeed) + player.dirY * Math.cos(rotSpeed)
		let oldPlaneX = planeX
		planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed)
		planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed)
	}
}

 
document.addEventListener("keydown", (e) => {
	if(e.key === "ArrowUp") {
			arrowUp = true
	}
	if(e.key === "ArrowDown") {
			arrowDown = true
	}
	if(e.key === "ArrowLeft") {
			arrowLeft = true
	}
	if(e.key === "ArrowRight") {
			arrowRight = true
	}
})

document.addEventListener("keyup", (e) => {
	if(e.key === "ArrowUp") {
			arrowUp = false
	}
	if(e.key === "ArrowDown") {
			arrowDown = false
	}
	if(e.key === "ArrowLeft") {
			arrowLeft = false
	}
	if(e.key === "ArrowRight") {
			arrowRight = false
	}
})

const clearScreen = () => {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const gameLoop = (time) => {
	  frameTime = (time - oldTime) / 1000;
    oldTime = time;
    fps = Math.round(1 / frameTime);
		window.requestAnimationFrame(gameLoop)
    clearScreen()
		main()
}

// setInterval(gameLoop, 30)
window.requestAnimationFrame(gameLoop)

