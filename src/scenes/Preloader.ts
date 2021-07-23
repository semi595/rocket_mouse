import AnimationKeys from '~/consts/AnimationKeys'
import EventKeys from '~/consts/EventKeys'
import SceneKeys from '~/consts/SceneKeys'
import TextureKeys from '~/consts/TextureKeys'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.load.image(TextureKeys.Background, 'house/bg_repeat_340x640.png')

    this.load.image(TextureKeys.MouseHole, 'house/object_mousehole.png')

    this.load.image(TextureKeys.Window1, 'house/object_window1.png')
    this.load.image(TextureKeys.Window2, 'house/object_window2.png')

    // load the bookcases
    this.load.image(TextureKeys.Bookcase1, 'house/object_bookcase1.png')
    this.load.image(TextureKeys.Bookcase2, 'house/object_bookcase2.png')

    // sprite atlases have frames of different sizes and are referenced by alphanumeric names like file names.
    this.load.atlas(
      TextureKeys.RocketMouse,
      'characters/rocket-mouse.png',
      'characters/rocket-mouse.json'
    )

    this.load.image(TextureKeys.LaserEnd, 'house/object_laser_end.png')
    this.load.image(TextureKeys.LaserMiddle, 'house/object_laser.png')

    this.load.image(TextureKeys.Coin, 'house/object_coin.png')
  }

  create() {
    this.initListeners()
    // previous run animation
    this.anims.create({
      key: AnimationKeys.RocketMouseRun,
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse, {
        start: 1,
        end: 4,
        prefix: 'rocketmouse_run',
        zeroPad: 2,
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1, // -1 to loop forever
    })

    // create the flames animation
    this.anims.create({
      key: AnimationKeys.RocketFlamesOn,
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse, {
        start: 1,
        end: 2,
        prefix: 'flame',
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    })

    // fall animation
    this.anims.create({
      key: AnimationKeys.RocketMouseFall,
      frames: [
        {
          key: TextureKeys.RocketMouse,
          frame: 'rocketmouse_fall01.png',
        },
      ],
    })

    // fly animation:;
    this.anims.create({
      key: AnimationKeys.RocketMouseFly,
      frames: [
        {
          key: TextureKeys.RocketMouse,
          frame: 'rocketmouse_fly01.png',
        },
      ],
    })

    // dead animation
    this.anims.create({
      key: AnimationKeys.RocketMouseDead,
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse, {
        start: 1,
        end: 2,
        prefix: 'rocketmouse_dead',
        zeroPad: 2,
        suffix: '.png',
      }),
      frameRate: 10,
    })

    this.scene.start(SceneKeys.Game)
  }

  private initListeners() {
    this.game.events.on(EventKeys.Restart, () => {
      this.scene.stop(SceneKeys.GameOver)

      // stop and restart the Game scene
      this.scene.restart()
    })

    this.game.events.on(EventKeys.Dead, () => {
      // Runs the given Scene, but does not change the state of this Scene.
      if (!this.scene.isActive(SceneKeys.GameOver)) {
        this.scene.run(SceneKeys.GameOver)
      }
    })
  }
}
