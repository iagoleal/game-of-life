# All methods which interact directly with the HTML5 Canvas are here
class Drawer 
	color: "black"
	lineWidth: 1
	line: (context, start, end) ->
		context.strokeStyle = @color
		context.lineWidth = @lineWidth
		context.beginPath()
		context.moveTo start.x, start.y
		context.lineTo end.x, end.y
		context.stroke()

	rectangle: (context, start, width, height) ->
		context.lineWidth = @lineWidth
		context.fillStyle = @color

		context.fillRect start.x, start.y, width, height

	text: (context, text, start, font) ->
		context.font = font if font

		context.fillStyle = @color
		context.fillText text, start.x, start.y
window.drawer = new Drawer


class window.Interface
	canvas: null
	context: null

	width: 0
	height: 0
	squareSide: 10 #px

	soul: null

	constructor: (@canvas, @squareSide=@squareSide, total) ->
		@context = @canvas.getContext '2d'
		@width = @canvas.width
		@height = @canvas.height

		@soul = new Core (@positionToGrid {x:@width, y:@height} , total)

	loop: () ->
		console.log @soul.cells.length
		@soul.update()
		@draw()

	draw: () ->
		@context.clearRect 0, 0, @width, @height
		#Draw the grid
		@drawGrid @squareSide, @width, @height

		# Draw each cell		
		drawer.color = "green"
		for cell in @soul.cells
			pos = @gridToPosition 
				x: cell.x
				y: cell.y
			drawer.rectangle @context, {x: pos.x, y: pos.y}, @squareSide, @squareSide

	drawGrid: (size, width, height) ->
		# Draw the grid on the canvas
		pos = {x:0.5, y:0.5}
		drawer.color = 'lightGray'

		while pos.x <= width
			drawer.line @context, pos, {x: pos.x, y: pos.y + height}
			pos.x += size

		pos.x = 0.5
		while pos.y <= height
			drawer.line @context, pos, {x: pos.x + width, y: pos.y}
			pos.y += size

	###
		Auxiliar methods to work with the canvas
	###
	positionToGrid: (pos) -> 
		x: ~~( pos.x / @squareSide)
		y: ~~( pos.y / @squareSide)

	gridToPosition: (pos) ->
		x: pos.x * @squareSide
		y: pos.y * @squareSide

window.Game = Interface

window.onload = ->
	canvas = document.getElementById "board"
	
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	
	###
	window.addEventListener 'resize', resizeCanvas, false
	canvas.addEventListener 'resize', resizeCanvas, false

	resizeCanvas = =>
		canvas.style.width = window.innerWidth
		canvas.style.height = window.innerHeight
	###

	$('#board').click (e) ->
		e.preventDefault()
		pos = game.positionToGrid 
			x: e.pageX - canvas.offsetLeft
			y: e.pageY - canvas.offsetTop
		game.soul.addCell pos

	window.game = new Interface canvas
	window.mainLoop()

window.mainLoop = () ->
	window.game.loop()
	window.setTimeout ->
		window.mainLoop()
	, 1000/10

	#window.requestAnimationFrame mainLoop


window.requestAnimationFrame = do ->
	#http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	window.requestAnimationFrame or
	window.webkitRequestAnimationFrame or
	window.mozRequestAnimationFrame or
	(callback) ->
		window.setTimeout(callback, 1000/60)
