//
// SockSort by Elizabeth Rives & Charles Gust
//
// total number of socks is gridSize * gridSize
var nMaxScores = 4;
var gridSize = 4; // length of the socks gridSize
var nMaxSocks = gridSize * gridSize;
var sockMatch = [];// [nMaxSocks][nMaxSocks];
var sockHolder = []; //[nMaxSocks];
var sockDisplayOrder = []; //[nMaxSocks];
var matchLists;

function toNumber(sbNumber) {
  return parseInt(sbNumber,10);
}

//
// a Sock has two attributes, but could have more
// currently:
//    color: the sock color
//    stripeColor: the stripe color
// for instance: size, pattern, material, soil
function Sock(sockColor, stripeColor, displayOrder) {
  this.sockColor = sockColor;
  this.stripeColor = stripeColor;
  this.displayOrder = displayOrder;
  this.paired = false;      // a sock may only be matched if not already paired

  this.setPosition = function(row, column) {
    this.row = row;
    this.column = column;
  };
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
  matchLists = document.createElement("matchLists");  // maybe needs to be in function?
  var $ml = $(matchLists);
  var $j;

  for (var iScore=0; iScore < nMaxScores-1; iScore++) {
    $j = $("<ul>");
    $ml.append($j);
  }

  for (var iRow = 1; iRow < nMaxSocks; iRow++) {
    sockMatch[iRow] = new Array();
    for (var iCol = 0; iCol < iRow; iCol++) {
      var iMGRow = (sockHolder[iRow].sockColor == sockHolder[iCol].sockColor) ? 1:0;
      var iMGCol = (sockHolder[iRow].stripeColor == sockHolder[iCol].stripeColor) ? 1:0;
      var score = matchGrid[iMGRow][iMGCol];
      sockMatch[iRow][iCol] = score;

      // If we build the matchList now, we don't even need sockMatch
      //var mlElem = new matchListElem(iRow, iCol);
      if (score < nMaxScores-1) {
        // anything with nMaxScore is a leftover, so don't need a list
        var $jLi = $("<li>{" + iRow + "," + iCol + "}</li>");
        $jLi.attr("data-row", iRow);
        $jLi.attr("data-col", iCol);

        $j = $ml;
        $j = $j.find(" ul:eq(" + score + ")");
        $j = $j.append($jLi);
      }
    }
  }
}

var sockColorMapping = [
      "black", //hsl(  0,100,  0)", // black
      "black", //hsl(  0,100,  0)", // black
      "white", //hsl(  0,100,100)", // white
      "white", //hsl(  0,100,100)", // white
      "yellow", //hsl(  0,100, 50)", // color1
      "red",  //hsl( 90,100, 50)", // color2
      "pink", //hsl(180,100, 50)", // color3
      "blue", //hsl(270,100, 50)"  // color4
];

function randomSockColor() {
  return sockColorMapping[Math.floor(Math.random() * 8)];
}

function generateSocksRandom() {
  for (n = 0; n < nMaxSocks; n++) {
    sockHolder[n] = new Sock(randomSockColor(), randomSockColor(), n);
    sockDisplayOrder[n] = n;
  }
}

function makeDivs() {

  for (var i = 0; i < nMaxSocks; i++) {
    var $newDiv = $('<div class="four columns laundrybasket__sock"></div>');
    $('#laundrybasket').append($newDiv);
  }
}

function makeCanvasElems() {

$('.laundrybasket__sock').each(function(index) {
  var $newCanvas = $('<canvas id="' + index + '">' + '</canvas>');

  $(this).append($newCanvas);
});
}


function drawSocks() {

  $('.laundrybasket__sock').each(function(index) {

    var elSock = document.getElementById(index);
    var ctx = elSock.getContext('2d');

    ctx.fillStyle = sockHolder[index].sockColor;
    ctx.fillRect(100, 10, 65, 75);

    ctx.fillStyle = sockHolder[index].stripeColor;
    ctx.fillRect(100, 20, 65, 10);

    ctx.moveTo(165, 85);
    ctx.lineTo(100, 65);
    ctx.strokeStyle = sockHolder[index].sockColor;
    ctx.stroke();
    ctx.lineTo(65, 110);
    ctx.stroke();
    ctx.lineTo(130, 115);
    ctx.stroke();
    ctx.lineTo(165, 85);
    ctx.fillStyle = sockHolder[index].sockColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(98, 110, 33, 6, Math.PI, false);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.fillStyle = sockHolder[index].sockColor;
    ctx.fill();
  });
}

// from http://stackoverflow.com/questions/698301/is-there-a-native-jquery-function-to-switch-elements
// swapping the canvas elements - hardcoded to test
function swapSocks() {

  setTimeout(function() {

  $('#1').before($('#2'));}, 5000);
}

function changeDisplayOrder(iSockIndex, iDisplayOrder) {
  // only move the sock if the sock's order changes
  if (sockHolder[iSockIndex].displayOrder != iDisplayOrder) {
    // save the index to be evicted and the display soon vacant for the swap
    var iSockIndexEvicted = sockDisplayOrder[iDisplayOrder];
    var iDisplaySoonVacant = sockHolder[iSockIndex].displayOrder;

    // swap the global display order
    sockDisplayOrder[iDisplayOrder] = iSockIndex;
    sockDisplayOrder[iDisplaySoonVacant] = iSockIndexEvicted;

    // swap each socks recording of it's display position
    sockHolder[iSockIndex].displayOrder = iDisplayOrder;
    sockHolder[iSockIndexEvicted].displayOrder = iDisplaySoonVacant;
  }
}
//
//  The matchLists element is the root of the jQuery data structure we have built
//  It has as many <ul> lists as we have possible scores, and the <li>'s in each
//  list has data-row and data-col set to indicate which tuple is represented.
//  Any sock that is already paired must be skipped over and cannot be paired again.
//
function sockSort() {
  var nCurSockCount = 0;
  var $ml = $(matchLists);
  var $j;

  // process all the possible scores, but we don't have to process the last
  // one because all of those are the left overs.
  for( var iScores = 0; iScores < nMaxScores-1; iScores++) {
      $j = $ml;
      $j = $j.find(" ul:eq(" + iScores + ")");
      $j = $j.find("li");
      $j.each(function() {
        if (nCurSockCount == nMaxSocks) {
          // early exit when no more socks to move
          return;
        }
        var iFirst = toNumber($(this).attr("data-row"));
        var iSecond = toNumber($(this).attr("data-col"));
        if ( (!sockHolder[iFirst].paired) && (!sockHolder[iSecond].paired)) {
          // we've got the next pair!!!
          sockHolder[iFirst].paired = true;
          sockHolder[iSecond].paired = true;

          changeDisplayOrder(iFirst, nCurSockCount++);
          changeDisplayOrder(iSecond, nCurSockCount++);
        }
      });
      if (nCurSockCount == nMaxSocks) {
        // early exit when no more socks can match
        break;
      }
  }
}


alert("start");
generateSocksRandom();
makeDivs();
makeCanvasElems();
drawSocks();
//swapSocks();
initializeGrid();
sockSort();



