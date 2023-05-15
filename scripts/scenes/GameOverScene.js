export default class GameOverScene extends Phaser.Scene
{
    constructor() 
    { 
        super('GameOverScene')
    }

    create() {
        console.log('⚠️ GAME OVER SCENE!!!')
        // INIT
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        // 🎥 BACKGROUND VIDEO AND LOGO 🎶
        let backgroundVideo = this.add.video(this.screenCenterX, this.screenCenterY, 'gameOverBG').play(true).setScale(2,2.5)
        backgroundVideo.preFX.addBokeh(3)
        let textLogo = this.add.image(this.screenCenterX*1.85, this.screenCenterY*1.9, 'textLogo').setScale(.05)

        const randText = ['A G A I N ! 🦈\n', 'G A M E  O V E R ! 👾\n', 'Y O U  L O O S E ! 🗿\n', 'T R Y  A G A I N ! 🔱\n', 'O N E  M O R E ! 👑\n']
        this.textCreate(this.screenCenterX, this.screenCenterY*.5, randText[Phaser.Math.Between(0,4)], true, 60)
        const scoreText = this.textCreate(this.screenCenterX*.62, this.screenCenterY*.8, 'Score: ', true, 25)
        const timeText = this.textCreate(this.screenCenterX*.7, this.screenCenterY, 'Time Survived: ', true, 25)

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