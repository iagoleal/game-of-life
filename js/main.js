// Generated by CoffeeScript 1.6.3
/*
Any live cell with fewer than two live neighbours dies, as if caused by under-population.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overcrowding.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/


(function() {
  var Core, Status;

  Status = {
    alive: true,
    dead: false
  };

  Core = (function() {
    Core.prototype.width = 0;

    Core.prototype.height = 0;

    Core.prototype.population = 1000;

    Core.prototype.born = [3];

    Core.prototype.alive = [2, 3];

    Core.prototype.cells = null;

    function Core(width, height, population) {
      var i, j, _i, _j, _ref, _ref1;
      this.width = width != null ? width : 100;
      this.height = height != null ? height : 100;
      this.population = population != null ? population : this.population;
      this.cells = new Array(this.width);
      for (i = _i = 0, _ref = this.cells.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.cells[i] = new Array(this.height);
        for (j = _j = 0, _ref1 = this.cells[i].length; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          this.cells[i][j] = Status.dead;
        }
      }
      this.randomize();
    }

    Core.prototype.randomize = function() {
      var i, x, y, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.population; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        x = ~~(Math.random() * this.width);
        y = ~~(Math.random() * this.height);
        if (this.cells[x][y] === Status.alive) {
          _results.push(--i);
        } else {
          _results.push(this.cells[x][y] = Status.alive);
        }
      }
      return _results;
    };

    Core.prototype.addCell = function(x, y) {
      if (this.cells[x][y] === Status.dead) {
        this.cells[x][y] = Status.alive;
        return this.population++;
      }
    };

    Core.prototype.killCell = function(x, y) {
      if (this.cells[x][y] === Status.alive) {
        this.cells[x][y] = Status.dead;
        return this.population--;
      }
    };

    Core.prototype.isAlive = function(x, y) {
      return this.cells[x][y];
    };

    Core.prototype.neighbours = function(x, y) {
      var count, i, j, _i, _j;
      count = 0;
      for (i = _i = -1; _i <= 1; i = ++_i) {
        if (this.cells[x + i]) {
          for (j = _j = -1; _j <= 1; j = ++_j) {
            if (!(i === j && j === 0)) {
              if (this.cells[x + i][y + j] === Status.alive) {
                count += 1;
              }
            }
          }
        }
      }
      return count;
    };

    Core.prototype.update = function() {
      var cell, count, line, x, y, _i, _len, _ref, _results;
      _ref = this.cells;
      _results = [];
      for (x = _i = 0, _len = _ref.length; _i < _len; x = ++_i) {
        line = _ref[x];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (y = _j = 0, _len1 = line.length; _j < _len1; y = ++_j) {
            cell = line[y];
            count = this.neighbours(x, y);
            switch (cell) {
              case Status.dead:
                switch (count) {
                  case 3:
                    _results1.push(this.addCell(x, y));
                    break;
                  default:
                    _results1.push(void 0);
                }
                break;
              case Status.alive:
                switch (count) {
                  case 2:
                  case 3:
                    break;
                  default:
                    _results1.push(this.killCell(x, y));
                }
                break;
              default:
                _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    return Core;

  })();

  window.Status = Status;

  window.Core = Core;

}).call(this);
