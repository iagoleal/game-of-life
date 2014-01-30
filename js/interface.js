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

    function Interface(canvas, squareSide, total) {
      this.canvas = canvas;
      this.squareSide = squareSide != null ? squareSide : this.squareSide;
      this.context = this.canvas.getContext('2d');
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.soul = new Core(this.positionToGrid({
        x: this.width,
        y: this.height
      }, total));
    }

    Interface.prototype.loop = function() {
      console.log(this.soul.cells.length);
      this.soul.update();
      return this.draw();
    };

    Interface.prototype.draw = function() {
      var cell, pos, _i, _len, _ref, _results;
      this.context.clearRect(0, 0, this.width, this.height);
      this.drawGrid(this.squareSide, this.width, this.height);
      drawer.color = "green";
      _ref = this.soul.cells;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cell = _ref[_i];
        pos = this.gridToPosition({
          x: cell.x,
          y: cell.y
        });
        _results.push(drawer.rectangle(this.context, {
          x: pos.x,
          y: pos.y
        }, this.squareSide, this.squareSide));
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
    /*
    	window.addEventListener 'resize', resizeCanvas, false
    	canvas.addEventListener 'resize', resizeCanvas, false
    
    	resizeCanvas = =>
    		canvas.style.width = window.innerWidth
    		canvas.style.height = window.innerHeight
    */

    $('#board').click(function(e) {
      var pos;
      e.preventDefault();
      pos = game.positionToGrid({
        x: e.pageX - canvas.offsetLeft,
        y: e.pageY - canvas.offsetTop
      });
      return game.soul.addCell(pos);
    });
    window.game = new Interface(canvas);
    return window.mainLoop();
  };

  window.mainLoop = function() {
    window.game.loop();
    return window.setTimeout(function() {
      return window.mainLoop();
    }, 1000 / 10);
  };

  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();

}).call(this);
