import Player from "./Player.js";
import SAOLchecker from "./SAOLchecker.js";
export default class Startpage {

  getCurrentPlayerTiles() {
    return $('.stand').children('.tile');
  }

  constructor() {
    this.count = 0;
    this.check = true;
    this.first = 0;
    this.wordVert = '';
    this.wordHoriz = '';
    this.placedTiles = [];
    this.indexholder = [];
    this.wordHolder = [];
    this.scoreHolder = [];
    this.correctIndexHolder = [];
    this.valid = false;
    this.checker = true;
    this.firstRound = true;
    this.validTiles = true;
  }

  async start(ammountOfPlayers, playernames) {
    this.createBoard();
    await this.tilesFromFile();

    this.players = [];
    for (let i = 1; i <= ammountOfPlayers; i++) {
      this.players.push(new Player(this, `${playernames[i - 1]}`));
    }


    let helpBtn = $('<button class="helpBtn">?</button>');
    $('body').append(helpBtn);

    let infoDiv = $('<div class="info-popup"></div>');
    let closePopupBtn = $('<button class="close-info-popup">X</button>');
    let info = $('<p class="paragraph-info">"I spelets första drag måste spelare nummer 1 lägga sitt ord, lodrätt eller vågrätt, så att den mittersta rutan (se bild) på spelplanen täcks. Poängen för ordet räknas samman och förs in i protokollet. När detta är gjort, tar man lika många brickor ur påsen som man lagt ut på spelplanen. Det ska alltid ﬁnnas sex, sju eller åtta brickor på brickstället, beroende på hur ni bestämt från början. Nästa spelare ska lägga ett ord som binds samman med det första, antingen lodrätt eller vågrätt. (Se exempel på sid 4.) De nya bok- stavsbrickorna måste bilda ett komplett ord tillsammans med det som redan ﬁnns på spelplanen. Poängen för ordet räknas samman och förs in i protokollet. "</p>');
    infoDiv.append(closePopupBtn, info);
    $('body').append(infoDiv);

    $('.helpBtn').on('click', function () {
      $('.info-popup').toggle();
    });

    $(closePopupBtn).on('click', function () {
      $('.info-popup').toggle();
    });

    //----------------
    //This part contains logic for "Skapad av" button
    let madeBy = $('<button class = "madeBy">Skapad av</button>');
    $('body').append(madeBy);

    let madeByDiv = $('<div class="madeBy-popup"></div>');
    let whoMadeIt = $('<p class="whoMadeItInfo">"Det här spelet är gjort av Java 2020 grupp2. Medlemmar: Ali, Ermin, Hanan, Jonathan , Lukas, Edvin och Oscar "</p>');
    madeByDiv.append(whoMadeIt);
    $('body').append(madeByDiv);

    $('.madeBy').on('click', function () {
      $('.madeBy-popup').toggle();
    });

    //------------------


    this.render();
  }

  startPage() {
    let that = this;
    let ammountOfPlayers = 0;
    let playerNames = [];
    let startDiv = $('<div class="startpage"></div>');
    let startTitle = $('<div class="pagetitle"></div>');
    let popmess = $('<div class="popmessage">[Kräver minst 1 spelare för att starta.]</div>');

    startDiv.append(`
    <div class="pagetitle">.</div> 
    <button class="start-button"><h3>Starta Spelet</h3></button>
    <div class="popmessage"></div>
    <div class="rules">
    <h2 class="rules-headline"></h2>
    <p class="text-rules"></p>
    </div>
    <div class="players-menu">
    <input type="text" class="player1" placeholder="spelare 1">
    <input type="text" class="player2" placeholder="spelare 2">
    <input type="text" class="player3" placeholder="spelare 3">
    <input type="text" class="player4" placeholder="spelare 4">
    </div>
    `);


    $('body').append(startTitle);
    $('body').append(startDiv);
    $('.start-button').click(function () {
      for (let i = 0; i < 4; i++) {
        if ($(`.player${i + 1}`).val() === '') {
          $('.popmessage').append(popmess);
        } else {
          playerNames.push($(`.player${i + 1}`).val());
          ammountOfPlayers++;
        }
      }
      if (ammountOfPlayers !== 0) {
        that.start(ammountOfPlayers, playerNames);

        $('.pagetitle').hide();
        $('.startpage').hide();




      }
    });
  }

