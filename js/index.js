//
// SockSort by Elizabeth Rives & Charles Gust
//
// total number of socks is gridSize * gridSize
var gridSize = 4; // length of the socks gridSize
var nMaxSocks = gridSize * gridSize;
var sockMatch = [];// [nMaxSocks][nMaxSocks];
var sockHolder = []; //[nMaxSocks];



//
// a Sock has two attributes, but could have more
// currently:
//    color: the sock color
//    stripeColor: the stripe color
// for instance: size, pattern, material, soil
function Sock(sockColor, stripeColor) {
  this.sockColor = sockColor;
  this.stripeColor = stripeColor;

  this.setPosition = function(row, column) {
    this.row = row;
    this.column = column;
  }

  this.drawSock = function() {
    var elSock = document.getElementById('sock-image');
    var ctx = elSock.getContext('2d');

    ctx.fillStyle = this.sockColor;
    ctx.fillRect(100, 10, 65, 75);

    ctx.fillStyle = this.stripeColor;
    ctx.fillRect(100, 20, 65, 10);

    ctx.moveTo(165, 85);
    ctx.lineTo(100, 65);
    ctx.strokeStyle = this.sockColor;
    ctx.stroke();
    ctx.lineTo(65, 110);
    ctx.stroke();
    ctx.lineTo(130, 115);
    ctx.stroke();
    ctx.lineTo(165, 85);
    ctx.fillStyle = this.sockColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(98, 110, 33, 6, Math.PI, false);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.fillStyle = this.sockColor;
    ctx.fill();

    return elSock;
  }
}

//
// used to change the position of two socks
// This function intentionally does not use two calls to a swap function to
//  reserve the possibility that the exchange could be visualized or animated
//
function exchangePosition(sock1, sock2) {
  var swapColumn;
  var swapRow;

  swapRow = sock1.row;
  swapColumn = sock1.column;
  sock1.row = sock2.row;
  sock1.column = sock2.column;
  sock2.row = swapRow;
  sock2.column = swapColumn;
}

//
// We use O(n^2) space to generate a grid that will give us how closely matched we are
// With such a small number of attributes, it's clear that the sequence of best matches
// is:
//    matchExact        sockColor && stripeColor
//    matchClose        sockColor
//    matchTechnical     stripeColor
//    matchImpossible
//
// For now, these will be represented in ascending order. That is, an exact match will
// have the smallest number at x,y. Also, we only have to calculate half of the grid, so
// we will only fill in the grid where column < row.
//
var matchExact = 0;
var matchClose = 1;
var matchTechnical = 2;
var matchImpossible = 3;
var matchGrid = [[matchImpossible, matchTechnical],[matchClose, matchExact]];

function initializeGrid() {
  for (var iRow = 1; iRow < nMaxSocks; iRow++) {
    sockMatch[iRow] = new Array();
    for (var iCol = 0; iCol < iRow; iCol++) {
      //var score = matchImpossible;

      var iMGRow = (sockHolder[iRow].sockColor == sockHolder[iCol].sockColor) ? 1:0;
      var iMGCol = (sockHolder[iRow].stripeColor == sockHolder[iCol].stripeColor) ? 1:0;
      var score = matchGrid[iMGRow][iMGCol];
      sockMatch[iRow][iCol] = score;
/*
      if (sockHolder[row].sockColor == sockHolder[column].sockColor) {
        if (sockHolder[row].stripeColor == sockHolder[column].stripeColor) {
          score = matchExact;
        } else {
          score = matchClose;
        }
      } else {
        if (sockHolder[row].stripeColor == sock)
      }
    */

    //sockMatch[row][column] = score;
    }
  }
}

var sockColorMapping = [
      "hsl(  0,100,  0)",
      "hsl(  0,100,  0)",
      "hsl(  0,100,100)",
      "hsl(  0,100,100)",
      "hsl(  0,100, 50)",
      "hsl( 90,100, 50)",
      "hsl(180,100, 50)",
      "hsl(270,100, 50)"
];

function randomSockColor() {
  return sockColorMapping[Math.floor(Math.random() * 8)];
}

function generateSocksRandom() {
  for (n = 0; n < nMaxSocks; n++) {
    sockHolder[n] = new Sock(randomSockColor(), randomSockColor());
  }
}

function makeVisualSocks()
{
  for (var iSock = 0; iSock < sockHolder.length; iSock++) {
    var elSockImage = sockHolder[iSock].drawSock();

    var $p = $("sockimage");

    $(p) = $(p).clone();

    $(p) = $(p).html(function() { return "<div>" + $(this).text() + "</div>"; });
    $(p) = $(p).addClass("four columns sock-gallery__sock");
    $(p) = $(p).appendTo($("laundrybasket"));
  }

}

alert("start");
generateSocksRandom();
initializeGrid();
makeVisualSocks();

