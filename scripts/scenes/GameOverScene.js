export default class GameOverScene extends Phaser.Scene
{
    constructor() 
    { 
        super('GameOverScene')
    }

    create() {
        console.log('⚠️ GAME OVER SCENE!!!')
        this.scene.stop('OverlaySceneLevel1')
        this.scene.stop('OverlaySceneLevel2')
        this.scene.stop('OverlaySceneLevel3')
        this.sound.pauseAll()
        const loose_dialogues = ['loose_1', 'loose_2']
        // AUDIO
        this.sound.play('defeatSFX', {volume: 1})
        this.sound.play(loose_dialogues[Phaser.Math.Between(0,1)], {volume: 1.7})
        // INIT
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        const level1 = this.scene.get('GameSceneLevel1').data.get('playerScore')
        const level2 = this.scene.get('GameSceneLevel2').data.get('playerScore')
        const level3 = this.scene.get('GameSceneLevel3').data.get('playerScore')

        if(level1 != null) {
            this.playerScore = this.scene.get('GameSceneLevel1').data.get('playerScore')
            this.playerTime = this.scene.get('OverlaySceneLevel1').data.get('playerTime')
            this.gameScene = 'GameSceneLevel1'
        } else if (level2!= null) {
            this.playerScore = this.scene.get('GameSceneLevel2').data.get('playerScore')
            this.playerTime = this.scene.get('OverlaySceneLevel2').data.get('playerTime')
            this.gameScene = 'GameSceneLevel2'
        } else if(level3 != null) {
            this.playerScore = this.scene.get('GameSceneLevel3').data.get('playerScore')
            this.playerTime = this.scene.get('OverlaySceneLevel3').data.get('playerTime')
            this.gameScene = 'GameSceneLevel3'
        }
        
        // 🎥 BACKGROUND VIDEO AND LOGO 🎶
        let backgroundVideo = this.add.video(this.screenCenterX, this.screenCenterY, 'gameOverBG').play(true).setScale(2,2.5)
        backgroundVideo.preFX.addBokeh(3)
        let textLogo = this.add.image(this.screenCenterX*1.85, this.screenCenterY*1.9, 'textLogo').setScale(.05)

        const randText = ['A G A I N ! 🦈\n', 'G A M E  O V E R ! 👾\n', 'Y O U  L O O S E ! 🗿\n', 'T R Y  A G A I N ! 🔱\n', 'O N E  M O R E ! 👑\n']
        this.textCreate(this.screenCenterX, this.screenCenterY*.5, randText[Phaser.Math.Between(0,4)], true, 60)
        const scoreText = this.textCreate(-500, this.screenCenterY*.8, `Score: ${this.playerScore} `, true, 25)
        const timeText = this.textCreate(1500, this.screenCenterY, `Time Survived: ${this.playerTime} `, true, 25)
        
        this.tweenAnim_Handler(scoreText, this.screenCenterX*.62, this.screenCenterY*.8, 1300, 'Expo.easeInOut')
        this.tweenAnim_Handler(timeText, this.screenCenterX*.7, this.screenCenterY, 1000, 'Expo.easeInOut')


        this.restartBtn = this.add.sprite(this.screenCenterX*.8, this.screenCenterY*1.4, 'button').setOrigin(.5).setInteractive().setScale(3)
        this.mainMenuBtn = this.add.sprite(this.screenCenterX*1.2, this.screenCenterY*1.4, 'button').setOrigin(.5).setInteractive().setScale(3)
        
        const restartText = this.textCreate(this.screenCenterX*.8, this.screenCenterY*1.375, 'RESTART ', true)
        const mainMenuText = this.textCreate(this.screenCenterX*1.2, this.screenCenterY*1.375, 'MAIN MENU ', true)

        this.buttonInteract(this.restartBtn,{
            text: 'restart',
        })
        this.buttonInteract(this.mainMenuBtn,{
            text: 'mainMenu'
        })
    }

    textCreate(x, y, textDisplay, visible='false', fontSize='20px') {
        return this.add.text(x, y, textDisplay ,{ 
            fill: '#ffd059' , fontSize: fontSize, fontStyle: 'italic' , fontFamily: 'stackedPixel'
        }).setShadow(2, 2, '#000', 5, true, true).setOrigin(.5).setVisible(visible)
    }
    buttonInteract(button, config) {
        const buttons = [this.restartBtn, this.mainMenuBtn]
        button.on("pointerover", ()=>{
            button.setTint(0xffb0ab)
            button.preFX.addGlow(0xff8b6e, 8)
            button.preFX.addShine(1.5)

            buttons.forEach((index)=>{
                if(button != index) {
                    index.preFX.addBlur(2)
                }
            })
        })
        button.on("pointerout", ()=>{
            button.clearTint()
            button.preFX.clear()
            
            buttons.forEach((index)=>{
                if(button != index) {
                    index.clearFX()
                }
            })
        })
        button.on("pointerdown", ()=>{
            this.sound.play('btnSFX', {volume: .8})
            config.text
        })
        button.on("pointerup", ()=>{
            button.anims.play('button_KeyAnim', true)
            if(config.text == 'restart') {
                this.time.delayedCall(200, () => {
                    this.scene.start("GameSceneLevel1")
                })
            }if(config.text == 'mainMenu') {
                this.time.delayedCall(200, () => {
                    this.scene.start("MainMenuScene")
                })
            }
        })
    }
    tweenAnim_Handler(target, x, y, duration, ease='Linear') {
        this.tweens.add({ 
            targets: target,
            x: x,
            y: y,
            duration: duration,
            ease: ease,
        })
    }
}