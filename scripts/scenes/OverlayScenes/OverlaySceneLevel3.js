export default class OverlaySceneLevel3 extends Phaser.Scene
{
    constructor() { 
        super('OverlaySceneLevel3')

        this.GameScene = 'GameSceneLevel3'
        
        // UI
        this.scoreText
        this.playerHPText

        // AUDIO

        // MISC
        this.screenCenterX
        this.screenCenterY
        this.fps
        
        // options
        this.fps_Enabled = true // default:false | change to see fps, used to check and for game optimization if game achieves 60+ fps
    }
    create() {
        // INIT
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2
        this.timeCounter = this.scene.get('OverlaySceneLevel2').data.get('playerTime')

        //UI
        this.playerHPText = this.add.text(this.screenCenterX*.17, this.screenCenterY*.05, 'Player HP: 100', {
            fontSize: '20px', 
            fill: '#ffe863' , 
            fontFamily: 'stackedPixel'
        }).setShadow(2, 2, '#000', 5, true, true).setOrigin(.5)

        this.scoreText = this.add.text(this.screenCenterX*.4, this.screenCenterY*.05, 'Score: 0 ', {
            fontSize: '20px', 
            fill: '#ffe863' , 
            fontFamily: 'stackedPixel'
        }).setShadow(2, 2, '#000', 5, true, true).setOrigin(.5)

        const levelText = this.add.text(this.screenCenterX*.6, this.screenCenterY*.05, 'Level: 3 ', {
            fontSize: '20px', 
            fill: '#ffe863' , 
            fontFamily: 'stackedPixel'
        }).setShadow(2, 2, '#000', 5, true, true).setOrigin(.5)

        const timeText = this.add.text(this.screenCenterX*.18, this.screenCenterY*.15, `Time Survived: ${this.scene.get('OverlaySceneLevel2').data.get('playerTime')}`, {
            fontSize: '20px', 
            fill: '#ffe863' , 
            fontFamily: 'stackedPixel'
        }).setShadow(2, 2, '#000', 5, true, true).setOrigin(.5)
        
        // TIME SURVIVE CLOCK
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.timeCounter++
                // const currentTimeInSeconds = Math.floor(this.time.now / 1000);
                timeText.setText(`Time survived: ${this.timeCounter} `)
                this.data.set('playerTime', this.timeCounter)
            }
        })

        if(this.fps_Enabled) {
            this.fps = this.add.text(this.screenCenterX*2 - 30, 50, 'FPS: 0 ', {
                fontSize: '15px', 
                fill: '#ffe863' , 
                fontFamily: 'stackedPixel'
            }).setShadow(2, 2, '#000', 5, true, true).setOrigin(.5)
        }

        this.restartBtn = this.add.sprite(this.screenCenterX*1.7, this.screenCenterY*.1, 'button').setOrigin(.5).setInteractive().setScale(2)
        this.mainMenuBtn = this.add.sprite(this.screenCenterX*1.9, this.screenCenterY*.1, 'button').setOrigin(.5).setInteractive().setScale(2)
        
        const restartText = this.textCreate(this.screenCenterX*1.7, this.screenCenterY*.08, 'RESTART ', true, 16)
        const mainMenuText = this.textCreate(this.screenCenterX*1.9, this.screenCenterY*.08, 'MAIN MENU ', true, 16)

        this.buttonInteract(this.restartBtn,{
            text: 'restart',
        })
        this.buttonInteract(this.mainMenuBtn,{
            text: 'mainMenu'
        })
    }

    update() {
        this.updateOverlay(this.GameScene)
    }

    updateOverlay(scene) {
        let playerHp = this.scene.get(scene).data.get('playerHP')
        
        if(playerHp <= 100 && playerHp > 80) {
            this.playerHPText.setColor('#ffe863')
        }if(playerHp <= 80 && playerHp > 60) {
            this.playerHPText.setColor('#f2c230')
        }if(playerHp <= 60 && playerHp > 30) {
            this.playerHPText.setColor('#f76b20')
        }if(playerHp <= 30 && playerHp > 0) {
            this.playerHPText.setColor('#ff3e17')
        }if(playerHp <= 0) {
            playerHp = 0
            this.playerHPText.setColor('#ff0000')
        }
        
        this.playerHPText.setText(`Player HP: ${playerHp} `)
        this.scoreText.setText(`Score: ${this.scene.get(scene).data.get('playerScore')} `)
        if(this.fps_Enabled) { this.fps.setText(`FPS: ${Math.floor(this.game.loop.actualFps)} `) }
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
            button.preFX.addShine(1.5)
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
                    this.scene.start('GameSceneLevel1')
                    this.scene.stop(this.GameScene)
                })
            }if(config.text == 'mainMenu') {
                this.time.delayedCall(200, () => {
                    this.scene.start("MainMenuScene")
                })
            }
        })
    }
}