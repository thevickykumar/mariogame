// import platform from './img/platform.png'
//console.log(platform)
// const image = new Image();
// image.src = './img/platform.png'
const platform = new Image();
platform.src = "./img/platform.png";

const hills = new Image();
hills.src = "./img/hills.png";

const background = new Image();
background.src = "./img/background.png";

const platformSmallTall = new Image();
platformSmallTall.src = "./img/platformSmallTall.png";
//console.log(image);

const spriteRunLeft = new Image();
spriteRunLeft.src = "./img/spriteRunLeft.png";

const spriteRunRight = new Image();
spriteRunRight.src = "./img/spriteRunRight.png";

const spriteStandLeft = new Image();
spriteStandLeft.src = "./img/spriteStandLeft.png";

const spriteStandRight = new Image();
spriteStandRight.src = "./img/spriteStandRight.png";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 60;
    this.height = 130;
    this.image = createImage(spriteStandRight.src);
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight.src),
        left: createImage(spriteStandLeft.src),
        CropWidth: 177,
        width: 66,
      },
      run: {
        right: createImage(spriteRunRight.src),
        left: createImage(spriteRunLeft.src),
        CropWidth: 341,
        width: 127.875,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }
  draw() {
    c.drawImage(
      // this.image,
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update() {
    this.frames++;
    if (
      (this.frames > 59 && this.currentSprite === this.sprites.stand.right) ||
      this.currentSprite === this.sprites.stand.left
    )
      this.frames = 0;
    else if (
      (this.frames > 29 && this.currentSprite === this.sprites.run.right) ||
      this.currentSprite === this.sprites.run.left
    )
      this.frames = 0;

    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
  }
}
class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}
class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
let platformImage = createImage(platform.src);
let platformSmallTallImage = createImage(platformSmallTall.src);
let player = new Player();
let platforms = [];
let genericObjects = [];
let lastKey;
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

function init() {
  platformImage = createImage(platform.src);

  player = new Player();
  platforms = [
    new Platform({
      x:
        platformImage.width * 4 +
        300 -
        2 +
        platformImage.width -
        platformSmallTallImage.width,
      y: 270,
      image: createImage(platformSmallTall.src),
    }),
    new Platform({
      x: -1,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width - 3,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 3 + 300,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 4 + 300 - 2,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 5 + 700 - 2,
      y: 470,
      image: platformImage,
    }),
  ];
  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background.src),
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills.src),
    }),
  ];

  scrollOffset = 0;
}
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset == 0 && player.position.x > 0)
  ) {
    player.velocity.x -= 5;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.CropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.CropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.CropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.CropWidth;
    player.width = player.sprites.stand.width;
  }

  if (scrollOffset > platform.width * 5 + 300 - 2) console.log("you win");

  if (player.position.y > canvas.height) init();
}
init();
animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case 40:
      console.log("down");
      break;
    case 39:
      console.log("right");
      keys.right.pressed = true;
      lastKey = "right";
      break;
    case 38:
      console.log("up");
      player.velocity.y -= 25;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      console.log("left");
      keys.left.pressed = false;
      player.currentSprite = player.sprites.stand.left;
      player.currentCropWidth = player.sprites.stand.CropWidth;
      player.width = player.sprites.stand.width;
      break;
    case 40:
      console.log("down");
      break;
    case 39:
      console.log("right");
      keys.right.pressed = false;
      player.currentSprite = player.sprites.stand.right;
      player.currentCropWidth = player.sprites.stand.CropWidth;
      player.width = player.sprites.stand.width;
      break;
    case 38:
      console.log("up");
      break;
  }
});
