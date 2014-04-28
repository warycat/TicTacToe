String.prototype.replaceAt = function (index, character) {
  return this.substr(0, index) + character + this.substr(index + character.length);
};

var Board = (function () {
  function setTitle(title) {
    $('#tictactoe').text(title);
  }

  function setTile(tile) {
    var r = tile.r;
    var c = tile.c;
    var t = tile.t;
    $('#' + c + r).text(t);
    $('#' + c + r).parent().addClass('tile-new');
  }

  function highlightTile(r, c, win) {
    $('#' + c + r).parent().addClass(win ? 'tile-2048' : 'tile-64');
  }

  function clearTiles() {
    $('.tile-inner').text('');
    $('.tile').removeClass('tile-2048 tile-64 tile-new');
  }
  return {
    setTitle: setTitle,
    setTile: setTile,
    highlightTile: highlightTile,
    clearTiles: clearTiles
  };

})();
var triples = [
  [{
    r: 0,
    c: 0
  }, {
    r: 0,
    c: 1
  }, {
    r: 0,
    c: 2
  }],
  [{
    r: 1,
    c: 0
  }, {
    r: 1,
    c: 1
  }, {
    r: 1,
    c: 2
  }],
  [{
    r: 2,
    c: 0
  }, {
    r: 2,
    c: 1
  }, {
    r: 2,
    c: 2
  }],
  [{
    r: 0,
    c: 0
  }, {
    r: 1,
    c: 0
  }, {
    r: 2,
    c: 0
  }],
  [{
    r: 0,
    c: 1
  }, {
    r: 1,
    c: 1
  }, {
    r: 2,
    c: 1
  }],
  [{
    r: 0,
    c: 2
  }, {
    r: 1,
    c: 2
  }, {
    r: 2,
    c: 2
  }],
  [{
    r: 0,
    c: 0
  }, {
    r: 1,
    c: 1
  }, {
    r: 2,
    c: 2
  }],
  [{
    r: 2,
    c: 0
  }, {
    r: 1,
    c: 1
  }, {
    r: 0,
    c: 2
  }]
];

var Game = (function () {
  var _states = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ];
  var _currentPlayer = 0;
  var _computerIndex = 1;
  var _seq = 0;
  var _names = 'XO';
  var _code = -3;

  function writeToBoard() {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        console.log(i, j, _states[i][j]);
        Board.setTile({
          r: i,
          c: j,
          t: _states[i][j]
        });
      }
    }
  }

  function getStatesString() {
    var s = '';
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        s = s + _states[i][j];
      }
    }
    return s;
  }

  function setStatesString(s) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        _states[i][j] = s[i * 3 + j];
      }
    }
  }

  function init(computerIndex) {
    _computerIndex = computerIndex;
    _seq = 0;
    _code = -1;
    _currentPlayer = 0;
    Board.clearTiles();
    Board.setTitle('TIC TAC TOE');
    setStatesString('         ');
    ai();
  }

  function ai() {
    if (_currentPlayer !== _computerIndex) {
      console.log(_currentPlayer, _computerIndex);
      return;
    }

    function delayedMove(i,j){
      setTimeout(function () {
        move(i, j);
      }, 400);
    }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (_states[i][j] === ' ') {
          delayedMove(i,j);
          return;
        }
      }
    }
  }

  function move(r, c) {
    if (_code !== -1) return;
    var t = _names[_currentPlayer];
    if (_states[r][c] !== ' ') return;
    _states[r][c] = t;
    Board.setTile({
      r: r,
      c: c,
      t: t
    });
    _seq = _seq + 1;
    _code = code();
    if (_code !== -1) {
      setTimeout(function () {
        end(_code);
      }, 400);
      return;
    }
    _currentPlayer = (_currentPlayer + 1) % 2;
    ai();
  }

  function code() {
    _.each(triples,function(triple,i){
      var s = '';
      $.each(triple, function (index, tile) {
        var r = tile.r;
        var c = tile.c;
        var t = _states[r][c];
        s = s + t;
      });
      if (s === 'XXX') return i;
      if (s === 'OOO') return 10 + i;
    });
    // for (var i = 0; i < triples.length; i++) {
    //   var triple = triples[i];
    //   var s = '';
    //   $.each(triple, function (index, tile) {
    //     var r = tile.r;
    //     var c = tile.c;
    //     var t = _states[r][c];
    //     s = s + t;
    //   });
    //   if (s === 'XXX') return i;
    //   if (s === 'OOO') return 10 + i;
    // }
    if (_seq === 9) return -2;
    return -1;
  }

  function end(code) {
    if (code === -2) {
      Board.setTitle('DRAW');
      return;
    }
    var index = code % 10;
    var winnerIndex = Math.floor(code / 10);
    var win = (winnerIndex === _computerIndex) ? 'LOSE' : 'WIN';
    Board.setTitle('YOU ' + win);
    var triple = triples[index];
    $.each(triple, function (index, tile) {
      Board.highlightTile(tile.r, tile.c, win === 'WIN');
    });
  }

  return {
    getStatesString: getStatesString,
    setStatesString: setStatesString,
    writeToBoard: writeToBoard,
    init: init,
    move: move,
    end: end,
    code: code
  };
})();

$(function () {
  Board.clearTiles();
  Game.init(1);
  $('.tile-inner').click(function () {
    var id = this.id;
    var c = Math.floor(id / 10);
    var r = id % 10;
    Game.move(r, c);
  });

  $('#Player').click(function () {
    Game.init(1);
    console.log('player start');
  });

  $('#Computer').click(function () {
    Game.init(0);
    console.log('computer start');
  });

  var index = 0;
  $('#Share').click(function () {

    index = index + 1;
  });

  $('#sign_in').click(function () {
    console.log(this.id);
  });
  $('#sign_up').click(function () {
    console.log(this.id);
  });
  $('#sign_out').click(function () {
    console.log(this.id);
  });
  $('#new_game').click(function () {
    console.log(this.id);
  });
  $('#save_game').click(function () {
    console.log(this.id);
  });
  $('#load_game').click(function () {
    console.log(this.id);
  });
  $('#match').click(function () {
    console.log(this.id);
  });
  $('#leave').click(function () {
    console.log(this.id);
  });

});