function drawSock() {

  var elSock = document.getElementById('sock-image');
  var ctx = elSock.getContext('2d');
  ctx.fillStyle = '#6600CC';
  ctx.fillRect(100, 10, 65, 75);

  ctx.fillStyle = '#FFFF33';
  ctx.fillRect(100, 20, 65, 10);

  ctx.moveTo(165, 85);
  ctx.lineTo(100, 65);
  ctx.strokeStyle = '#6600CC';
  ctx.stroke();
  ctx.lineTo(65, 110);
  ctx.stroke();
  ctx.lineTo(130, 115);
  ctx.stroke();
  ctx.lineTo(165, 85);
  ctx.fillStyle = '#6600CC';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(98, 110, 33, 6, Math.PI, false);
  ctx.closePath();
  ctx.lineWidth = 2;
  ctx.fillStyle = '#6600CC';
  ctx.fill();
}

drawSock();





