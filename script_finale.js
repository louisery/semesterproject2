/* Canvas Text Finale Page */
/*
var canvas = document.getElementById("canvas1");

if(canvas.getContext){
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height / 2;

ctx.font = 'bold 30px Helvetica';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = '#ffffff';
ctx.fillText('Congratulations! You won!', x, y);
}
else{
alert('Your browser doesnt support HTML canvas please upgrade it');
}

*/


/* Balls */

window.onload = function() {
  var ctx;
  var width = 1000,
  height = 500;
  var balls = [
    { x: 0, y: 0, dx: 3, dy: 7, r: 10 },
    { x: 90, y: 90, dx: 7, dy: 3, r: 15 },
    { x: 100, y: 100, dx: 6, dy: 4, r: 20 },
    { x: 150, y: 150, dx: 4, dy: 6, r: 10 },
    { x: 200, y: 200, dx: 3, dy: 7, r: 15 },
    { x: 250, y: 250, dx: 4, dy: 6, r: 20 },
    { x: 250, y: 250, dx: 7, dy: 3, r: 25 },
    { x: 300, y: 300, dx: 6, dy: 4, r: 10 },
    { x: 350, y: 350, dx: 7, dy: 3, r: 15 },
    { x: 400, y: 400, dx: 3, dy: 7, r: 20 },
    { x: 450, y: 450, dx: 4, dy: 6, r: 25 }
  ];

  function init() {
    var canvas = document.getElementById('canvas_balls');
    ctx = canvas.getContext('2d');
    setInterval(onMove, 15);
  }

  function onMove() {
    ctx.clearRect(0, 0, width, height);
    ctx.font = "40px mason-serif";
    ctx.fillText("Congratulations!", 310, 160);
    ctx.fillText("You're the winner!", 310, 200);
    ctx.fillStyle = '#FFFF19';
    ctx.beginPath();
    var i;
    for (i = 0; i < balls.length; i++) {
      moveBall(balls[i]);
      ballPath(balls[i], ctx);
    }
    ctx.fill();
  }
  function ballPath(ball, ctx) {
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
    ctx.moveTo(ball.x + ball.y, ball.r);

  }
  function moveBall(ball) {
    if (ball.x < 0 || ball.x > width) ball.dx = -ball.dx;
    if (ball.y < 0 || ball.y > height) ball.dy = -ball.dy;
    ball.x += ball.dx;
    ball.y += ball.dy;
  }
  init();
};