  createBoard() {

    let middle = [[7, 7]];
    let indexRed = [[0, 0], [0, 7], [0, 14], [7, 0], [7, 14], [14, 0], [14, 7], [14, 14]];
    let indexLightBlue = [[0, 3], [0, 11], [2, 6], [2, 8], [3, 0], [3, 7], [3, 14], [6, 2], [6, 6], [7, 3], [7, 11], [8, 2], [8, 6],
    [8, 8], [8, 12], [6, 8], [6, 12], [11, 0], [11, 7], [11, 14], [12, 6], [12, 8], [14, 3], [14, 11]];
    let indexOrange = [[1, 1], [1, 13], [2, 2], [3, 3], [4, 4], [11, 3], [11, 11], [12, 2], [13, 1], [2, 12], [3, 11], [4, 10], [10, 10], [12, 12], [13, 13], [10, 4]];
    let indexBlue = [[1, 5], [1, 9], [5, 1], [5, 5], [5, 9], [5, 13], [9, 1], [9, 5], [9, 9], [13, 5], [13, 9], [9, 13]];

    this.board = [...new Array(15)].map(x => [...new Array(15)].map(x => ({})));

    middle.forEach(([x, y]) => this.board[x][y].special = 'middle');
    indexRed.forEach(([x, y]) => this.board[x][y].special = 'red');
    indexLightBlue.forEach(([x, y]) => this.board[x][y].special = 'lightblue');
    indexOrange.forEach(([x, y]) => this.board[x][y].special = 'orange');
    indexBlue.forEach(([x, y]) => this.board[x][y].special = 'blue');

  }

  async tilesFromFile() {
    this.tiles = [];
    // Read the tile info from file
    (await $.get('tiles.txt'))
      .split('\r').join('') // Windows safe :)
      .split('\n').forEach(x => {
        // For each line split content by ' '
        // x[0] = char, x[1] = points, x[2] = occurences
        x = x.split(' ');
        x[0] = x[0] === '_' ? ' ' : x[0];
        // add tiles to this.tiles
        while (x[2]--) {
          this.tiles.push({ char: x[0], points: +x[1] })
        }
      });
    // Shuffle in random order
    this.tiles.sort(() => Math.random() - 0.5);
  }

  getTiles(howMany = 7) {
    // Return a number of tiles (and remove from this.tiles)
    return this.tiles.splice(0, howMany);
  }

