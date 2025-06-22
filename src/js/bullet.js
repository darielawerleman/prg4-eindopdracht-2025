import { Actor, Vector, CollisionType } from 'excalibur';
import { Resources } from './resources.js';

export class Bullet extends Actor {
  constructor(pos, vel) {
    super({
      pos: pos,
      vel: vel,
      width: 5, 
      height: 10, 
      collisionType: CollisionType.Passive 
    });
    this.graphics.use(Resources.Bullet.toSprite());
  }

  update(engine, delta) {
    super.update(engine, delta);

    // Remove bullet if it goes out of the screen
    if (this.pos.y < 0 || this.pos.x < 0 || this.pos.x > engine.drawWidth) {
      this.kill();
    }
  }
}


