###
Any live cell with fewer than two live neighbours dies, as if caused by under-population.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overcrowding.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
###

Status =
	alive: true
	dead: false

class Core
	width: 0
	height: 0
	population: 1000

	born: [3]
	alive: [2, 3]
	cells: null

	constructor: (@width=100,  @height=100, @population=@population) ->
		@cells = new Array @width
		for i in [0..@cells.length]
			@cells[i] = new Array @height
			for j in [0..@cells[i].length]
				@cells[i][j] = Status.dead

		@randomize()

	randomize: ->
		for i in [0..@population]
			x = ~~(Math.random()*@width)
			y = ~~(Math.random()*@height)
			if @cells[x][y] is Status.alive
				--i
			else
				@cells[x][y] = Status.alive


	resize:() ->
		

	clear: ->
		for i in [0.. @cells.length-1]
			for j in [0..@cells[i].length-1]
				@cells[i][j] = Status.dead

	addCell: (x, y) ->
		if @cells[x][y] is Status.dead
			@cells[x][y] = Status.alive
			@population++

	killCell: (x, y) ->
		if @cells[x][y] is Status.alive
			@cells[x][y] = Status.dead
			@population--

	isAlive: (x, y) -> @cells[x][y]

	neighbours: (x, y) ->
		count = 0
		for i in [-1..1] when @cells[x+i] 
			for j in [-1..1] when not (i is j and j is 0)
				if @cells[x+i][y+j] is Status.alive
					count += 1
		return count


	update: () ->
		changes = []
		for line, x in @cells
			for cell, y in line
				count = @neighbours x, y

				switch cell
					when Status.dead
						if count in @born
							changes.push {x: x, y: y}
					when Status.alive
						unless count in @alive
							changes.push {x: x, y: y}

		@cells[i.x][i.y] = !@cells[i.x][i.y] for i in changes 
				
window.Status = Status
window.Core = Core