  render() {

    $('.board, .players, .next, .swap').remove();
    let $board = $('<div class="board"/>').appendTo('body');
    let $players = $('<div class="players"/>').appendTo('body');
    $('body').append('<footer class="footer"> &copy; 2020 - Made by Grupp 2 (Lunds Teknik Högskola)</footer>');
    $('body').append('<div class="invalid"></div>');
    $board.html(this.board.flat().map(x => `
    <div class="${x.special ? 'special-' + x.special : ''}">
    ${x.tile ? `<div class="tile">${x.tile.char}</div>` : ''}
    </div>
    `).join(''));


    // Render the players
    let that = this;
    $('.players').append(`<div class="players-point"> ★ poäng: ${this.players[this.count].points}</div>`);
    $players.append(this.players[this.count].render());
    $('body').append('<button class="pass">Passa</button>');
    $('.pass').click(function () {
      if (that.players[that.count].tiles.length === 7) {
        $('.players').empty();
        that.count++;
        if (that.count === that.players.length) { that.count = 0 }
        $('.players').append(`<div class="players-point"> ★ poäng: ${that.players[that.count].points}</div>`);
        $players.append(that.players[that.count].render());
        that.addEvents();
      } else {
        that.players[that.count].tiles.push(...that.placedTiles);
        that.placedTiles = [];

        that.indexholder.forEach(([a, b]) => that.board[a][b].tile = '');
        that.indexholder = [];
        that.scoreHolder = [];
        that.wordHolder = [];
        that.wordHoriz = '';
        that.wordVert = '';
        that.render();
      }
    });


    $('body').append('<button class="next">Spela</button>');
    $('.next').click(async function () {
      if (!that.firstRound) {
        that.checkIfConnected();
      }
      that.countPoints();
      that.checker = true;
      that.wordHolder = [];
      that.collectWord();
      that.collectWordVert();
      that.makeCollectedWordsToArray(that.wordVert, that.wordHoriz);
      that.wordHoriz = '';
      that.wordVert = '';
      console.log(that.wordHolder);
      if (that.wordHolder.length !== 0) {
        for (let i = 0; i < that.wordHolder.length; i++) {
          if (that.wordHolder[i] === '') { that.wordHolder.splice(i, 1); }
          else {
            that.valid = await SAOLchecker.scrabbleOk(that.wordHolder[i]);
            Promise.resolve(that.valid);
            if (that.valid === false) {
              that.checker = false;
              break;
            }
          }
        }
      }

      if (that.board[7][7].tile !== undefined && that.check === true && that.checker && that.checkIfOnlyOneWord() && that.validTiles) {
        that.firstRound = false;
        that.addNewIndex();
        $('.invalid').hide();
        that.checker = true;
        let points = 0;
        that.scoreHolder.forEach(x => points += (x + 0));
        that.players[that.count].points += points;
        that.players[that.count].pushTiles(that.placedTiles.length);
        $('.players').empty();
        that.placedTiles = [];
        that.indexholder = [];
        that.scoreHolder = [];
        that.wordHolder = [];
        that.wordHoriz = '';
        that.wordVert = '';
        that.count++;
        if (that.count === that.players.length) {
          that.count = 0;
        }
        $('.players').append(`<div class="players-point">poäng: ${that.players[that.count].points}</div>`);
        $players.append(that.players[that.count].render(2));
        that.addEvents();
      } else {
        $('.invalid').slideToggle("slow");
      }
    });


    $('body').append('<button class="swap">Byt ut<span class="tooltiptext">Lägg ut brickor du vill byta ut på brädet</span></button>');
    $('.swap').click(function () {
      if (that.placedTiles.length !== 0) {
        that.placedTiles = [];
        that.indexholder.forEach(([a, b]) => that.board[a][b].tile = '');
        that.players[that.count].pushTiles(that.indexholder.length);
        $('.players').empty();
        that.placedTiles = [];
        that.indexholder = [];
        that.scoreHolder = [];
        that.wordHolder = [];
        that.render();
        that.count++;
        if (that.count === that.players.length) {
          that.count = 0;
        }
        $players.append(that.players[that.count].render(0));
        that.addEvents();
        that.render();
      }

    });

    /* let currentPlayerTiles = $('.stand').children('.tile').text();
    console.log(currentPlayerTiles); */

    $('body').append('<button class="undo-btn">Ångra</div>');

    $('.undo-btn').click(function () {
      if (that.placedTiles.length !== 0) {
        that.players[that.count].tiles.push(...that.placedTiles);
        that.placedTiles = [];
        that.scoreHolder = [];
        that.indexholder.forEach(([a, b]) => that.board[a][b].tile = '');
        that.indexholder = [];
        that.wordHolder = [];
        that.render();
      }
    });

    this.addEvents();
  }

