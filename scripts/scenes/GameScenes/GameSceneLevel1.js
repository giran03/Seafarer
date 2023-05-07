export default class GameSceneLevel1 extends Phaser.Scene
{
    //******************************************//
    //              LEVEL 1 MAP                 //
    //           Created by @Giran03            //
    //******************************************//

    constructor() 
    { 
        super('GameSceneLevel1')

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
        this.trident
        this.attackUprade = false

        // BARREL
        this.barrelGroup
        this.barrelCollected = 0

        // TEXT
        this.breakInfo
        this.barrelInfo
        this.platformInfo
        this.sandstoneInfo

        // MOVING PLATFORMS
        this.movingPlatformGroup
        this.movingPlatform_1
        this.movingPlatform_2
        this.movingPlatform_3
        this.movingPlatform_4
        this.enableMovingPlatform_1
    }

    create() {
        console.log('⚠️ GAME SCENE LEVEL 1 START ⚠️')

        // get the center of the screen
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        // 🗺️ TILE MAPS, SETS, LAYERS 🗺️
        this.tileMap = this.make.tilemap({ key: 'level_1_Tilemap', tileHeight: 16, tileWidth: 16})
        this.tileSet = this.tileMap.addTilesetImage('atlasImage', 'atlas')
            // background
        this.backgroundBot = this.tileMap.createLayer('backgroundBot', this.tileSet).setCollisionByExclusion([-1])            
        this.backgroundMid = this.tileMap.createLayer('backgroundMid', this.tileSet).setCollisionByExclusion([-1])            
        this.backgroundTop = this.tileMap.createLayer('backgroundTop', this.tileSet).setCollisionByExclusion([-1])    
            // other maps
        this.terrainTiles = this.tileMap.createLayer('terrain', this.tileSet).setCollisionByExclusion([-1])
        this.interactableTiles = this.tileMap.createLayer('interactableTiles', this.tileSet).setCollisionByExclusion([-1])
        this.breakableTiles = this.tileMap.createLayer('breakableTiles', this.tileSet).setCollisionByExclusion([-1])
        this.invisibleTiles = this.tileMap.createLayer('invisibleTiles', this.tileSet).setCollisionByExclusion([-1]).setVisible(false)

        // PORTAL
        this.portal = this.add.image(124*16, 4*16, 'portal')
        this.portalAnim()

        // 🫧 PLAYER 🫧
        this.player = this.physics.add.sprite(33, 100, 'guraNormalIdle') // default 33, 100 | beside moving platform: 421, 751 | 1446, 590 | 690, 78
        .play('guraNormalIdleAnim', true).setScale(.2)
        this.player.preFX.addGlow(0x8af1ff, 2)
        this.playerAttackGroup = this.physics.add.staticGroup()

        // BARREL
        this.barrelGroup = this.physics.add.group()
        this.createBarrel(456, 143)
        this.createBarrel(395, 383)
        this.createBarrel(776, 740)

        // POWER-UPS
        this.trident = this.physics.add.sprite(1097, 110, 'trident')


        // MOVING PLATFORM
        this.movingPlatformGroup = this.physics.add.group()
        this.movingPlatform_1 = this.movingPlatformGroup.create(560, 687, 'movingPlatform')
        this.movingPlatform_2 = this.movingPlatformGroup.create(1960, 700, 'movingPlatform')
        this.movingPlatform_3 = this.movingPlatformGroup.create(1690, 500, 'movingPlatform').setScale(.5)
        this.movingPlatform_4 = this.movingPlatformGroup.create(113*16, 14*16, 'movingPlatform')

            // moving platform animation
        this.tweenAnim_Handler(this.movingPlatform_2, 1960, 455, 2500)
        this.tweenAnim_Handler(this.movingPlatform_3, 1690, 340, 1500)
        this.tweenAnim_Handler(this.movingPlatform_4, 113*16, 6.5*16, 1500)

        this.movingPlatformGroup.children.iterate((platform)=>{
            platform.setImmovable(true)
            platform.body.allowGravity = false
        })    

        // 📦 COLLISIONS 📦
        this.physics.add.collider(this.player, this.terrainTiles)
        this.physics.add.collider(this.player, this.breakableTiles)
        this.physics.add.collider(this.player, this.invisibleTiles)
        this.physics.add.collider(this.movingPlatformGroup, this.terrainTiles)
        this.physics.add.collider(this.barrelGroup, this.terrainTiles)
        this.physics.add.collider(this.trident, this.breakableTiles)
        this.physics.add.collider(this.trident, this.terrainTiles)

        this.physics.add.collider(this.player, this.movingPlatformGroup, this.movingPlatformGroup_Handler, null, this)
        this.physics.add.overlap(this.player, this.trident, this.powerUp_Handler, null, this)
        this.physics.add.overlap(this.player, this.barrelGroup, this.barrelCollection_Handler, null, this)
        this.physics.add.overlap(this.playerAttackGroup, this.breakableTiles, this.tilesBreak_Handler, null, this)
        this.physics.add.overlap(this.player, this.interactableTiles, this.interactableTiles_Handler, null, this)

        // TEXT
        this.questionMarkText_Handler()

        // 📸 CAMERA 📸
            // Set camera bounds
        this.cameras.main.setBounds(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);

        // ⌨️ CONTROL BINDING ⌨️
        this.controls = this.input.keyboard.createCursorKeys()
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

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
            this.playerAttack()
        }
    }
    playerAttack() {
        let playerAttack
        let attackAnimation_to_play = 'playerAttackAnim'
        if(this.attackUprade) {
            attackAnimation_to_play = 'playerAttackAnim_upgrade'
        }

        if(this.player.flipX) { // this condition is to check wether the player is flipped
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

    powerUp_Handler(player, powerUp) {
        if(this.keyE.isDown) {
            if(powerUp == this.trident) {
                console.log('TRIDENT COLLECTED')
                this.attackUprade = true
                this.trident.destroy()
            }
        }
    }

    tilesBreak_Handler(player, tile) {
        const sandstoneRocks = [ 1290, 1291, 1292, 1293,
                                1354, 1355, 1356, 1357,
                                1418, 1419, 1420, 1421,
                                1482, 1483, 1484, 1485,
                                1546, 1547, 1548, 1549  ]

        if (tile.index == 584) {
            tile.hitCount = tile.hitCount || 0;
            tile.hitCount++;
                // ~15 per hit; ~30 = 2 hits
            if (tile.hitCount == 15) { tile.tint = 0xb36532 }
            else if (tile.hitCount == 30) {
                this.breakableTiles.removeTileAt(tile.x, tile.y)
            }
        }
        if(sandstoneRocks.includes(tile.index) && this.attackUprade) {
            tile.hitCount = tile.hitCount || 0;
            tile.hitCount++;
            if (tile.hitCount == 30) { tile.tint = 0xe08e53 }
            if (tile.hitCount == 60) { tile.tint = 0xb36532 }
            else if (tile.hitCount == 90) {
                this.breakableTiles.removeTileAt(tile.x, tile.y)
            }
        }
    }
    
    interactableTiles_Handler(player, tile) {
        // question mark
        if (tile.index == 583) {
            if(tile.x == 20 && tile.y == 8) {
                this.breakInfo.setVisible(true)
                this.time.delayedCall(2000, ()=>{ this.breakInfo.setVisible(false) })
                this.time.delayedCall(10000, ()=>{ this.interactableTiles.removeTileAt(tile.x, tile.y) })
            }
            if(tile.x == 7 && tile.y == 46) {
                this.barrelInfo.setVisible(true)
                this.time.delayedCall(2000, ()=>{ this.barrelInfo.setVisible(false) })
                this.time.delayedCall(10000, ()=>{ this.interactableTiles.removeTileAt(tile.x, tile.y) })
            }
            if(tile.x == 27 && tile.y == 46) {
                this.platformInfo.setVisible(true)
                this.time.delayedCall(2000, ()=>{ this.platformInfo.setVisible(false) })
                this.time.delayedCall(15000, ()=>{ this.interactableTiles.removeTileAt(tile.x, tile.y) })
            }
            if(tile.x == 43 && tile.y == 8) {
                this.sandstoneInfo.setVisible(true)
                this.time.delayedCall(2000, ()=>{ this.sandstoneInfo.setVisible(false) })
                this.time.delayedCall(15000, ()=>{ this.interactableTiles.removeTileAt(tile.x, tile.y) })
            }
        }
        // platform control panel
        if(tile.index == 1411 || tile.index == 1475) {
            this.movingPlatformGroup.children.iterate((platform)=>{
                if(this.keyE.isDown && this.enableMovingPlatform_1) {
                    if (platform.y <= 687) {
                        if(platform.y >= 687) {
                            platform.body.y -= 0
                        } else {
                            platform.body.y -= 1.5
                        }
                    }
                } else if (this.keyQ.isDown) {
                    if(platform.y >= 687) {
                        platform.body.y -= 0
                    } else {
                        platform.body.y += 1.5
                    }
                }
            })
        }
        // barrel platform
        if(tile.index == 1478) {
            if(Phaser.Input.Keyboard.JustDown(this.keyE)) {
                if(this.barrelCollected >= 1) {
                    this.createBarrel(56, 751)
                    if(this.barrelCollected >= 2) {
                        this.createBarrel(122, 751)
                        if(this.barrelCollected == 3) {
                            this.createBarrel(187, 751)
                            this.enableMovingPlatform_1 = true
                        }
                    }
                }
            }
        }
    }

    questionMarkText_Handler() {
        this.breakInfo = this.add.text(20*16, 70, `BREAK THE TILES!\nPress 'Spacebar' to attack\nPress 'E' to collect barrels`, {
            fontSize: '20px', 
            fill: '#ffe863' , 
            fontFamily: 'stackedPixel',
            align: 'center'
        }).setShadow(2, 2, '#000', 5, true, true).setOrigin(.5).setVisible(false)
        this.barrelInfo = this.add.text(11*16, 680, `Collect all barrels!\nPress 'E' to place barrel\nto unlock the platform`, {
            fontSize: '20px', 
            fill: '#ffe863' , 
            fontFamily: 'stackedPixel',
            align: 'center'
        }).setShadow(2, 2, '#000', 5, true, true).setOrigin(.5).setVisible(false)
        this.platformInfo = this.add.text(27*16, 630, `Collect all barrels to unlock!\nUse this control panel or\nstand on the platform\n'Q' to go DOWN, 'E' to go UP`, {
            fontSize: '20px', 
            fill: '#ffe863' , 
            fontFamily: 'stackedPixel',
            align: 'center'
        }).setShadow(2, 2, '#000', 5, true, true).setOrigin(.5).setVisible(false)
        this.sandstoneInfo = this.add.text(37*16, 70, `Collect the trident to destroy\nsandstone rocks`, {
            fontSize: '20px', 
            fill: '#ffe863' , 
            fontFamily: 'stackedPixel',
            align: 'center'
        }).setShadow(2, 2, '#000', 5, true, true).setOrigin(.5).setVisible(false)
    }
    
    movingPlatformGroup_Handler(player, platform) {
        // platform.setVelocityX(0)
        if(this.keyE.isDown && this.enableMovingPlatform_1) {
            // this.physics.moveToObject(platform, player, 100)
            if(platform.y <= 170) {
                platform.body.y += 0
            } else {
                platform.body.y -= 2
            }
        } else if (this.keyQ.isDown) {
            if(platform.y >= 687) {
                platform.body.y -= 0
            } else {
                this.player.y += 2
                platform.body.y += 2
            }
        }
    }

    // barrel
    createBarrel(x, y) {
        this.barrelGroup.create(x, y, 'barrel')
        this.barrelGroup.children.iterate((barrel)=>{
            barrel.setImmovable(true)
        })
    }
    barrelCollection_Handler(player, barrel) {
        const spawnBarrelCords = [456,395,776]
        
        if(Phaser.Input.Keyboard.JustDown(this.keyE) && spawnBarrelCords.includes(barrel.x)) {
            this.barrelCollected += 1
            console.log(`BARREL COUNT: ${this.barrelCollected}`)
            this.barrelGroup.remove(barrel, true, true)
            barrel.destroy()
        }
    }

    removeGroupChild(group, child) {
        console.log("barrelRemove")
        group.remove(child, true, true)
        child.destroy()
    }
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