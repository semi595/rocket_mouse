import Phaser from 'phaser'
import './style.css'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'
import GameOver from './scenes/GameOver'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1068,
    height: 640,
    fullscreenTarget: 'full',
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      // debug: true,
    },
  },
  scene: [Preloader, Game, GameOver],
}

export default new Phaser.Game(config)
