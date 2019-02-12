import {SVG_NS} from '../settings';
export default class Ball {
    constructor(radius, boardWidth, boardHeight) {
        this.ping = new Audio("public/sounds/pong-01.wav");
        this.radius = radius;
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.direction = 1;
        this.reset();
        
    }
reset() {
    this.x = this.boardWidth / 2;
    this.y = this.boardHeight / 2;
    this.vy=0;
    while (this.vy === 0 ){
    this.vy = Math.floor(Math.random() * 10 - 5);
    } //????????????????????????????????????
    this.vx = this.direction * (6 - Math.abs(this.vy));
    // console.log(this.vx, this.vy)
}

wallCollision(){
    if (this.y - this.radius < 0 || this.y + this.radius > this.boardHeight) {
        this.vy *= -1;
    } else if (this.x - this.radius < 0 || this.x + this.radius > this.boardWidth) {
        this.vx *= -1;
    }
    // if (this.vy > 0 && this.vx > 0){
    //     console.log('itll hit the bottom edge')
    //     this.vy *=-1;
    // }

}
paddleCollision(player1, player2) {
    //if mpving towards right
    if(this.vx>0){
        //detect player2 paddle collision
        let paddle = player2.coordinates(player2.x, player2.y, player2.width, player2.height)
        let [leftX, rightX, topY, bottomY] = paddle;
        if ((this.x + this.radius >= leftX) //right of the ball is >= left edge of the paddle
        && (this.x + this.radius <= rightX) //right edge of the ball is <= right edge of paddle
        && (this.y >= topY && this.y <= bottomY)) //ball Y is >= paddle top Y 
        {
            this.vx = -this.vx;
        }
    } else {
        let paddle = player1.coordinates(player1.x, player1.y, player1.width, player1.height)
        let [leftX, rightX, topY, bottomY] = paddle;
        if ((this.x - this.radius <= rightX) //right of the ball is >= left edge of the paddle
        && (this.x - this.radius >= leftX) //right edge of the ball is <= right edge of paddle
        && (this.y >= topY && this.y <= bottomY)) //ball Y is >= paddle top Y 
        {
            this.vx = -this.vx;
        }
        //detect player1 paddle collision
    }

}
goal(player) {
    player.score ++;
    this.reset();
}


// ballFire(){
//     document.addEventListener("keydown", event => {
//         switch (event.key) {
//           case fireBall:
//           this.fireBall()

//           break;
//         }
//       });
// }
// fireBall() {
//     //console.log("KEYS.fireBall");
//     this.x = this.player.x;
//     this.y = this.player.y;
//     this.vy=0;
//     while (this.vy === 0 ){
//     this.vy = Math.floor(Math.random() * 10 - 5);
//     } //????????????????????????????????????
//     this.vx = this.direction * (6 - Math.abs(this.vy));
// }

render(svg, player1, player2) {
    this.x += this.vx;
    this.y += this.vy;
    this.wallCollision();
    this.paddleCollision(player1, player2);
    let circle = document.createElementNS(SVG_NS, 'circle')
    circle.setAttributeNS(null, "fill", "white");
    circle.setAttributeNS(null, "cx", this.x);
    circle.setAttributeNS(null, "cy", this.y);
    // this.ballFire();
    circle.setAttributeNS(null, "r", this.radius);
    svg.appendChild(circle);

  //Detect goal
  const rightGoal = this.x + this.radius >= this.boardWidth;
  const leftGoal = this.x - this.radius <= 0;
  if (rightGoal) {
      this.goal(player1);
      console.log(player1.score);
      this.direction =1;
  } else if (leftGoal) {
      this.goal(player2);
      this.direction = -1;
  }

  }
}