export default class PreLoadScene extends Phaser.Scene
{
    constructor() { 
        super('PreLoadScene')
        this.sceneStart = 'GameSceneLevel1' // ⚠️⚠️⚠️⚠️ change this to skip to your assigned game level ⚠️⚠️⚠️⚠️ 
    }
    preload() {
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

        // M I S C
        this.load.image('portal', './assets/misc/portal.png')
        this.load.image('movingPlatform', './assets/misc/movingPlatform.png')
        this.load.image('barrel', './assets/misc/barrel.png')
        this.load.image('trident', './assets/misc/trident.png')
    }

    create() {
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

        this.scene.start(this.sceneStart)
    }

    // Create animation
    createAnim(key, animKey, start, end, frameRate) {
        this.anims.create({
            key: animKey,
            frames: this.anims.generateFrameNumbers(key, { start: start, end: end }),
            frameRate: frameRate,
            repeat: -1
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