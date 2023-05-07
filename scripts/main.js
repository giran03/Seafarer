import PreLoadScene from "./scenes/PreLoadScene.js";
import OverlaySceneLevel1 from "./scenes/OverlayScenes/OverlaySceneLevel1.js";
import MainMenuScene from "./scenes/MainMenuScene.js";
import CreditScene from "./scenes/CreditScene.js";
// GAME LEVELS
import GameSceneLevel1 from "./scenes/GameScenes/GameSceneLevel1.js";
import GameSceneLevel2 from "./scenes/GameScenes/GameSceneLevel2.js";
import GameSceneLevel3 from "./scenes/GameScenes/GameSceneLevel3.js";
import GameSceneLevel4 from "./scenes/GameScenes/GameSceneLevel4.js";

import GameVictoryScene from "./scenes/GameVictoryScene.js";
import GameOverScene from "./scenes/GameOverScene.js";

var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1300 }
        }
    },
    fps: {
        limit: 120,
        forceSetTimeOut: true
    },
    scene: [PreLoadScene,
            MainMenuScene,
            CreditScene,
            OverlaySceneLevel1,
            GameSceneLevel1,
            GameSceneLevel2,
            GameSceneLevel3,
            GameSceneLevel4,
            GameVictoryScene,
            GameOverScene],
    render: {
        pixelArt: true
    }
}

const game = new Phaser.Game(config)