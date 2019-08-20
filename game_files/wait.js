const anim = document.getElementById("waitAnim");
anim.width = 300;
anim.height = 300;
anim.style.position = "absolute";
const animCtx = anim.getContext("2d");

class Bubble {
	constructor(x, y, w = 20, color = "black") {
  	this.x = x;
    this.y = y;
    this.w = w;
    this.color = color;
  }
  findNextStep() {
    if (this.y === 0 && this.x < 200) {
      this.x += 10;
    } else if (this.x === 200 && this.y < 200) {
      this.y += 1;
    } else if (this.y === 200 && this.x > 1) {
      this.x -= 10;
    } else {
      this.y -= 1;
    }
  }
}

const bubbles = [new Bubble(0, 0), new Bubble(100, 0), new Bubble(200, 0),
 new Bubble(200, 200), new Bubble(100, 200), new Bubble(0, 200)];
 
/*  const bubbles = [new Bubble(0, 0), new Bubble(200, 0),
 new Bubble(200, 200), new Bubble(0, 200) ]; */

setInterval(() => {
  anim.style.left = ((innerWidth / 2) - (anim.width / 2)) + "px";
  anim.style.top = ((innerHeight /2) - (anim.height / 2)) + "px";
  animCtx.clearRect(0, 0, anim.width, anim.height);
  animCtx.strokeRect(50, 50, 200, 200);
  
  for (let i = 0; i < bubbles.length; i++) {
  	bubbles[i].findNextStep();
  	animCtx.fillStyle = bubbles[i].color;
    animCtx.beginPath();
    animCtx.arc(50 + bubbles[i].x, 50 + bubbles[i].y, bubbles[i].w,
    0, Math.PI * 2);
    animCtx.fill();
  }
  
}, 10);
