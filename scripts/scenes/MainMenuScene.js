export default class MainMenuScene extends Phaser.Scene
{
    constructor() 
    { 
        super('MainMenuScene')
    }

    create() {
        console.log('⚠️ MAIN MENU SCENE START! ⚠️')

        // MISC
        this.screenCenterX
        this.screenCenterY
    }

    create() {
        this.stopScenes()
        this.sound.stopAll()
        // INIT
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        // AUDIO
        this.sound.play( 'bgm', {
            loop: true,
            volume: .3
        })

        // 🎥 BACKGROUND VIDEO AND LOGO 🎶
        let backgroundVideo = this.add.video(this.screenCenterX, this.screenCenterY, 'backgroundDefault').play(true)
        backgroundVideo.preFX.addBokeh(3)
        
        let textLogo = this.add.image(this.screenCenterX*3, this.screenCenterY*.7, 'textLogo').setScale(.15)
        this.tweenAnim_Handler(textLogo, this.screenCenterX, this.screenCenterY*.7, 2000, 'Expo.easeInOut')

        const revealButton = this.add.sprite(this.screenCenterX*1.95, this.screenCenterY*.1, 'button').setOrigin(.5).setInteractive().setScale(1,2)
        let revealText = this.textCreate(this.screenCenterX*1.95, this.screenCenterY*.105, "👀 \n", true, true, 17)
        let clickCount = 0
        revealButton.on("pointerdown", ()=>{
            this.sound.play('btnSFX', {volume: .8})
            clickCount++
            if(clickCount == 1) {backgroundVideo.clearFX()}
            if(clickCount == 2) {backgroundVideo.preFX.addBokeh(3); clickCount = 0}
        })

        // AUDIO
        

        // ⌨️ CONTROLS INFO ⌨️
        let controlsText = this.textCreate(this.screenCenterX*.17, this.screenCenterY*.07, "C O N T R O L S  ", true, true)
        let controlsText2 = this.textCreate(this.screenCenterX*.155, this.screenCenterY*.14, "Hover me ", true, true, '12px')

        let letterW = this.add.sprite(this.screenCenterX*.1, this.screenCenterY*.25, 'letterKeys')
        .setScale(2).setOrigin(.5).setVisible(true).setInteractive().anims.play('W_KeyAnim', true)

        let letterA = this.add.sprite(this.screenCenterX*.1, this.screenCenterY*.4, 'letterKeys')
        .setScale(2).setOrigin(.5).setVisible(true).setInteractive().anims.play('A_KeyAnim', true)

        let letterD = this.add.sprite(this.screenCenterX*.2, this.screenCenterY*.4, 'letterKeys')
        .setScale(2).setOrigin(.5).setVisible(true).setInteractive().anims.play('D_KeyAnim', true)

        let letterE = this.add.sprite(this.screenCenterX*.2, this.screenCenterY*.25, 'letterKeys')
        .setScale(2).setOrigin(.5).setVisible(true).setInteractive().anims.play('E_KeyAnim', true)

        let spaceBar = this.add.sprite(this.screenCenterX*.15, this.screenCenterY*.55, 'spaceKey')
        .setScale(1.8).setOrigin(.5).setVisible(true).setInteractive().anims.play('space_KeyAnim', true)
        
        this.spacebarText = this.textCreate(this.screenCenterX*.38, this.screenCenterY*.55, "A T T A C K  ", false, true)
        this.W_text = this.textCreate(this.screenCenterX*.35, this.screenCenterY*.25, "J U M P ", false, true)
        this.E_text = this.textCreate(this.screenCenterX*.41, this.screenCenterY*.25, "I N T E R A C T ", false, true)
        this.A_text = this.textCreate(this.screenCenterX*.35, this.screenCenterY*.4, "L E F T  ", false, true)
        this.D_text = this.textCreate(this.screenCenterX*.36, this.screenCenterY*.4, "R I G H T  ", false, true)

        this.buttonHoverControls(spaceBar,{
            text: 'Space',
        })
        this.buttonHoverControls(letterW,{
            text: 'W',
        })
        this.buttonHoverControls(letterE,{
            text: 'E',
        })
        this.buttonHoverControls(letterA,{
            text: 'A',
        })
        this.buttonHoverControls(letterD,{
            text: 'D',
        })

        // 🌀 BUTTONS 🌀
        this.playBtn = this.add.sprite(this.screenCenterX, this.screenCenterY - 1000, 'button').setOrigin(.5).setInteractive().setScale(3)
        this.playText = this.textCreate(this.screenCenterX, this.screenCenterY*1.17, 'P L A Y ', true).setVisible(false)
        this.tweenAnim_Handler(this.playBtn, this.screenCenterX, this.screenCenterY*1.19, 1000, 'Bounce')

        this.creditsBtn = this.add.sprite(this.screenCenterX - 1000, this.screenCenterY*1.41, 'button').setOrigin(.5).setInteractive().setScale(3)
        this.creditsText = this.textCreate(this.screenCenterX, this.screenCenterY*1.39, 'C R E D I T S ', true).setVisible(false)
        this.tweenAnim_Handler(this.creditsBtn, this.screenCenterX, this.screenCenterY*1.41, 1000, 'Expo.easeInOut')
        
        this.quitBtn = this.add.sprite(this.screenCenterX, this.screenCenterY + 1000, 'button').setOrigin(.5).setInteractive().setScale(3)
        this.quitText = this.textCreate(this.screenCenterX, this.screenCenterY*1.6, 'Q U I T ', true).setVisible(false)
        this.tweenAnim_Handler(this.quitBtn, this.screenCenterX, this.screenCenterY*1.62, 1000, 'Circ.easeInOut')

        this.buttonInteract(this.playBtn,{
            text: 'play',
        })
        this.buttonInteract(this.creditsBtn,{
            text: 'credits'
        })
        this.buttonInteract(this.quitBtn,{
            text: 'quit'
        })

        this.time.delayedCall(1500,()=>{
            this.playText.setVisible(true)
            this.creditsText.setVisible(true)
            this.quitText.setVisible(true)
        })
    }

    // ========================================================= 🌀 FUNCTIONS 🌀 =========================================================
    stopScenes() {
        this.scene.stop('OverlaySceneLevel1')
        this.scene.stop('OverlaySceneLevel2')
        this.scene.stop('OverlaySceneLevel3')

        this.scene.stop('GameSceneLevel1')
        this.scene.stop('GameSceneLevel2')
        this.scene.stop('GameSceneLevel3')

        this.scene.stop('GameVictoryScene')
        this.scene.stop('GameOverScene')
    }
    textCreate(x, y, textDisplay, visible='false', controls='false', fontSize='20px') {
        if(controls) {
            return this.add.text(x, y, textDisplay,
            { fill: '#ffe863' , fontSize: fontSize, fontStyle: 'italic' , fontFamily: 'stackedPixel'})
            .setShadow(2, 2, '#000', 5, true, true).setOrigin(.5).setVisible(visible)
        }
        return this.add.text(x, y, textDisplay ,{ 
            fill: '#000' , fontSize: fontSize, fontStyle: 'italic' , fontFamily: 'impact'
        }).setOrigin(.5).setVisible(visible)
    }
    buttonHoverControls(button, config) {
        button.on("pointerover", ()=>{
            if(config.text == 'Space') {
                this.spacebarText.setVisible(true)
            }if(config.text == 'W') {
                this.W_text.setVisible(true)
            }if(config.text == 'E') {
                this.E_text.setVisible(true)
            }if(config.text == 'A') {
                this.A_text.setVisible(true)
            }if(config.text == 'D') {
                this.D_text.setVisible(true)
            }
        })
        button.on("pointerout", ()=>{
            if(config.text == 'Space') {
                this.spacebarText.setVisible(false)
            }if(config.text == 'W') {
                this.W_text.setVisible(false)
            }if(config.text == 'E') {
                this.E_text.setVisible(false)
            }if(config.text == 'A') {
                this.A_text.setVisible(false)
            }if(config.text == 'D') {
                this.D_text.setVisible(false)
            }
        })
    }
    buttonInteract(button, config) {
        const buttons = [this.playBtn, this.quitBtn, this.creditsBtn]
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
            if(config.text == 'play') {
                this.time.delayedCall(200, () => {
                    this.scene.start("GameSceneLevel1")
                })
            }if(config.text == 'credits') {
                this.time.delayedCall(200, () => {
                    this.scene.start("CreditScene")
                })
            }if(config.text == 'quit') {
                this.time.delayedCall(200, () => {
                    alert('Thank you for playing!!! Gawrrr')
                    window.location.href = '../../index.html'
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