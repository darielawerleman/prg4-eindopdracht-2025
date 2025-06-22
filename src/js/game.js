import '../css/style.css';
import { Engine, Vector, DisplayMode, Timer, Scene, Input, Label, Font, FontUnit, Color } from 'excalibur';
import { Resources, ResourceLoader } from './resources.js';
import { Player } from './player.js';
import ScrollingBackground from './galaxy.js';
import { Enemy } from './enemy.js';
import { Meteor } from './meteor.js';
import { IntroScene } from './IntroScene.js';

export class Game extends Engine {
  constructor() {
    super({
      width: 1600,
      height: 910,
      displayMode: DisplayMode.FitScreen,
    });

    this.player2 = null;
    this.score = 0;
    this.gameOverLabel = null;

    this.start(ResourceLoader)
      .then(() => {
        this.startGame();
      })
      .catch((e) => console.error("Resource loading error:", e));
  }

  startGame() {
    // Label for score display
    this.label = new Label({
      text: 'Score: 0',
      pos: new Vector(100, 100),
      font: new Font({
        family: 'Arial',
        size: 24,
        unit: FontUnit.Px,
        color: Color.White
      })
    });
    this.add(this.label);

    const introScene = new IntroScene();
    this.add('intro', introScene);

    const mainGameScene = new Scene();
    this.add('main', mainGameScene);

    this.initializeMainGameScene(mainGameScene);

    this.goToScene('intro');
  }

  updateScore(score) {
    this.score = score;
    this.label.text = `Score: ${score}`;
  }

  initializeMainGameScene(scene) {
    scene.onInitialize = (engine) => {
      console.log('Starting the game!');

      const backgroundSpeed = 2;
      const scrollingBackground = new ScrollingBackground(engine, backgroundSpeed);
      scrollingBackground.initialize();

      const player1 = new Player(Resources.Player, new Vector(400, 300), {
        left: Input.Keys.Left,
        right: Input.Keys.Right,
        up: Input.Keys.Up,
        down: Input.Keys.Down,
        shoot: Input.Keys.Enter
      });
      engine.add(player1);

      engine.input.keyboard.on('press', (evt) => {
        if (!this.player2 && (evt.key === Input.Keys.W || evt.key === Input.Keys.A || evt.key === Input.Keys.S || evt.key === Input.Keys.D)) {
          this.deployPlayer2(engine);
        }
      });

      this.startSpawning(engine);

      player1.on('precollision', (evt) => {
        if (evt.other instanceof Enemy || evt.other instanceof Meteor) {
          this.gameOver(engine);
        }
      });
    };
  }

  deployPlayer2(engine) {
    this.player2 = new Player(Resources.Player2, new Vector(800, 300), {
      left: Input.Keys.A,
      right: Input.Keys.D,
      up: Input.Keys.W,
      down: Input.Keys.S,
      shoot: Input.Keys.Space
    });

    engine.add(this.player2);
    console.log('Player 2 deployed');

    // Collision detection for player2
    this.player2.on('precollision', (evt) => {
      if (evt.other instanceof Enemy || evt.other instanceof Meteor) {
        this.gameOver(engine);
      }
    });
  }

  startSpawning(engine) {
    const meteorTimer = new Timer({
      fcn: () => this.spawnMeteor(engine),
      interval: 5000,
      repeats: true,
    });
    engine.add(meteorTimer);
    meteorTimer.start();

    const enemyTimer = new Timer({
      fcn: () => this.spawnEnemy(engine),
      interval: 3000,
      repeats: true,
    });
    engine.add(enemyTimer);
    enemyTimer.start();
  }

  spawnMeteor(engine) {
    console.log('Spawning meteor');
    const pos = new Vector(Math.random() * engine.drawWidth, 0);
    const vel = new Vector(0, Math.random() * 100 + 50);
    const meteor = new Meteor(pos, vel);
    engine.add(meteor);
  }

  spawnEnemy(engine) {
    console.log('Spawning enemy');
    const pos = new Vector(Math.random() * engine.drawWidth, 0);
    const vel = new Vector(0, Math.random() * 100 + 50);
    const enemy = new Enemy(pos, vel);
    engine.add(enemy);
  }

  gameOver(engine) {
    console.log('Game Over!');
    engine.stop();

    if (!this.gameOverLabel) {
      this.gameOverLabel = new Label({
        text: 'GAME OVER!',
        pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2),
        font: new Font({
          family: 'Arial',
          size: 80,
          unit: FontUnit.Px,
          color: Color.Red,
          bold: true
        }),
        textAlign: 'center',
        textBaseline: 'middle',
      });
      this.gameOverLabel.anchor = new Vector(0.5, 0.5);
      engine.currentScene.add(this.gameOverLabel);
    }
  }
}

new Game();
