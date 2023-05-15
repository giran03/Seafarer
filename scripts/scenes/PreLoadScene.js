export default class PreLoadScene extends Phaser.Scene
{
    constructor() { 
        super('PreLoadScene')
        this.sceneStart = 'MainMenuScene' // ⚠️⚠️⚠️⚠️ change this to skip to your assigned game level ⚠️⚠️⚠️⚠️ 

        // MISC
        this.screenCenterX
        this.screenCenterY
    }
    preload() {
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2
        
        // T I L E  M A P S
            // atlas
        this.load.image('atlas', './assets/maps/atlas/atlas.png')
            // level 1
        this.load.tilemapTiledJSON('level_1_Tilemap', './assets/maps/level_1/level_1.json')

        // S P R I T E  S H E E T S
            // player
        this.load.spritesheet('guraNormalIdle', './assets/player/Gura_Normal_IdleAnim.png', {frameWidth: 144, frameHeight: 168})
        this.load.spritesheet('guraNormalRun', './assets/player/Gura_Normal_RunAnim.png', {frameWidth: 155, frameHeight: 180})
            // attack anim
        this.load.spritesheet('playerAttack', './assets/misc/attackAnim.png', {frameWidth: 32 , frameHeight: 84})
        this.load.spritesheet('playerAttack_upgrade', './assets/misc/attackAnim_upgrade.png', {frameWidth: 32 , frameHeight: 84})
            // enemies
        this.load.spritesheet('shrimp', './assets/enemies/shrimp.png', {frameWidth: 33, frameHeight: 28})
        this.load.spritesheet('comet', './assets/enemies/comet.png', {frameWidth: 28, frameHeight: 24})
        this.load.spritesheet('chicken', './assets/enemies/chicken.png', {frameWidth: 25, frameHeight: 25})
        this.load.spritesheet('ghost', './assets/enemies/ghost.png', {frameWidth: 30, frameHeight: 30})
        this.load.spritesheet('gigaDuck', './assets/enemies/gigaDuck.png', {frameWidth: 136, frameHeight: 208})

        // FONTS
        this.loadFont("stackedPixel", "./assets/fonts/stackedPixel.ttf")
        
        // GUI
        this.load.spritesheet('spaceKey', './assets/gui/space.png', { frameWidth: 67, frameHeight: 16 })
        this.load.spritesheet('letterKeys', './assets/gui/letter_keys.png', { frameWidth: 17, frameHeight: 16 })
        this.load.spritesheet('button', './assets/gui/button.png', { frameWidth: 48, frameHeight: 16 })
        
        // M I S C
        this.load.spritesheet('guraDance', './assets/misc/gura_aqua.png', {frameWidth: 120, frameHeight: 148})
        this.load.image('textLogo', './assets/misc/seafarer_textLogo.png')
        this.load.image('portal', './assets/misc/portal.png')
        this.load.image('movingPlatform', './assets/misc/movingPlatform.png')
        this.load.image('barrel', './assets/misc/barrel.png')
        this.load.image('trident', './assets/misc/trident.png')

        // BACKGROUND
        this.load.video('loadingVid', './assets/backgrounds/guraLoad.mp4')
        this.load.video('backgroundDefault', './assets/backgrounds/mainMenu.mp4')
        this.load.video('gameOverBG', './assets/backgrounds/gameOver_bg.mp4')

        // LOADING PROGRESS
        this.load.on("progress", (percent)=> { console.log("loading: "+ percent) })
    }

    create() {
        // 🎥 LOADING VIDEO 🎶
        this.add.video(this.screenCenterX, this.screenCenterY, 'loadingVid').play(true).setScale(.55, .55).setPlaybackRate(3)

        // 🦈 PLAYER ANIMATION 🦈
        this.createAnim('guraNormalIdle', 'guraNormalIdleAnim', 0, 2, 6)
        this.createAnim('guraNormalRun', 'guraNormalRunAnim', 0, 5, 8)
            // 🔱 Attack Animation
        this.createAnim('playerAttack', 'playerAttackAnim', 0, 8, 24)
        this.createAnim('playerAttack_upgrade', 'playerAttackAnim_upgrade', 0, 8, 24)
        // 👻 ENEMY ANIMATION 👻
        this.createAnim('shrimp', 'shrimpAnim', 0, 2, 6)
        this.createAnim('comet', 'cometAnim', 0, 2, 6)
        this.createAnim('chicken', 'chickenAnim', 0, 2, 6)
        this.createAnim('ghost', 'ghostAnim', 0, 3, 6)
        this.createAnim('gigaDuck', 'gigaDuckAnim', 0, 7, 12)
        // KEYBOARD KEYS ANIMATION
        this.createAnim('letterKeys', 'W_KeyAnim', 0, 1, 5)
        this.createAnim('letterKeys', 'A_KeyAnim', 2, 3, 5)
        this.createAnim('letterKeys', 'D_KeyAnim', 6, 7, 5)
        this.createAnim('letterKeys', 'E_KeyAnim', 8, 9, 5)
        this.createAnim('letterKeys', 'O_KeyAnim', 10, 11, 5)
        this.createAnim('letterKeys', 'P_KeyAnim', 12, 13, 5)
        this.createAnim('spaceKey', 'space_KeyAnim', 0, 1, 5)
        this.createAnim('button', 'button_KeyAnim', 0, 1, 16, 0)
        // MISC
        this.createAnim('guraDance', 'guraDanceAnim', 0, 54, 24)

        this.time.delayedCall(1000,()=>{
            this.scene.start(this.sceneStart)
        })
    }

    // Create animation
    createAnim(key, animKey, start, end, frameRate, repeat = -1) {
        this.anims.create({
            key: animKey,
            frames: this.anims.generateFrameNumbers(key, { start: start, end: end }),
            frameRate: frameRate,
            repeat: repeat
        })
    }
    
    // Font loader
    loadFont(name, url) {
        var newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
    }
}