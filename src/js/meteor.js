import { Actor, Color, CollisionType } from 'excalibur';
import { Resources } from './resources.js';
import { Bullet } from './bullet.js';

export class Meteor extends Actor {
  constructor(pos, vel) {
    super({
      pos: pos,
      vel: vel,
      width: 30,
      height: 30,
      color: Color.Gray,
      collisionType: CollisionType.Active,
    });
    this.graphics.use(Resources.Meteor.toSprite());
  }

  onInitialize(engine) {
    this.on('precollision', (evt) => this.handleCollision(evt));
  }

  handleCollision(evt) {
    if (evt.other instanceof Bullet) {
      evt.other.kill();  // Destroy the bullet
      this.kill();       // Destroy the meteor
    }
  }

  update(engine, delta) {
    super.update(engine, delta);

    if (this.pos.y > engine.drawHeight || this.pos.x < 0 || this.pos.x > engine.drawWidth) {
      this.kill();
    }
  }
}

