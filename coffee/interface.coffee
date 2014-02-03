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
	fps: 7
	population: 1000

	soul: null
	isPaused: false

	lastTime: null

	constructor: (@canvas, @squareSide=@squareSide) ->
		@context = @canvas.getContext '2d'
		@width = @canvas.width
		@height = @canvas.height
		size = @positionToGrid {x:@width, y:@height} 
		@soul = new Core size.x, size.y, @population

	restart: () ->
		size = @positionToGrid {x:@width, y:@height} 
		@soul = new Core size.x, size.y, @population

	loop: () ->
		unless @isPaused or window.mousePressed
			@soul.update()
			#@isPaused = true

		@draw()

	draw: () ->
		@context.clearRect 0, 0, @width, @height
		#Draw the grid
		@drawGrid @squareSide, @width, @height
		# Draw each cell		
		drawer.color = "green"
		for line, i in @soul.cells
			for cell, j in line
				if @soul.cells[i][j] is Status.alive
					pos = @gridToPosition 
						x: i
						y: j
					drawer.rectangle @context, pos, @squareSide, @squareSide

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
	window.game = new Interface canvas

	$('#board').mousedown (e) ->
		e.preventDefault()
		pos = game.positionToGrid 
			x: e.pageX - canvas.offsetLeft
			y: e.pageY - canvas.offsetTop
		game.soul.addCell pos.x, pos.y
		window.mousePressed = true

	$('#board').mouseup (e) ->
		e.preventDefault()		
		window.mousePressed = false

	$('#board').mousemove (e) ->
		e.preventDefault()
		if window.mousePressed
			pos = game.positionToGrid 
				x: e.pageX - canvas.offsetLeft
				y: e.pageY - canvas.offsetTop
			game.soul.addCell pos.x, pos.y

	$( document ).keydown (e) ->
		switch e.keyCode
			when 32
				e.preventDefault()
				game.isPaused = !game.isPaused
				if game.isPaused is true
					$( '#btn-pause' ).text 'Continue'
				else
					$( '#btn-pause' ).text 'Pause'
			when 13
				e.preventDefault()
				game.soul.clear()

	# document.getElementById('btn-pause').click =
	$( '#btn-pause' ).click (e) ->
		e.preventDefault()
		game.isPaused = !game.isPaused
		$( '#btn-pause' ).text if game.isPaused then 'Continue' else 'Pause'
		

	$( '#btn-clear' ).click (e) ->
		e.preventDefault()
		game.soul.clear()

	$( '#btn-new' ).click (e) ->
		e.preventDefault()
		game.restart()

	$( '#btn-ctrl' ).click (e) ->
		e.preventDefault()
		$( '#panel' ).fadeToggle()

	for box in $('#panel input[type=checkbox]')
		$(box).bind 'change', (e) ->

			value = parseInt(@value)
			if @checked
				
				unless @value in game.soul[@name]
					game.soul[@name].push value 
			else
				for n, i in game.soul[@name]
					game.soul[@name].splice(i, 1) if n is value

	for range in $( "#panel input[type=range]")
		$(range).bind 'change', (e) ->
			game[this.dataset.var] = parseInt(@value)
			this.parentElement.querySelector('.label').innerHTML = @value

		input = range.parentElement.querySelector('input[type=range]')
		input.value = game[range.dataset.var]
		range.parentElement.querySelector('.label').innerHTML = input.value

	$()

	window.mainLoop()

window.mainLoop = () ->
	window.game.loop()
	if typeof mainLoop.lastTime is 'undefined'
		mainLoop.lastTime = new Date().getTime()
	else
		fps = 1000/(new Date().getTime() - mainLoop.lastTime)
		document.getElementById("flag").innerHTML = fps.toFixed(2) + ' fps'
		mainLoop.lastTime = new Date().getTime()
	window.setTimeout ->
		window.mainLoop()
	, 1000/game.fps