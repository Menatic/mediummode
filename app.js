
var para = document.querySelector('p');
var count = 0;

var text = document.querySelector('h5');
text.textContent = 'Use arrow keys to catch all the balls!';

var canvas = document.querySelector('canvas');
var content = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

function random(min,max) {
	var num = Math.floor(Math.random()*(max-min)) + min;
	return num;
}
function Shape() {
	this.x = random(0, width);
	this.y = random(0, height);
	this.velocityX = random(-7, 7);
	this.velocityY = random(-7, 7);
	this.exist = true;
}
function normalBall(x, y, velocityX, velocityY, exist) {
	Shape.call(this, x, y, velocityX, velocityY, exist);
	this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
	this.size = random(10, 20);
}
normalBall.prototype = Object.create(Shape.prototype);
normalBall.prototype.constructor = normalBall;

normalBall.prototype.draw = function() {
	content.beginPath();
	content.fillStyle = this.color;
	content.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
	content.fill();
};
normalBall.prototype.update = function() {
	if ((this.x + this.size) >= width) {
		this.velocityX = -(this.velocityX);
	}

	if ((this.x - this.size) <= 0) {
		this.velocityX = -(this.velocityX);
	}

	if ((this.y + this.size) >= height) {
		this.velocityY = -(this.velocityY);
	}

	if ((this.y - this.size) <= 0) {
		this.velocityY = -(this.velocityY);
	}

	this.x += this.velocityX;
	this.y += this.velocityY;
};
normalBall.prototype.collisionDetect = function() {
	for(var j=0; j< balls.length; j++) {
		if(!(this === balls[j])) {
			var dx = this.x - balls[j].x;
			var dy = this.y - balls[j].y;
			var distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < this.size + balls[j].size) {
				balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
			}
		}
	}
};
function EvilSquare(x, y, exist) {
	Shape.call(this, x, y, exist);
	this.color = 'white';
	this.size = 25;
	this.velocityX = 20;
	this.velocityY = 20;
}

EvilSquare.prototype = Object.create(Shape.prototype);
EvilSquare.prototype.constructor = EvilSquare;

EvilSquare.prototype.draw = function() {
	content.beginPath();
	content.fillStyle = this.color;
	content.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
};

EvilSquare.prototype.checkBounds = function() {
	if ((this.x + this.size) >= width) {
		this.x -= this.size ;
	}

	if ((this.x - this.size) <= 0) {
		this.x += this.size;
	}

	if ((this.y + this.size) >= height) {
		this.y -= this.size;
	}

	if ((this.y - this.size) <= 0) {
		this.y += this.size;
	}
};

EvilSquare.prototype.setControls = function() {
	var _this = this;
	window.onkeydown = function(e) {
		if (e.keyCode === 37) {
			_this.x -= _this.velocityX; 
		} else if (e.keyCode === 39) {
			_this.x += _this.velocityX;
		} else if (e.keyCode === 38) {
			_this.y -= _this.velocityY;
		} else if (e.keyCode === 40) {
			_this.y += _this.velocityY;
		}
	};
};

EvilSquare.prototype.collisionDetect = function() {
	for(var j=0; j< balls.length; j++) {
		if(balls[j].exist) {
			var distance = Math.hypot(this.x - balls[j].x, this.y - balls[j].y);

			if (distance < this.size + balls[j].size) {
				balls[j].exist = false;
				count--;
        		para.textContent = 'Balls left: ' + count;
			}
		}
	}
};
var balls = [];
var EvilSquare = new EvilSquare();
EvilSquare.setControls();

function loop()	{
	content.fillStyle = 'rgba(0,0,0,0.3)';
	content.fillRect(0,0,width,height);
	while (balls.length<50) {
		var ball = new normalBall();
		balls.push(ball);
		count++;
		para.textContent = 'Balls left: ' + count;
	}
	for(var i=0;i<balls.length;i++) {
		if (balls[i].exist) {
			balls[i].draw();
			balls[i].update();
			balls[i].collisionDetect();
		}
		EvilSquare.draw();
		EvilSquare.checkBounds();
		EvilSquare.collisionDetect();
  }

  if (count === 0) {
    balls = [];
    for (var i = 0; i < 50; i++) {
      var ball = new normalBall();
      balls.push(ball);
      count++;
      para.textContent = 'Balls left: ' + count;
    }
  }
  requestAnimationFrame(loop);
}

loop();
