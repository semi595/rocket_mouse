import AnimationKeys from '~/consts/AnimationKeys'
import EventKeys from '~/consts/EventKeys'
import SceneKeys from '~/consts/SceneKeys'
import TextureKeys from '~/consts/TextureKeys'

enum MouseState {
  Running,
  Killed,
  Dead,
}

export default class RocketMouse extends Phaser.GameObjects.Container {
  private mouseState = MouseState.Running
  private flames: Phaser.GameObjects.Sprite
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private mouse: Phaser.GameObjects.Sprite

  private enableJetpack(enabled: boolean) {
    this.flames.setVisible(enabled)
  }

  kill() {
    if (this.mouseState !== MouseState.Running) {
      return
    }

    this.mouseState = MouseState.Killed

    this.mouse.play(AnimationKeys.RocketMouseDead)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAccelerationY(0)
    body.setVelocity(980, 0)
    this.enableJetpack(false)
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.mouse = scene.add
      .sprite(0, 0, TextureKeys.RocketMouse)
      .setOrigin(0.5, 1)
      .play(AnimationKeys.RocketMouseRun)

    this.flames = scene.add
      .sprite(-63, -15, TextureKeys.RocketMouse)
      .play(AnimationKeys.RocketFlamesOn)

    this.enableJetpack(false)

    this.add(this.flames)
    this.add(this.mouse)

    // add a physics body
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(this.mouse.width, this.mouse.height)
    body.setOffset(this.mouse.width * -0.5, -this.mouse.height)

    this.cursors = scene.input.keyboard.createCursorKeys()
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body
    // switch on this.mouseState
    switch (this.mouseState) {
      // move all previous code into this case
      case MouseState.Running: {
        if (this.cursors.space?.isDown) {
          body.setAccelerationY(-600)
          this.enableJetpack(true)
          this.mouse.play(AnimationKeys.RocketMouseFly, true)
        } else {
          body.setAccelerationY(0)
          this.enableJetpack(false)
        }

        if (body.blocked.down) {
          this.mouse.play(AnimationKeys.RocketMouseRun, true)
        } else if (body.velocity.y > 0) {
          this.mouse.play(AnimationKeys.RocketMouseFall, true)
        }

        // don't forget the break statement
        break
      }
      case MouseState.Killed: {
        // reduce velocity to 99% of current value
        body.velocity.x *= 0.98

        // once less than 5 we can say stop
        if (body.velocity.x <= 5) {
          this.mouseState = MouseState.Dead
        }
        break
      }
      case MouseState.Dead: {
        // make a complete stop
        body.setVelocity(0, 0)
        this.scene.game.events.emit(EventKeys.Dead)
        break
      }
    }
  }
}