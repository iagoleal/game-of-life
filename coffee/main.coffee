###
Any live cell with fewer than two live neighbours dies, as if caused by under-population.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overcrowding.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
###


class window.Core
	width: 0
	height: 0
	total: 300

	born: 3
	alive: [2, 3]
	cells: null

	constructor: (size,  @total=@total) ->
		@width = size.x
		@height = size.y
		@cells = []
		for i in [0..@total-1]
			cell = new Cell
			cell.randomize @width, @height
			(cell.randomize @width, @height) for each in @cells when cell.x is each.x and cell.y is each.y
			#console.log "created on: ", cell.x, cell.y
			@cells.push cell

	addCell: (pos) ->
		test = true for cell in @cells when cell.x is pos.x and cell.y is pos.y
		if not test
			@cells[@cells.length] = new Cell(pos.x, pos.y)

	update: () ->
		indexes = []
		for cell, index in @cells
			count = 0
			for i in [-1..1]
				for j in [-1..1]
					if (i isnt j) and @_isAlive(cell.x+i, cell.y+j) then count++
					else @_deadUpdate {x: cell.x+i, y: cell.y+j}
			unless count in @alive
				indexes[indexes.length] = index 
		@cells.splice(index, 1) for index in indexes

	_deadUpdate: (cell) ->
		count = 0
		for i in [-1..1]
			for j in [-1..1]
				count++ if (i isnt j) and @_isAlive(cell.x+i, cell.y+j)
		if count is @born
			console.log 'aaa'
			@cells[@cells.length] = new Cell(cell.x, cell.y)
			

	_isAlive: (x, y) ->
		for cell in @cells
			if cell.x is x and cell.y is y
				return true
		return false


class Cell
	x: 0
	y: 0

	constructor: (@x=0, @y=0) ->

	randomize: (maxWidth, maxHeight) ->
		#console.log maxWidth, maxHeight
		@x = ~~(Math.random()*maxWidth)
		@y = ~~(Math.random()*maxHeight)
		#console.log @x, @y
		{x: @x, y: @y}



window.Core = Core