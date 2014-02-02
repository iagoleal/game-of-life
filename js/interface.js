// Generated by CoffeeScript 1.6.3
(function() {
  var Drawer;

  Drawer = (function() {
    function Drawer() {}

    Drawer.prototype.color = "black";

    Drawer.prototype.lineWidth = 1;

    Drawer.prototype.line = function(context, start, end) {
      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      return context.stroke();
    };

    Drawer.prototype.rectangle = function(context, start, width, height) {
      context.lineWidth = this.lineWidth;
      context.fillStyle = this.color;
      return context.fillRect(start.x, start.y, width, height);
    };

    Drawer.prototype.text = function(context, text, start, font) {
      if (font) {
        context.font = font;
      }
      context.fillStyle = this.color;
      return context.fillText(text, start.x, start.y);
    };

    return Drawer;

  })();

  window.drawer = new Drawer;

  window.Interface = (function() {
    Interface.prototype.canvas = null;

    Interface.prototype.context = null;

    Interface.prototype.width = 0;

    Interface.prototype.height = 0;

    Interface.prototype.squareSide = 10;

    Interface.prototype.soul = null;

    Interface.prototype.isPaused = false;

    Interface.prototype.lastTime = null;

    function Interface(canvas, squareSide, total) {
      var size;
      this.canvas = canvas;
      this.squareSide = squareSide != null ? squareSide : this.squareSide;
      this.context = this.canvas.getContext('2d');
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      size = this.positionToGrid({
        x: this.width,
        y: this.height
      });
      this.soul = new Core(size.x, size.y, total);
    }

    Interface.prototype.loop = function() {
      if (!(this.isPaused || window.mousePressed)) {
        this.soul.update();
      }
      return this.draw();
    };

    Interface.prototype.draw = function() {
      var cell, i, j, line, pos, _i, _len, _ref, _results;
      this.context.clearRect(0, 0, this.width, this.height);
      this.drawGrid(this.squareSide, this.width, this.height);
      drawer.color = "green";
      _ref = this.soul.cells;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        line = _ref[i];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (j = _j = 0, _len1 = line.length; _j < _len1; j = ++_j) {
            cell = line[j];
            if (this.soul.cells[i][j] === Status.alive) {
              pos = this.gridToPosition({
                x: i,
                y: j
              });
              _results1.push(drawer.rectangle(this.context, pos, this.squareSide, this.squareSide));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Interface.prototype.drawGrid = function(size, width, height) {
      var pos, _results;
      pos = {
        x: 0.5,
        y: 0.5
      };
      drawer.color = 'lightGray';
      while (pos.x <= width) {
        drawer.line(this.context, pos, {
          x: pos.x,
          y: pos.y + height
        });
        pos.x += size;
      }
      pos.x = 0.5;
      _results = [];
      while (pos.y <= height) {
        drawer.line(this.context, pos, {
          x: pos.x + width,
          y: pos.y
        });
        _results.push(pos.y += size);
      }
      return _results;
    };

    /*
    		Auxiliar methods to work with the canvas
    */


    Interface.prototype.positionToGrid = function(pos) {
      return {
        x: ~~(pos.x / this.squareSide),
        y: ~~(pos.y / this.squareSide)
      };
    };

    Interface.prototype.gridToPosition = function(pos) {
      return {
        x: pos.x * this.squareSide,
        y: pos.y * this.squareSide
      };
    };

    return Interface;

  })();

  window.Game = Interface;

  window.onload = function() {
    var canvas;
    canvas = document.getElementById("board");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    $('#board').mousedown(function(e) {
      var pos;
      e.preventDefault();
      pos = game.positionToGrid({
        x: e.pageX - canvas.offsetLeft,
        y: e.pageY - canvas.offsetTop
      });
      game.soul.addCell(pos.x, pos.y);
      return window.mousePressed = true;
    });
    $('#board').mouseup(function(e) {
      e.preventDefault();
      return window.mousePressed = false;
    });
    $('#board').mousemove(function(e) {
      var pos;
      e.preventDefault();
      if (window.mousePressed) {
        pos = game.positionToGrid({
          x: e.pageX - canvas.offsetLeft,
          y: e.pageY - canvas.offsetTop
        });
        return game.soul.addCell(pos.x, pos.y);
      }
    });
    $('#board').keydown(function(e) {
      switch (e.keyCode) {
        case 32:
          e.preventDefault();
          game.isPaused = !game.isPaused;
          if (game.isPaused === true) {
            return $('#btn-pause').text('Continue');
          } else {
            return $('#btn-pause').text('Pause');
          }
          break;
        case 13:
          e.preventDefault();
          return game.soul.clear();
      }
    });
    $('#btn-pause').click(function(e) {
      e.preventDefault();
      return game.isPaused = !game.isPaused;
    });
    $('#btn-clear').click(function(e) {
      e.preventDefault();
      return game.soul.clear();
    });
    $('#btn-new').click(function(e) {
      e.preventDefault();
      return $('#panel').fadeToggle();
    });
    window.game = new Interface(canvas);
    return window.mainLoop();
  };

  window.mainLoop = function() {
    var fps;
    window.game.loop();
    if (typeof mainLoop.lastTime === 'undefined') {
      mainLoop.lastTime = new Date().getTime();
    } else {
      fps = 1000 / (new Date().getTime() - mainLoop.lastTime);
      document.getElementById("flag").innerHTML = fps.toFixed(2);
      mainLoop.lastTime = new Date().getTime();
    }
    return window.setTimeout(function() {
      return window.mainLoop();
    }, 1000 / 7);
  };

}).call(this);
