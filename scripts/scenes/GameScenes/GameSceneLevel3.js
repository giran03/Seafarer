export default class GameSceneLevel1 extends Phaser.Scene
{
    //******************************************//
    //              LEVEL 3 MAP                 //
    //           Created by @Ancient256         //
    //******************************************//

    constructor() 
    { 
        super('GameSceneLevel3')

        // MAPS, TILESET, LAYER
        this.tileMap
        this.tileSet
        this.terrainTiles
        this.coinTiles
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
        this.attackRange
        this.playerHP
        this.playerScore

        // ENEMIES
        this.Shrimp_Group
        this.Comet_Group
        this.Chicken_Group
        this.Ghost_Group
        this.GigaDuck_Group

        // CONTROLS
        this.controls
        this.keyW
        this.keyA
        this.keyD
        this.keyE
        this.keyQ

        // MISC
        this.overlayScene = 'OverlaySceneLevel3'
        this.screenCenterX
        this.screenCenterY
        this.randomizer
        this.randY
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
        console.log('⚠️ GAME SCENE LEVEL 3 START ⚠️')
        // set attributes
        this.attackRange = 25           //default: 25
        this.playerHP = 100             //default: 100
        this.playerScore = 0            //default: 0

        // get the center of the screen
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        // 🗺️ TILE MAPS, SETS, LAYERS 🗺️
        this.tileMap = this.make.tilemap({ key: 'level_3_Tilemap', tileHeight: 16, tileWidth: 16})
        this.tileSet = this.tileMap.addTilesetImage('atlasImage', 'atlas')
            // background
        this.backgroundBot = this.tileMap.createLayer('backgroundBot', this.tileSet).setCollisionByExclusion([-1])            
        this.backgroundMid = this.tileMap.createLayer('backgroundMid', this.tileSet).setCollisionByExclusion([-1])            
        this.backgroundTop = this.tileMap.createLayer('backgroundTop', this.tileSet).setCollisionByExclusion([-1])    
            // other maps
        this.terrainTiles = this.tileMap.createLayer('terrain', this.tileSet).setCollisionByExclusion([-1])
        this.coinTiles = this.tileMap.createLayer('coinTiles', this.tileSet).setCollisionByExclusion([-1])
        this.interactableTiles = this.tileMap.createLayer('interactableTiles', this.tileSet).setCollisionByExclusion([-1])
        this.breakableTiles = this.tileMap.createLayer('breakableTiles', this.tileSet).setCollisionByExclusion([-1])
        this.invisibleTiles = this.tileMap.createLayer('invisibleTiles', this.tileSet).setCollisionByExclusion([-1]).setVisible(false)

        // PORTAL
        this.portal = this.physics.add.image(124*16, 4*16, 'portal')
        this.portal.body.allowGravity = false
        this.portalAnim()

        // 🫧 PLAYER 🫧
        this.player = this.physics.add.sprite(33, 100, 'guraNormalIdle') // default 33, 100
        .play('guraNormalIdleAnim', true).setScale(.2)
        this.player.preFX.addGlow(0x8af1ff, 2)
        this.playerAttackGroup = this.physics.add.staticGroup()

        // ENEMIES
            // ENEMIES
            // shrimp
        this.Shrimp_Group = this.physics.add.group()
        const shrimp_1 = this.Shrimp_Group.create(58 ,191, 'Dark_Shrimp')
        this.tweenAnim_Handler(shrimp_1, 58*4, this, 3000)
        const shrimp_2 = this.Shrimp_Group.create(64, 351, 'Dark_Shrimp').setFlipX(false)
        this.tweenAnim_Handler(shrimp_2, 64*3.8, this, 2500)
        const shrimp_3 = this.Shrimp_Group.create(625, 559, 'Dark_Shrimp')
        this.tweenAnim_Handler(shrimp_3, 55*13.5, this, 3500)
        this.Shrimp_Group.children.iterate((shrimp)=>{
            shrimp.play('shrimpAnim', true)
            shrimp.body.allowGravity = false
        })
            // comet
        this.Comet_Group = this.physics.add.group()
        const comet_1 =  this.Comet_Group.create(31, 591, 'comet')
        this.tweenAnim_Handler(comet_1, 9*18, this, 3000, 'Back.easeOut')
        const comet_2 =  this.Comet_Group.create(93, 767, 'comet')
        this.tweenAnim_Handler(comet_2, 93*2.5, this, 3000, 'Back.easeOut')
        const comet_3 =  this.Comet_Group.create(1844, 527, 'comet').setFlipX(true)
        this.tweenAnim_Handler(comet_3, 93*16, this, 3000, 'Back.easeOut')
        
        this.Comet_Group.children.iterate((comet)=>{
            comet.play('cometAnim', true)
            comet.body.allowGravity = false
        })
            // chicken
        this.Chicken_Group = this.physics.add.group()
        this.time.addEvent({
            delay: 5000,
            loop: true,
            callback: ()=>{
                this.spawnChicken()
            }
        })
            // ghost
        this.Ghost_Group = this.physics.add.group()
        const ghost_1 =  this.Ghost_Group.create(699, 463, 'ghost')
        this.tweenAnim_Handler(ghost_1, 99*9.8, this, 3000, 'Power2')
        const ghost_2 =  this.Ghost_Group.create(622, 367, 'ghost')
        this.tweenAnim_Handler(ghost_2, 68*13.5, this, 3500, 'Circ.easeInOut')
       
        
        this.Ghost_Group.children.iterate((ghost)=>{
            ghost.play('ghostAnim', true)
            ghost.body.allowGravity = false
        })
            // gigaduck
        this.GigaDuck_Group = this.physics.add.group()
        const gigaDuck_1 =  this.GigaDuck_Group.create(1552, 687, 'gigaDuck')
        this.tweenAnim_Handler(gigaDuck_1, 121.5*16, this, 3000, 'Circ.easeInOut')
        this.GigaDuck_Group.children.iterate((gigaDuck)=>{
            gigaDuck.play('gigaDuckAnim', true)
            gigaDuck.body.allowGravity = false
        })


        
        // POWER-UPS
        this.trident = this.physics.add.sprite(335, 79, 'trident')

       


        // 📦 COLLISIONS 📦
            // player
        this.physics.add.collider(this.player, this.terrainTiles)
        this.physics.add.collider(this.player, this.breakableTiles)
        this.physics.add.collider(this.player, this.invisibleTiles)
        this.physics.add.collider(this.player, this.portal, this.portal_Handler, null, this)
            //power-ups
        this.physics.add.collider(this.trident, this.breakableTiles)
        this.physics.add.collider(this.trident, this.terrainTiles)
           

            // player + enemy
        this.physics.add.overlap(this.player, this.Shrimp_Group, this.enemyDamage_Handler, null, this)
        this.physics.add.overlap(this.player, this.Comet_Group, this.enemyDamage_Handler, null, this)
        this.physics.add.overlap(this.player, this.Chicken_Group, this.enemyDamage_Handler, null, this)
        this.physics.add.overlap(this.player, this.Ghost_Group, this.enemyDamage_Handler, null, this)
        this.physics.add.overlap(this.player, this.GigaDuck_Group, this.enemyDamage_Handler, null, this)
            // misc
        this.physics.add.collider(this.player, this.movingPlatformGroup, this.movingPlatformGroup_Handler, null, this)
        this.physics.add.overlap(this.player, this.coinTiles, this.coin_Handler, null, this)
        this.physics.add.overlap(this.player, this.trident, this.powerUp_Handler, null, this)
        this.physics.add.overlap(this.player, this.barrelGroup, this.barrelCollection_Handler, null, this)
        this.physics.add.overlap(this.player, this.interactableTiles, this.interactableTiles_Handler, null, this)
        this.physics.add.overlap(this.playerAttackGroup, this.breakableTiles, this.tilesBreak_Handler, null, this)
        
        this.physics.add.overlap(this.playerAttackGroup, this.Shrimp_Group, this.enemyHP_Handler, null, this)
        this.physics.add.overlap(this.playerAttackGroup, this.Comet_Group, this.enemyHP_Handler, null, this)
        this.physics.add.overlap(this.playerAttackGroup, this.Chicken_Group, this.enemyHP_Handler, null, this)
        this.physics.add.overlap(this.playerAttackGroup, this.Ghost_Group, this.enemyHP_Handler, null, this)
        this.physics.add.overlap(this.playerAttackGroup, this.GigaDuck_Group, this.enemyHP_Handler, null, this)

     

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
            // quickly get player pos, used for debugging
        this.input.on('pointerdown', ()=> {
            console.log('Player X: ' + Math.floor(this.player.x) + 
                    '\t\tPlayer Y: ' + Math.floor(this.player.y))
        })
        
        // OVERLAY SCENE
        this.scene.launch(this.overlayScene) 
        this.scene.bringToTop(this.overlayScene)
    }

    update() {
        this.cameras.main.startFollow(this.player, true)
        this.playerControls()
        this.playerBounds()
        this.playerHP_Handler()
        this.chickenBounds()
        this.data.set('playerHP', this.playerHP)
        this.data.set('playerScore', this.playerScore)
        this.randomizer = Phaser.Math.Between(0, 1)
        this.randY = Phaser.Math.Between(10, this.tileMap.heightInPixels - 50)
    }

    // ========================================================= 🌀 FUNCTIONS 🌀 =========================================================
        // PLAYER
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
        let playerAttack2
        let attackAnimation_to_play = 'playerAttackAnim'
        if(this.attackUprade) {
            attackAnimation_to_play = 'playerAttackAnim_upgrade'
            this.attackRange = 40
        }
        if(this.player.flipX) { // this condition is to check whether the player is flipped
            playerAttack = this.playerAttackGroup.create(this.player.x - this.attackRange, this.player.y, 'playerAttack')
            .refreshBody().anims.play(attackAnimation_to_play, true).setFlipX(true)
            if(this.attackUprade) { 
                playerAttack.setScale(1.3) 
                playerAttack2 = this.playerAttackGroup.create(this.player.x + this.attackRange, this.player.y, 'playerAttack')
                .refreshBody().anims.play(attackAnimation_to_play, true)
                if(this.attackUprade) { playerAttack2.setScale(1.3) }
            }
        } else {
            playerAttack = this.playerAttackGroup.create(this.player.x + this.attackRange, this.player.y, 'playerAttack')
            .refreshBody().anims.play(attackAnimation_to_play, true)
            if(this.attackUprade) { 
                playerAttack.setScale(1.3)
                playerAttack2 = this.playerAttackGroup.create(this.player.x - this.attackRange, this.player.y, 'playerAttack')
                .refreshBody().anims.play(attackAnimation_to_play, true).setFlipX(true)
                if(this.attackUprade) { playerAttack2.setScale(1.3) } 
            }
        }
        playerAttack.flipY = Math.random() >= 0.5   // random flip for attack animation 
        setTimeout(()=>{
            playerAttack.destroy()
            if(this.attackUprade) { playerAttack2.destroy() }
        }, 300);
    }
    playerBounds() {
        if (this.player.y >= 900) {
            this.playerHP_Handler()
            this.player.enableBody(true, 33, 100, true, true)
        }
    }
    playerHP_Handler() {
        if (this.playerHP <= 0) {
            this.playerDeathAnim()
            this.time.delayedCall(500, ()=>{
                this.scene.start('GameOverScene')
            })
        } else {
            // CHECK POINTS
            // if (this.player.x >= 2670) {
            //     this.player.enableBody(true, 2826, 230, true, true)
            // }
            // else if (this.player.x >= 1900 && this.player.x < 2670) {
            //     this.player.enableBody(true, 2045, 315, true, true)
            // }
            // else if (this.player.x < 1900  && this.player.x >= 580) {
            //     this.player.enableBody(true, 581, 150, true, true)
            // } else {
            //     this.player.enableBody(true, 50, 360, true, true)
            // }
            
        }
    }
    playerDeathAnim() {
        this.playerWarpAnimation()
        this.time.delayedCall(300, ()=>{
            this.playerHP_Handler()
        })
    }
    playerWarpAnimation() {
        this.physics.pause()
        this.player.preFX.addCircle(1)
        this.player.preFX.addGlow(0x00f2ff, 2)
        this.time.delayedCall(150, ()=>{
            this.player.preFX.addBarrel(4)
        })
        this.time.delayedCall(200, ()=>{
            this.player.disableBody(true,true)
        })
    }

        // ENEMIES
    enemyDamage_Handler(player, enemy) {
        enemy.hitCount = enemy.hitCount || 0
        enemy.hitCount++
        if(enemy.hitCount % 6 == 0) {
            if(this.Shrimp_Group.contains(enemy)) {
                this.playerHP -= 4
            }if(this.Comet_Group.contains(enemy)) {
                this.playerHP -= 4
            }if(this.Chicken_Group.contains(enemy)) {
                this.playerHP -= 2
            }if(this.Ghost_Group.contains(enemy)) {
                this.playerHP -= 6
            }if(this.GigaDuck_Group.contains(enemy)) {
                this.playerHP -= 8
            } this.damagedAnim(this.player)
        }
    }
    enemyHP_Handler(playerAttack, enemy) {
        enemy.hitCount = enemy.hitCount || 0
        enemy.hitCount++
        if(enemy.hitCount > 2) {   // ~1 hit
            if(this.Chicken_Group.contains(enemy)) {
                this.playerScore += 1
                this.removeGroupChild(this.Chicken_Group, enemy)
            }
        }if(enemy.hitCount > 29) {   // ~2 hits
            if(this.Shrimp_Group.contains(enemy)) {
                this.playerScore += 6
                this.removeGroupChild(this.Shrimp_Group, enemy)
            }else if(this.Comet_Group.contains(enemy)) {
                this.playerScore += 6
                this.removeGroupChild(this.Comet_Group, enemy)
            }
        }if(enemy.hitCount > 59) {   // ~4 hits
            if(this.Ghost_Group.contains(enemy)) {
                this.playerScore += 20
                this.removeGroupChild(this.Ghost_Group, enemy)
            }
        }if(enemy.hitCount > 750) {   // ~50 hits
            if(this.GigaDuck_Group.contains(enemy)) {
               
                this.playerScore += 150
                this.removeGroupChild(this.GigaDuck_Group, enemy)
            }
        }
        this.damagedAnim(enemy)
    }
    spawnChicken() {
        if(this.randomizer == 0) {
            const rightChicken = this.Chicken_Group.createMultiple({
                key: 'chicken',
                repeat: 5,
                setXY: {
                    x: this.tileMap.widthInPixels + 20,
                    y: this.randY,
                    stepX: Phaser.Math.Between(5, 10),
                    stepY: 40
                }
            })
            rightChicken.forEach((chicken)=>{
                chicken.setFlipX(true)
            })
            this.tweenAnim_Handler(rightChicken, -150, this, 8000, 'linear', false, false)
        } else {
            const leftChicken = this.Chicken_Group.createMultiple({
                key: 'chicken',
                repeat: 5,
                setXY: {
                    x: -20,
                    y: this.randY,
                    stepX: Phaser.Math.Between(5, 10),
                    stepY: 40
                }
            })
            this.tweenAnim_Handler(leftChicken, this.tileMap.widthInPixels + 150, this, 8000, 'linear', false, false)
        }
        this.Chicken_Group.children.iterate((chicken)=>{
            chicken.play('chickenAnim', true)
            chicken.body.allowGravity = false
        })
    }
    chickenBounds() {
        this.Chicken_Group.children.iterate((chicken)=>{
            if(chicken && (chicken.x <= -100 || chicken.x > this.tileMap.widthInPixels+100 || chicken.y <= 0 && chicken.y > this.tileMap.heightInPixels + 5)) {
                console.log('CHICKEN REMOVED!')
                this.removeGroupChild(this.Chicken_Group, chicken)
            }
        })
    }
        // POWER UP
    powerUp_Handler(player, powerUp) {
        if(this.keyE.isDown) {
            if(powerUp == this.trident) {
                console.log('TRIDENT COLLECTED')
                this.attackUprade = true
                this.trident.destroy()
            }
        }
    }

        // TILES HANDLER
    coin_Handler(player, coin) {
        if (coin.index == 611) {
            this.playerScore += 2
            this.coinTiles.removeTileAt(coin.x, coin.y)
        }
    }
    tilesBreak_Handler(player, tile) {
        const sandstoneRocks = [ 549, 550, 612, 613,
                                614, 615, 676, 677,
                                678, 679, 740, 741,
                                742, 743, 804, 805,
                                806, 807  ]

        if (tile.index == 466) {
            tile.hitCount = tile.hitCount || 0;
            tile.hitCount++;
                // ~15 per hit; ~30 = 2 hits
            if(this.attackUprade) {
                if (tile.hitCount >= 15) { this.breakableTiles.removeTileAt(tile.x, tile.y) }
            } else {
                if (tile.hitCount == 15) { tile.tint = 0xb36532 }
                else if (tile.hitCount == 30) { this.breakableTiles.removeTileAt(tile.x, tile.y) }
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
        const chestIndex = [1413,1414]
        
       
        // chest handler
        if(chestIndex.includes(tile.index)) {
            if(this.keyE.isDown) {
                this.playerScore += 50
                this.interactableTiles.removeTileAt(tile.x-1, tile.y)
                this.interactableTiles.removeTileAt(tile.x, tile.y)
                this.interactableTiles.removeTileAt(tile.x+1, tile.y)
            }
        }
        // Heal tile handler
        if(tile.index == 712) {
            if(this.playerHP < 90) {
                this.playerHP += 10
                this.interactableTiles.removeTileAt(tile.x, tile.y)
            } else if (this.playerHP >= 90) { 
                this.playerHP =  100
                this.interactableTiles.removeTileAt(tile.x, tile.y) 
            }
        }
    }
   
       
        // PORTAL
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
    portal_Handler(player, portal) {
        this.playerWarpAnimation()
        this.time.delayedCall(500,()=>{
            this.scene.start('GameVictoryScene')
        })
    }
    
        // MISC
    damagedAnim(target) {
        target.setTint(0xff5e4f)
        this.time.delayedCall(250,()=>{
            target.clearTint()
        })
    }
    removeGroupChild(group, child) {
        group.remove(child, true, true)
        child.destroy()
    }
    tweenAnim_Handler(target, x, y, duration, ease='Linear', yoyo='true', animateFlip='true') {
        const tween = this.tweens.add({ 
            targets: target,
            x: x,
            y: y,
            duration: duration,
            ease: ease,
            repeat: -1,
            yoyo: yoyo
        })
        if (animateFlip) {
            this.time.addEvent({
                delay: duration,
                loop: true,
                callback:()=>{
                    if(target.flipX) {
                        target.setFlipX(false)
                        this.time.delayedCall(duration,()=>{
                            target.setFlipX(true)
                        })
                    }
                    else {
                        target.setFlipX(true)
                        this.time.delayedCall(duration,()=>{
                            target.setFlipX(false)
                        })
                    }
                }
            })
        }
        tween.play()
        return tween
    }
}