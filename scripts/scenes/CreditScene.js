export default class CreditScene extends Phaser.Scene
{
    constructor() 
    { 
        super("CreditScene")
        // MISC
        this.screenCenterX
        this.screenCenterY
    }

    create() {
        // INIT
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        // 🎥 BACKGROUND VIDEO AND LOGO 🎶
        let backgroundVideo = this.add.video(this.screenCenterX, this.screenCenterY, 'gameOverBG').play(true).setScale(2,2.5)
        backgroundVideo.preFX.addBokeh(3)
        let textLogo = this.add.image(this.screenCenterX*1.85, this.screenCenterY*1.9, 'textLogo').setScale(.05)

        const revealButton = this.add.sprite(this.screenCenterX*1.95, this.screenCenterY*.1, 'button').setOrigin(.5).setInteractive().setScale(1,2)
        let revealText = this.textCreate(this.screenCenterX*1.95, this.screenCenterY*.105, "👀 \n", true, true, 17)
        let clickCount = 0
        revealButton.on("pointerdown", ()=>{
            clickCount++
            if(clickCount == 1) {backgroundVideo.clearFX()}
            if(clickCount == 2) {backgroundVideo.preFX.addBokeh(3); clickCount = 0}
        })

        const player = this.add.sprite(this.screenCenterX*1.85, this.screenCenterY*1.5, "guraDance").play('guraDanceAnim', true)

        // BACK BUTTON
        const backBtn = this.add.sprite(this.screenCenterX*.15, this.screenCenterY*.12, 'button').setOrigin(.5).setInteractive().setScale(3)
        let backBtnText = this.textCreate(this.screenCenterX*.15, this.screenCenterY*.1, 'B A C K ')
        this.buttonInteract(backBtn)

        // DEVELOPER INFORMATION
        const devTeamText = "Developer Team: \n\n\n"+
        "Joshua Emmanuel Cifra \n\n"+
        "Janmark Laurence Perucho \n\n"+
        "Guillan Fredd T. Parreno \n\n"+
        "Alejandro Garcia \n"

        let devInfo = this.textCreate(1500, this.screenCenterY, devTeamText, true, '25px')
        this.tweenAnim_Handler(devInfo, this.screenCenterX, this.screenCenterY, 1000, 'Bounce')
        
    }

    textCreate(x, y, textDisplay, visible='false', fontSize='20px') {
        return this.add.text(x, y, textDisplay ,{ 
            fill: '#ffeb69' , fontSize: fontSize, fontStyle: 'italic' , fontFamily: 'stackedPixel', align: 'center'
        }).setShadow(2, 2, '#000', 5, true, true).setOrigin(.5).setVisible(visible)
    }
    buttonInteract(button) {
        button.on("pointerover", ()=>{
            button.setTint(0xffb0ab)
            button.preFX.addShine(1.5)
        })
        button.on("pointerout", ()=>{
            button.clearTint()
            button.preFX.clear()
        })
        button.on("pointerup", ()=>{
            button.anims.play('button_KeyAnim', true)
            this.time.delayedCall(200, () => {
                this.scene.start("MainMenuScene")
            })
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