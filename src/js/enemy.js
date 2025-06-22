import { Actor, Color, CollisionType } from 'excalibur';
import { Resources } from './resources.js';
import { Bullet } from './bullet.js';

export class Enemy extends Actor {
  constructor(pos, vel) {
    super({
      pos: pos,
      vel: vel,
      width: 50,
      height: 50,
      color: Color.Red,
      collisionType: CollisionType.Active,
    });
    this.graphics.use(Resources.Enemy.toSprite());
  }

  onInitialize(engine) {
    this.on('precollision', (evt) => this.handleCollision(evt));
  }

  handleCollision(evt) {
    if (evt.other instanceof Bullet) {
      evt.other.kill();  // Destroy bullet
      this.kill();       // Destroy enemy

      if (this.onKilledByPlayer) {
        this.onKilledByPlayer();  // Update score
      }
    }
  }

  setKillCallback(callback) {
    this.onKilledByPlayer = callback;
  }

  update(engine, delta) {
    super.update(engine, delta);
    if (this.pos.y > engine.drawHeight || this.pos.x < 0 || this.pos.x > engine.drawWidth) {
      this.kill();
    }
  }
}