  checkIfDraggedWithinStand($draggedTile) {
    // Find the stand that is a parent element of the dragged tile
    let $stand = $draggedTile.parents('.stand');
    // Get the top and left corner of the dragged tile - remember as y and x
    let { left: x, top: y } = $draggedTile.offset();
    // Get the top, left, bottom, right positions of the stand
    let { top: standTop, left: standLeft } = $stand.offset();
    let standBottom = standTop + $stand.outerHeight();
    let standRight = standLeft + $stand.outerWidth();
    // Checked if the dragged tile is within the stands coordinates
    let posWithinStand = y >= standTop && y <= standBottom && x >= standLeft && x <= standRight; // true/false
    // If not do nothing more
    if (!posWithinStand) { return; }
    // Get all tiles in the stand (divs in the DOM)
    let $tiles = $stand.find('.tile');
    // Get the real tile array with objects from the player
    let tileArr = this.players[this.count].tiles;
    // The tile divs in the DOM and the tileArr have the same corresponding order
    // now loop through every tile div and add the property left to the real objects in tileArr
    $tiles.each(function (i) {
      tileArr[i].left = $(this).offset().left;
    });
    // Sort the tileArr according to the left property
    tileArr.sort((a, b) => a.left > b.left ? 1 : - 1);
    // Remove the left property from the objects in tileArr
    // we only needed it for sorting...
    tileArr.forEach(x => delete x.left);
  }



  addEvents() {
    let currentPlayerTiles = this.getCurrentPlayerTiles();
    //console.log(currentPlayerTiles);
    /* let currentPlayerTiles = $('.stand').children('.tile');
    console.log(this.players[this.count].name + currentPlayerTiles); */
    let that = this;
    // Set a css-class hover on the square the mouse is above
    // if we are dragging and there is no tile in the square

    $('.board > div').mouseenter(e => {
      let me = $(e.currentTarget);
      if ($('.is-dragging').length && !me.find('.tile').length) {
        me.addClass('hover')
      }
    });
    $('.board > div').mouseleave(e =>
      $(e.currentTarget).removeClass('hover')
    );

    // Drag-events: We only check if a tile is in place on dragEnd
    $('.stand > .tile').draggabilly().on('dragEnd', e => {

      // check if drag within stand
      this.checkIfDraggedWithinStand($(e.currentTarget));

      // get the dropZone square - if none render and return
      let $dropZone = $('.hover');
      if (!$dropZone.length) { this.render(); return; }

      // the index of the square we are hovering over
      let squareIndex = $('.board > div').index($dropZone);

      // convert to y and x coords in this.board
      let y = Math.floor(squareIndex / 15);
      let x = squareIndex % 15;

      // the index of the chosen tile
      let $tile = $(e.currentTarget);
      let tileIndex = $('.stand > div').index($tile);

      // put the tile on the board and re-render
      if ($tile.parent('.stand').length) {
        let holder = this.players[that.count].tiles.splice(tileIndex, 1)[0];
        this.board[y][x].tile = holder;
        this.placedTiles.push(holder);
        this.scoreHolder.push(holder.points);
        this.indexholder.push([y, x]);

        that.check = true;
        that.checkTileOnBoard();

      }
      this.render();
      that.first++;
    });
  }

