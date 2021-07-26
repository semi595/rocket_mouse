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
    this.scene.start(SceneKeys.Game)
  }

  private initListeners() {
    this.game.events.on(EventKeys.Restart, () => {
      this.scene.sleep(SceneKeys.GameOver)
      this.scene.get(SceneKeys.Game)?.scene.restart()
    })

    this.game.events.on(EventKeys.Dead, () => {
      // Runs the given Scene, but does not change the state of this Scene.
      this.scene.run(SceneKeys.GameOver)
    })
  }
}
