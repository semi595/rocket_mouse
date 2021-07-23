import EventKeys from '~/consts/EventKeys'
import SceneKeys from '../consts/SceneKeys'

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GameOver)
  }

  create() {
    const { width, height } = this.scale

    const [x, y] = [width * 0.5, height * 0.5]

    this.add
      .text(x, y, '按空格键重新挑战', {
        fontSize: '32px',
        color: '#ffffff',
        backgroundColor: '#000000',
        shadow: { fill: true, blur: 0, offsetY: 0 },
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
      })
      .setOrigin(0.5)

    this.input.keyboard.once('keydown-SPACE', () => {
      this.game.events.emit(EventKeys.Restart)
    })
  }
}