  collectWord() {
    this.wordHoriz = '';


    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j].tile === '') { continue; }
        if (this.board[i][j].tile !== undefined) {
          if (this.board[i][j + 1].tile === undefined || this.board[i][j + 1].tile === '') {
            if (this.board[i][j - 1].tile === undefined || this.board[i][j - 1].tile === '') {
              if (this.firstRound) {
                this.wordHoriz += this.board[i][j].tile.char + ',';
              }
            }
            else {
              this.wordHoriz += this.board[i][j].tile.char + ',';
            }
          } else { this.wordHoriz += this.board[i][j].tile.char; }
        }
      }
    }
  }

  collectWordVert() {
    this.wordVert = '';

    for (let j = 0; j < this.board.length; j++) {
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i][j].tile === '') { continue; }
        if (this.board[i][j].tile !== undefined) {
          if (this.board[i + 1][j].tile === undefined || this.board[i + 1][j].tile === '') {
            if (this.board[i - 1][j].tile === undefined || this.board[i - 1][j].tile === '') { }
            else {
              this.wordVert += this.board[i][j].tile.char + ',';
            }
          } else {
            this.wordVert += this.board[i][j].tile.char;
          }
        }
      }
    }
  }

  checkTileOnBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j].tile === '') { continue; }
        if (i > 0 && i < 14 && j === 0 && this.board[i][j].tile !== undefined) {
          if (this.board[i + 1][j].tile === undefined && this.board[i][j + 1].tile === undefined &&
            this.board[i - 1][j].tile === undefined && this.first !== 0) {
            this.check = false;
          }
        }
        else if (i === 0 && j > 0 && j < 14 && this.board[i][j].tile !== undefined) {
          if (this.board[i + 1][j].tile === undefined && this.board[i][j + 1].tile === undefined &&
            this.board[i][j - 1].tile === undefined && this.first !== 0) {
            this.check = false;
          }
        }
        else if (i > 0 && i < 14 && j === 14 && this.board[i][j].tile !== undefined) {
          if (this.board[i + 1][j].tile === undefined && this.board[i - 1][j].tile === undefined &&
            this.board[i][j - 1].tile === undefined && this.first !== 0) {
            this.check = false;
          }
        }
        else if (j > 0 && j < 14 && i === 14 && this.board[i][j].tile !== undefined) {
          if (this.board[i][j + 1].tile === undefined && this.board[i][j - 1].tile === undefined &&
            this.board[i - 1][j].tile === undefined && this.first !== 0) {
            this.check = false;
          }
        }
        else if (i === 0 && j === 0 && this.board[i][j].tile !== undefined) {
          if (this.board[i + 1][j].tile === undefined && this.board[i][j + 1].tile === undefined && this.first !== 0) {
            this.check = false;
          }
        }
        else if (i === 14 && j === 0 && this.board[i][j].tile !== undefined) {
          if (this.board[i - 1][j].tile === undefined && this.board[i][j + 1].tile === undefined && this.first !== 0) {
            this.check = false;
          }
        }
        else if (i === 14 && j === 14 && this.board[i][j].tile !== undefined) {
          if (this.board[i - 1][j].tile === undefined && this.board[i][j - 1].tile === undefined && this.first !== 0) {
            this.check = false;
          }
        }
        else if (i === 0 && j === 14 && this.board[i][j].tile !== undefined) {
          if (this.board[i + 1][j].tile === undefined && this.board[i][j - 1].tile === undefined && this.first !== 0) {
            this.check = false;
          }
        }
        else {
          if (this.board[i][j].tile !== undefined) {
            if (this.board[i + 1][j].tile === undefined && this.board[i][j + 1].tile === undefined &&
              this.board[i][j - 1].tile === undefined && this.board[i - 1][j].tile === undefined && this.first !== 0) {
              this.check = false;

            }
          }
        }
      }
    }
  }

  makeCollectedWordsToArray(x, y) {


    if (x.length !== 0) {
      let a = x.split(',');
      for (let i = 0; i < a.length; i++) {
        if (a[i] === '' || a[i] === undefined) {
          continue;
        } else {
          if (i === a.length - 2) {
            this.lastWord = a[i];
          }
          this.wordHolder.push(a[i]);
        }
      }
    }
    if (y.length !== 0) {
      let b = y.split(',');
      for (let i = 0; i < b.length; i++) {
        if (b[i] === '' || b[i] === undefined) {
          continue;
        } else {
          if (i === b.length - 2) {
            this.lastWord1 = b[i];
          }
          this.wordHolder.push(b[i]);
        }
      }
    }


    for (let i = 0; i < this.wordHolder.length; i++) {
      if (this.wordHolder[i] === '') {
        this.wordHolder.splice(i, 1);
      }
    }

  }

  checkIfOnlyOneWord() {
    this.indexholder.sort(function (a, b) {
      if (a[0] === b[0]) {
        return 0;
      }
      else {
        return (a[0] < b[0]) ? -1 : 1;
      }
    });

    this.indexholder.sort(function (a, b) {
      if (a[1] === b[1]) {
        return 0;
      }
      else {
        return (a[1] < b[1]) ? -1 : 1;
      }
    });

    let temp = this.indexholder[0][0];
    let temp1 = this.indexholder[0][1];
    let end = this.indexholder[this.indexholder.length - 1][1];
    let end1 = this.indexholder[this.indexholder.length - 1][0];
    let count = 0;
    let count1 = 0;
    let check = false;
    let check1 = false;


    for (let i = 0; i < this.indexholder.length; i++) {
      if (temp === this.indexholder[i][0]) {
        count++;
      }
    }

    for (let i = 0; i < this.indexholder.length; i++) {
      if (temp1 === this.indexholder[i][1]) {
        count1++;
      }

    }
    if (count === this.indexholder.length) {
      for (let i = temp1; i <= end; i++) {
        if (this.board[temp][i].tile === undefined) {
          check = false;
          break;
        } else {
          check = true;
        }
      }
    } else {
      check = false;
    }


    if (count1 === this.indexholder.length) {
      for (let i = temp; i <= end1; i++) {
        if (this.board[i][temp1].tile === undefined) {
          check1 = false;
          break;
        } else {
          check1 = true;
        }
      }
    } else {
      check1 = false;
    }

    if (check === false && check1 === false) {
      return false;
    } else {
      return true;
    }

  }

  addNewIndex() {
    this.correctIndexHolder = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j].tile !== undefined) {
          if (this.board[i][j].tile === '') { continue; }
          this.correctIndexHolder.push([i, j]);
        }
      }
    }

  }

  checkIfConnected() {

    let rowPlus = [];
    let rowMinus = [];
    let collumPlus = [];
    let collumMinus = [];

    for (let i = 0; i < this.indexholder.length; i++) {
      rowPlus.push([this.indexholder[i][0] + 1, this.indexholder[i][1]]);
    }

    for (let i = 0; i < this.indexholder.length; i++) {
      rowMinus.push([this.indexholder[i][0] - 1, this.indexholder[i][1]]);
    }

    for (let i = 0; i < this.indexholder.length; i++) {
      collumPlus.push([this.indexholder[i][0], this.indexholder[i][1] + 1]);
    }

    for (let i = 0; i < this.indexholder.length; i++) {
      collumMinus.push([this.indexholder[i][0], this.indexholder[i][1] - 1]);
    }


    for (let i = 0; i < this.correctIndexHolder.length; i++) {
      for (let j = 0; j < this.indexholder.length; j++) {
        if (this.correctIndexHolder[i][0] === rowPlus[j][0] && this.correctIndexHolder[i][1] === rowPlus[j][1]) {
          this.validTiles = true;
          return true;
        }
        if (this.correctIndexHolder[i][0] === rowMinus[j][0] && this.correctIndexHolder[i][1] === rowMinus[j][1]) {
          this.validTiles = true;
          return true;
        }
        if (this.correctIndexHolder[i][0] === collumPlus[j][0] && this.correctIndexHolder[i][1] === collumPlus[j][1]) {
          this.validTiles = true;
          return true;
        }
        if (this.correctIndexHolder[i][0] === collumMinus[j][0] && this.correctIndexHolder[i][1] === collumMinus[j][1]) {
          this.validTiles = true;
          return true;
        } else {
          this.validTiles = false;
        }
      }
    }

  }

  countPoints() {

    console.log('indexholder', this.indexholder);
    console.log('placedtiles', this.placedTiles);

    let points = 0;
    this.placedTiles.forEach(x => {
      points += x.points;
    })

    for (let i = 0; i < this.indexholder.length; i++) {
      if (this.board[this.indexholder[i][0]][this.indexholder[i][1]].special === 'middle') {

      }
      if (this.board[this.indexholder[i][0]][this.indexholder[i][1]].special === 'orange') {
        points = points * 2;
      }
      if (this.board[this.indexholder[i][0]][this.indexholder[i][1]].special === 'red') {
        points = points * 3;
      }
      if (this.board[this.indexholder[i][0]][this.indexholder[i][1]].special === 'lightblue') {
        points = this.placedTiles[i].points * 2;
      }
      if (this.board[this.indexholder[i][0]][this.indexholder[i][1]].special === 'blue') {
        points = this.placedTiles[i].points * 3;
      }
    }
    console.log(points);
  }

}