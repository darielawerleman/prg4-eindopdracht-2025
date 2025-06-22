import { Actor, Vector, Input, CollisionType } from 'excalibur';
import { Bullet } from './bullet.js';

class Player extends Actor {
  #score;
  constructor(image, pos, keyBindings) {``
    super({
      pos: pos || new Vector(400, 300), // Initial position
      vel: new Vector(0, 0), // Initial velocity
      width: 50, 
      height: 50, 
      collisionType: CollisionType.Active,
    });
    this.graphics.use(image.toSprite());
    this.scale = new Vector(0.5, 0.5);
    this.keyBindings = keyBindings;
    this.engine = null;
    this.#score = 0;
  }

  onInitialize(engine) {
    this.engine = engine; // Store the engine reference

    engine.input.keyboard.on('hold', (evt) => this.handleKeyHold(evt));
    engine.input.keyboard.on('release', (evt) => this.handleKeyRelease(evt));
    engine.input.keyboard.on('press', (evt) => this.handleKeyPress(evt));
  }

  handleKeyHold(evt) {
    if (evt.key === this.keyBindings.left) {
      this.vel.x = -300; // Adjust speed 
    } else if (evt.key === this.keyBindings.right) {
      this.vel.x = 300; 
    } else if (evt.key === this.keyBindings.up) {
      this.vel.y = -300; 
    } else if (evt.key === this.keyBindings.down) {
      this.vel.y = 300; 
    }
  }

  handleKeyRelease(evt) {
    if (evt.key === this.keyBindings.left || evt.key === this.keyBindings.right) {
      this.vel.x = 0;
    } else if (evt.key === this.keyBindings.up || evt.key === this.keyBindings.down) {
      this.vel.y = 0;
    }
  }

  handleKeyPress(evt) {
    if (evt.key === this.keyBindings.shoot) {
      this.shoot();
    }
  }

  shoot() {
    const bullet = new Bullet(
      new Vector(this.pos.x, this.pos.y - this.height / 2),
      new Vector(0, -400) // Bullet speed
    );
    this.engine.add(bullet);
  }

  update(engine, delta) {
    super.update(engine, delta);

    // Keep the player within the screen bounds
    const halfWidth = this.width * this.scale.x / 2;
    const halfHeight = this.height * this.scale.y / 2;
    
    // Calculate boundaries
    const minX = halfWidth;
    const maxX = engine.drawWidth - halfWidth;
    const minY = halfHeight;
    const maxY = engine.drawHeight - halfHeight;

    // Clamp player's position
    if (this.pos.x < minX) {
      this.pos.x = minX;
    } else if (this.pos.x > maxX) {
      this.pos.x = maxX;
    }

    if (this.pos.y < minY) {
      this.pos.y = minY;
    } else if (this.pos.y > maxY) {
      this.pos.y = maxY;
    }
  }
}

export { Player };
