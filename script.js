const canvas = document.getElementById("canvas-id");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

class Character {
  constructor({ posisi, velocity, warna = "red", offset }) {
    this.posisi = posisi;
    this._velocity = velocity;
    this.height = 150;
    this.lastKey;
    this._attackBox = {
      posisi: {
        x: this.posisi.x,
        y: this.posisi.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this._warna = warna;
    this._isAttacking;
    this._health = 100;
  }

  getHealth() {
    return this._health;
  }

  getWarna() {
    return this._warna;
  }

  getVelocityX() {
    return this._velocity.x;
  }

  getVelocityY() {
    return this._velocity.y;
  }

  getIsAttacking() {
    return this._isAttacking;
  }

  getAttackBoxPosisiX() {
    return this._attackBox.posisi.x;
  }

  getAttackBoxWidth() {
    return this._attackBox.width;
  }

  setVelocityX(velocityx) {
    this._velocity.x = velocityx;
  }

  setVelocityY(velocity) {
    this._velocity.y = velocity;
  }

  setHealth(health) {
    this._health = health;
  }

  setWarna(warna) {
    this._warna = warna;
  }

  setIsAttacking(isAttacking) {
    this._isAttacking = isAttacking;
  }

  draw() {
    c.fillStyle = this._warna;
    c.fillRect(this.posisi.x, this.posisi.y, 50, this.height);

    // attack box
    if (this._isAttacking) {
      c.fillStyle = "blue";
      c.fillRect(
        this._attackBox.posisi.x,
        this._attackBox.posisi.y,
        this._attackBox.width,
        this._attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this._attackBox.posisi.x = this.posisi.x + this._attackBox.offset.x;
    this._attackBox.posisi.y = this.posisi.y;

    this.posisi.x += this._velocity.x;
    this.posisi.y += this._velocity.y;

    if (this.posisi.y + this.height >= canvas.height) {
      this._velocity.y = 0;
    } else {
      this._velocity.y += gravity;
    }
  }
  attack() {
    this._isAttacking = true;
    setTimeout(() => {
      this._isAttacking = false;
    }, 100);
  }
}

class Character2 extends Character {}

const player = new Character({
  posisi: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Character2({
  posisi: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  warna: "green",
});

const keys = {
  a: {
    pencet: false,
  },
  d: {
    pencet: false,
  },
  w: {
    pencet: false,
  },
  ArrowLeft: {
    pencet: false,
  },
  ArrowRight: {
    pencet: false,
  },
};

function kotakSerangan({ kotak1, kotak2 }) {
  return (
    kotak1.getAttackBoxPosisiX() + kotak1.getAttackBoxWidth() >=
      kotak2.getAttackBoxPosisiX() &&
    kotak1.getAttackBoxPosisiX() <=
      kotak2.getAttackBoxPosisiX() + kotak2.getAttackBoxWidth() &&
    kotak1.posisi.y <= kotak2.posisi.y + kotak2.height &&
    kotak1.posisi.y + kotak1.height >= kotak2.posisi.y
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  // reset velocity
  player.setVelocityX(0);
  enemy.setVelocityX(0);

  // player1 movement
  if (keys.a.pencet && player.lastKey === "a") {
    player.setVelocityX(-3);
  } else if (keys.d.pencet && player.lastKey === "d") {
    player.setVelocityX(3);
  }

  // enemy movement
  if (keys.ArrowLeft.pencet && enemy.lastKey === "ArrowLeft") {
    enemy.setVelocityX(-3);
  } else if (keys.ArrowRight.pencet && enemy.lastKey === "ArrowRight") {
    enemy.setVelocityX(3);
  }

  // ngecek kalo nyerang kena
  if (
    kotakSerangan({
      kotak1: player,
      kotak2: enemy,
    }) &&
    player.getIsAttacking()
  ) {
    player.setIsAttacking(false);
    enemy.setHealth(enemy.getHealth() - 20);
    document.getElementById("nyawaMusuh").style.width = enemy.getHealth() + "%";
    console.log("kena LU");
  }

  if (
    kotakSerangan({
      kotak1: enemy,
      kotak2: player,
    }) &&
    enemy.getIsAttacking()
  ) {
    enemy.setIsAttacking(false);
    player.setHealth(player.getHealth() - 20);
    document.getElementById("nyawaPlayer").style.width =
      player.getHealth() + "%";

    console.log("kena juga LU");
  }
}

animate();

document.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    // player1
    case "d":
      keys.d.pencet = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pencet = true;
      player.lastKey = "a";
      break;
    case "w":
      player.setVelocityY(-10);
      break;
    case " ":
      player.attack();
      break;

    // enemy
    case "ArrowRight":
      keys.ArrowRight.pencet = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pencet = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.setVelocityY(-10);
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pencet = false;
      break;
    case "a":
      keys.a.pencet = false;
      break;

    // enemy
    case "ArrowRight":
      keys.ArrowRight.pencet = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pencet = false;
      break;
  }
});
