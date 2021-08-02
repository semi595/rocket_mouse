import AnimationKeys from '~/consts/AnimationKeys'
import EventKeys from '~/consts/EventKeys'
import SceneKeys from '~/consts/SceneKeys'
import TextureKeys from '~/consts/TextureKeys'

export enum MouseState {
  Running,
  Killed,
  Dead,
}

export default class RocketMouse extends Phaser.GameObjects.Container {
  mouseState = MouseState.Running
  private flames: Phaser.GameObjects.Sprite
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private mouse: Phaser.GameObjects.Sprite

  private createAnimations() {
    this.mouse.anims.create({
      key: AnimationKeys.RocketMouseRun,
      frames: this.mouse.anims.generateFrameNames(TextureKeys.RocketMouse, {
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
    this.mouse.anims.create({
      key: AnimationKeys.RocketFlamesOn,
      frames: this.mouse.anims.generateFrameNames(TextureKeys.RocketMouse, {
        start: 1,
        end: 2,
        prefix: 'flame',
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    })

    // fall animation
    this.mouse.anims.create({
      key: AnimationKeys.RocketMouseFall,
      frames: [
        {
          key: TextureKeys.RocketMouse,
          frame: 'rocketmouse_fall01.png',
        },
      ],
    })

    // fly animation:;
    this.mouse.anims.create({
      key: AnimationKeys.RocketMouseFly,
      frames: [
        {
          key: TextureKeys.RocketMouse,
          frame: 'rocketmouse_fly01.png',
        },
      ],
    })

    // dead animation
    this.mouse.anims.create({
      key: AnimationKeys.RocketMouseDead,
      frames: this.mouse.anims.generateFrameNames(TextureKeys.RocketMouse, {
        start: 1,
        end: 2,
        prefix: 'rocketmouse_dead',
        zeroPad: 2,
        suffix: '.png',
      }),
      frameRate: 10,
    })
  }

  private enableJetpack(enabled: boolean) {
    this.flames.setVisible(enabled)
  }

  kill() {
    if (this.mouseState !== MouseState.Running) {
      return
    }

    this.mouseState = MouseState.Killed

    this.mouse.play(AnimationKeys.RocketMouseDead)
    this.scene.cameras.main.shake(500)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAccelerationY(0)
    body.setVelocity(980, 0)
    this.enableJetpack(false)
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.mouse = scene.add.sprite(0, 0, TextureKeys.RocketMouse).setOrigin(0.5, 1)
    this.flames = scene.add.sprite(-63, -15, TextureKeys.RocketMouse)

    this.createAnimations()

    this.mouse.play(AnimationKeys.RocketMouseRun)

    this.enableJetpack(false)

    this.add(this.flames)
    this.add(this.mouse)

    // add a physics body
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(this.mouse.width * 0.5, this.mouse.height * 0.7)
    body.setOffset(this.mouse.width * -0.3, -this.mouse.height + 15)

    this.cursors = scene.input.keyboard.createCursorKeys()
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body
    // switch on this.mouseState
    switch (this.mouseState) {
      // move all previous code into this case
      case MouseState.Running: {
        if (this.cursors.space?.isDown || this.scene.input.activePointer?.isDown) {
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
        if (this.scene.scene.isActive(SceneKeys.GameOver)) {
          break
        }
        body.setVelocity(0, 0)
        this.scene.game.events.emit(EventKeys.Dead)
        break
      }
    }
  }
}
