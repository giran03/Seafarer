export default class GameSceneLevel2 extends Phaser.Scene
{
    constructor() 
    { 
        super('GameSceneLevel2')

        // MAPS, TILESET, LAYER
        this.tileMap
        this.tileSet
        this.terrainTiles
        this.breakableTiles
        this.interactableTiles
        this.invisibleTiles
            //background
        this.backgroundTop
        this.backgroundMid
        this.backgroundBot

        // PLAYER
        this.player
        this.playerAttackGroup
        // player attributes
        this.attackRange = 25   //default: 25

        // CONTROLS
        this.controls
        this.keyW
        this.keyA
        this.keyD
        this.keyE
        this.keyQ

        // MISC
        this.screenCenterX
        this.screenCenterY
        this.portal

        // POWER UPS
        

    }

    create() {
        console.log('⚠️ GAME SCENE LEVEL 2 START ⚠️')

        // get the center of the screen
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        // 🗺️ TILE MAPS, SETS, LAYERS 🗺️
        

        // PORTAL
        this.portal = this.add.image(124*16, 4*16, 'portal')
        this.portalAnim()

        // 🫧 PLAYER 🫧
        this.player = this.physics.add.sprite(33, 100, 'guraNormalIdle')
        .play('guraNormalIdleAnim', true).setScale(.2)
        this.player.preFX.addGlow(0x8af1ff, 2)
        this.playerAttackGroup = this.physics.add.staticGroup()

        // POWER-UPS

        // 📦 COLLISIONS 📦
            // ADD TILE MAP COLLISIONS HERE


        
        // TEXT


        // 📸 CAMERA 📸
            // Set camera bounds            ⚠️⚠️⚠️⚠️ CREATEA A TILE MAP FIRST THEN UNCOMMENT THIS LINE ⚠️⚠️⚠️⚠️
        // this.cameras.main.setBounds(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);

        // ⌨️ CONTROL BINDING ⌨️
        this.controls = this.input.keyboard.createCursorKeys()
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

        // USE TO QUICKLY GET COORDINATES IN GAME
        this.input.on('pointerdown', ()=> {
            console.log('Player X: ' + Math.floor(this.player.x) + 
                    '\t\tPlayer Y: ' + Math.floor(this.player.y))
        })
    }

    update() {
        this.cameras.main.startFollow(this.player, true)
        this.playerControls()
        this.playerBounds()
    }

    // ========================================================= 🌀 FUNCTIONS 🌀 =========================================================
    playerControls() {
        // ⌨️ PLAYER CONTROLS ⌨️
        if (this.controls.right.isUp && this.controls.left.isUp && this.keyA.isUp && this.keyD.isUp ) {
            this.player.setVelocityX(0).anims.play('guraNormalIdleAnim', true)
        } 
        if (this.controls.left.isDown || this.keyA.isDown) {
            this.player.setVelocityX(-300).setFlipX(true).anims.play('guraNormalRunAnim', true)
        }
        else if (this.controls.right.isDown || this.keyD.isDown) {
            this.player.setVelocityX(300).setFlipX(false).anims.play('guraNormalRunAnim', true)
        }
        if (this.controls.up.isDown && this.player.body.blocked.down || this.keyW.isDown && this.player.body.blocked.down) { 
            this.player.setVelocityY(-580)
        }
        if (Phaser.Input.Keyboard.JustDown(this.controls.space)) {
            console.log('SPACE BAR PRESSED')
            this.playerAttack()
        }
    }
    playerAttack() {
        let playerAttack
        let attackAnimation_to_play = 'playerAttackAnim'
        if(this.attackUprade) {
            attackAnimation_to_play = 'playerAttackAnim_upgrade'
        }

        if(this.player.flipX) { // this condition is to check whether the player is flipped
            playerAttack = this.playerAttackGroup.create(this.player.x - this.attackRange, this.player.y, 'playerAttack')
            .refreshBody().anims.play(attackAnimation_to_play, true).setFlipX(true)
        } else {
            playerAttack = this.playerAttackGroup.create(this.player.x + this.attackRange, this.player.y, 'playerAttack')
            .refreshBody().anims.play(attackAnimation_to_play, true)
        }
        playerAttack.flipY = Math.random() >= 0.5   // random flip for attack animation 
        setTimeout(()=>{
            playerAttack.destroy()
        }, 300);
    }
    playerBounds() {
        if (this.player.y >= 900) {
            this.player.enableBody(true, 33, 100, true, true)
        }
    }

    // use this to remove child from group
    removeGroupChild(group, child) {
        group.remove(child, true, true)
        child.destroy()
    }
    // use this to quickly animate object / enemies
    tweenAnim_Handler(target, x, y, duration) {
        this.tweens.add({ 
            targets: target,
            x: x,
            y: y,
            duration: duration,
            ease: 'linear',
            repeat: -1,
            yoyo: true
        })
    }
    
    // portal animation
    portalAnim() {
        this.portalAnimCreator(1000, 5)
        this.portalAnimCreator(1500, 3)
        this.portalAnimCreator(2500, 7)
    }
    portalAnimCreator(delay, barrelVal) {
        this.time.addEvent({
            delay: delay,
            loop: true,
            callback: ()=>{
                this.portal.preFX.clear()
                this.portal.preFX.addGlow(0xff0000, 1)
                this.portal.preFX.addBarrel(barrelVal)
            }
        })
    }
    
}