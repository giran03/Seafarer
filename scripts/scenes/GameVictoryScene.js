export default class GameVictoryScene extends Phaser.Scene
{
    constructor() 
    { 
        super('GameVictoryScene')
    }

    create() {
        console.log('⚠️ GAME VICTORY SCENE!!!')
        this.scene.stop('OverlaySceneLevel3')
        this.sound.pauseAll()
        const win_dialogues = ['win_1', 'win_2']
        // INIT
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        // AUDIO
        this.sound.play('victorySFX', {volume: 1})
        this.sound.play(win_dialogues[Phaser.Math.Between(0,1)], {volume: 1})

        // 🎥 BACKGROUND VIDEO AND LOGO 🎶
        let backgroundVideo = this.add.video(this.screenCenterX, this.screenCenterY, 'gameOverBG').play(true).setScale(2,2.5)
        backgroundVideo.preFX.addBokeh(3)

        const player = this.add.sprite(this.screenCenterX*1.85, this.screenCenterY*1.5, "guraDance").play('guraDanceAnim', true)
        let textLogo = this.add.image(this.screenCenterX*1.85, this.screenCenterY*1.9, 'textLogo').setScale(.05)

        const randText = ['C O N G R A T S ! 🦈\n', 'Y O U  W O N ! 👾\n', 'W H A T  A  L E G E N D ! 🗿\n', 'E Z P Z ! 🔱\n', 'U  D R O P P E D  T H I S 👑\n']
        this.textCreate(this.screenCenterX, this.screenCenterY*.5, randText[Phaser.Math.Between(0,4)], true, 60)
        const scoreText = this.textCreate(this.screenCenterX*.62, this.screenCenterY*.8, `Score: ${this.scene.get('GameSceneLevel3').data.get('playerScore')} `, true, 25)
        const timeText = this.textCreate(this.screenCenterX*.7, this.screenCenterY, `Time Survived: ${this.scene.get('OverlaySceneLevel3').data.get('playerTime')} `, true, 25)

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