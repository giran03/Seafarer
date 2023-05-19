export default class GameSceneLevel1 extends Phaser.Scene
{
    //******************************************//
    //              LEVEL 1 MAP                 //
    //           Created by @Giran03            //
    //******************************************//

    constructor() 
    { 
        super('GameSceneLevel1')

        this.overlayScene = 'OverlaySceneLevel1'
        this.attackUprade = false
        this.barrelCollected = 0
    }

    create() {
        console.log('⚠️ GAME SCENE LEVEL 1 START ⚠️')
        this.scene.stop('OverlaySceneLevel2')
        this.scene.stop('OverlaySceneLevel3')
        this.scene.stop('GameSceneLevel3')
        this.sound.resumeAll()
        this.sound.stopByKey('defeatSFX')
        this.sound.stopByKey('loose_1')
        this.sound.stopByKey('loose_2')
        this.sound.stopByKey('victorySFX')
        this.sound.stopByKey('win_1')
        this.sound.stopByKey('win_2')
        const {width, height} = this.scale
        const spawn_dialogues = ['spawn_1', 'spawn_2', 'spawn_3', 'spawn_4']
        this.enemy_defeat_dialogues = ['kill_1', 'kill_2']
        this.loot_dialogues = ['loot_1', 'loot_2']

        // set attributes
        this.attackRange = 25           //default: 25
        this.playerHP = 100             //default: 100
        this.playerScore = 0            //default: 0
        
        // get the center of the screen
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        // 🗺️ TILE MAPS, SETS, LAYERS 🗺️
        this.tileMap = this.make.tilemap({ key: 'level_1_Tilemap', tileHeight: 16, tileWidth: 16})
        this.tileSet = this.tileMap.addTilesetImage('atlasImage', 'atlas')
        // BACKGROUND
        this.backgroundBot = this.tileMap.createLayer('backgroundBot', this.tileSet).setCollisionByExclusion([-1])            
        this.backgroundMid = this.tileMap.createLayer('backgroundMid', this.tileSet).setCollisionByExclusion([-1])            
        this.backgroundTop = this.tileMap.createLayer('backgroundTop', this.tileSet).setCollisionByExclusion([-1])    
            // PARALLAX BACKGROUND
            this.layer_2 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl1_2').setOrigin(.5).setScrollFactor(0)
            this.layer_3 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl1_3').setOrigin(.5).setScrollFactor(0)
            this.layer_4 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl1_4').setOrigin(.5).setScrollFactor(0)
            this.layer_5 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl1_5').setOrigin(.5).setScrollFactor(0)
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
        this.sound.play(spawn_dialogues[Phaser.Math.Between(0,3)],{ volume: 2})

        // ENEMIES
            // shrimp
        this.Shrimp_Group = this.physics.add.group()
        const shrimp_1 = this.Shrimp_Group.create(20*16 ,19.1*16, 'Dark_Shrimp')
        this.tweenAnim_Handler(shrimp_1, 27*16, this, 3000)
        const shrimp_2 = this.Shrimp_Group.create(24*16, 24.1*16, 'Dark_Shrimp').setFlipX(true)
        this.tweenAnim_Handler(shrimp_2, 16*16, this, 2500)
        const shrimp_3 = this.Shrimp_Group.create(41*16, 32.1*16, 'Dark_Shrimp')
        this.tweenAnim_Handler(shrimp_3, 55*16, this, 3500)
        this.Shrimp_Group.children.iterate((shrimp)=>{
            shrimp.play('shrimpAnim', true)
            shrimp.body.allowGravity = false
        })
            // comet
        this.Comet_Group = this.physics.add.group()
        const comet_1 =  this.Comet_Group.create(2*16, 28.5*16, 'comet')
        this.tweenAnim_Handler(comet_1, 9*16, this, 3000, 'Back.easeOut')
        const comet_2 =  this.Comet_Group.create(55*16, 31.5*16, 'comet')
        this.tweenAnim_Handler(comet_2, 62*16, this, 3000, 'Back.easeOut')
        const comet_3 =  this.Comet_Group.create(14*16, 46.5*16, 'comet')
        this.tweenAnim_Handler(comet_3, 47*16, this, 3000, 'Circ.easeInOut')
        const comet_4 =  this.Comet_Group.create(103*16, 14.5*16, 'comet')
        this.tweenAnim_Handler(comet_4, 118*16, this, 3500, 'Circ.easeInOut')
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
        const ghost_1 =  this.Ghost_Group.create(64*16, 10*16, 'ghost')
        this.tweenAnim_Handler(ghost_1, 99*16, this, 3000, 'Power2')
        const ghost_2 =  this.Ghost_Group.create(95*16, 5*16, 'ghost').setFlipX(true)
        this.tweenAnim_Handler(ghost_2, 68*16, this, 4500, 'Back.easeInOut')
        const ghost_3 =  this.Ghost_Group.create(122*16, 9*16, 'ghost').setFlipX(true)
        this.tweenAnim_Handler(ghost_3, 107*16, this, 4000, 'Back.easeInOut')
        const ghost_4 =  this.Ghost_Group.create(41*16, 26*16, 'ghost')
        this.tweenAnim_Handler(ghost_4, 68*16, this, 3500, 'Circ.easeInOut')
        this.Ghost_Group.children.iterate((ghost)=>{
            ghost.play('ghostAnim', true)
            ghost.body.allowGravity = false
        })
            // gigaduck
        this.GigaDuck_Group = this.physics.add.group()
        const gigaDuck_1 =  this.GigaDuck_Group.create(107*16, 41.3*16, 'gigaDuck')
        this.tweenAnim_Handler(gigaDuck_1, 121.5*16, this, 3000, 'Circ.easeInOut')
        this.GigaDuck_Group.children.iterate((gigaDuck)=>{
            gigaDuck.play('gigaDuckAnim', true)
            gigaDuck.body.allowGravity = false
        })

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
        this.movingPlatform_2 = this.movingPlatformGroup.create(1960, 700, 'movingPlatform').setVisible(false)
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
            // player
        this.physics.add.collider(this.player, this.terrainTiles)
        this.physics.add.collider(this.player, this.breakableTiles)
        this.physics.add.collider(this.player, this.invisibleTiles)
        this.physics.add.collider(this.player, this.portal, this.portal_Handler, null, this)
            //power-ups
        this.physics.add.collider(this.trident, this.breakableTiles)
        this.physics.add.collider(this.trident, this.terrainTiles)
            // moving platform
        this.physics.add.collider(this.movingPlatformGroup, this.terrainTiles)
        this.physics.add.collider(this.barrelGroup, this.terrainTiles)

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
            // quickly get player pos, used for debugging
        this.input.on('pointerdown', ()=> {
            // this.scene.start('GameSceneLevel2')
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
        this.parralax_Handler()
        this.data.set('playerHP', this.playerHP)
        this.data.set('playerScore', this.playerScore)
        this.randomizer = Phaser.Math.Between(0, 1)
        this.randY = Phaser.Math.Between(10, this.tileMap.heightInPixels - 50)
    }

    // ========================================================= 🌀 FUNCTIONS 🌀 =========================================================
    // BACKGROND
    parralax_Handler() {
        if(this.keyD.isDown && !this.player.body.blocked.right) {
            this.layer_2.tilePositionX += .3
            this.layer_3.tilePositionX += .8
            this.layer_4.tilePositionX += 1
            this.layer_5.tilePositionX += 1.5
        } else if(this.keyA.isDown && !this.player.body.blocked.left) {
            this.layer_2.tilePositionX -= .3
            this.layer_3.tilePositionX -= .8
            this.layer_4.tilePositionX -= 1
            this.layer_5.tilePositionX -= 1.5
        }
    }
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
        let attackSFX_to_play = 'attack_1'
        if(this.attackUprade) {
            attackAnimation_to_play = 'playerAttackAnim_upgrade'
            attackSFX_to_play = 'attack_2'
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

        this.sound.play(attackSFX_to_play, {volume: .6})
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
                this.sound.play('enemySFX', {volume: .8})
                this.playerScore += 1
                this.removeGroupChild(this.Chicken_Group, enemy)
            }
        }if(enemy.hitCount > 29) {   // ~2 hits
            if(this.Shrimp_Group.contains(enemy)) {
                this.sound.play(this.enemy_defeat_dialogues[this.randomizer], {volume: 1.3})
                this.sound.play('enemySFX', {volume: .8})
                this.playerScore += 6
                this.removeGroupChild(this.Shrimp_Group, enemy)
            }else if(this.Comet_Group.contains(enemy)) {
                this.sound.play(this.enemy_defeat_dialogues[this.randomizer], {volume: 1.3})
                this.sound.play('enemySFX', {volume: .8})
                this.playerScore += 6
                this.removeGroupChild(this.Comet_Group, enemy)
            }
        }if(enemy.hitCount > 59) {   // ~4 hits
            if(this.Ghost_Group.contains(enemy)) {
                this.sound.play(this.enemy_defeat_dialogues[this.randomizer], {volume: 1.3})
                this.sound.play('enemySFX', {volume: .8})
                this.playerScore += 20
                this.removeGroupChild(this.Ghost_Group, enemy)
            }
        }if(enemy.hitCount > 750) {   // ~50 hits
            if(this.GigaDuck_Group.contains(enemy)) {
                this.sound.play(this.enemy_defeat_dialogues[this.randomizer], {volume: 1.3})
                this.movingPlatform_2.setVisible(true)
                this.sound.play('enemySFX', {volume: .8})
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
                this.sound.play('healSFX', {volume: 1.3})
                console.log('TRIDENT COLLECTED')
                this.attackUprade = true
                this.trident.destroy()
            }
        }
    }

        // TILES HANDLER
    coin_Handler(player, coin) {
        if (coin.index == 711) {
            this.sound.play('coinSFX', {volume: .8})
            this.playerScore += 2
            this.coinTiles.removeTileAt(coin.x, coin.y)
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
            if(this.attackUprade) {
                if (tile.hitCount >= 15) { this.sound.play('brickSFX', {volume: .2});this.breakableTiles.removeTileAt(tile.x, tile.y) }
            } else {
                if (tile.hitCount == 15) { tile.tint = 0xb36532 }
                else if (tile.hitCount == 30) { this.sound.play('brickSFX', {volume: .2});this.breakableTiles.removeTileAt(tile.x, tile.y) }
            }
        }
        if(sandstoneRocks.includes(tile.index) && this.attackUprade) {
            tile.hitCount = tile.hitCount || 0;
            tile.hitCount++;
            if (tile.hitCount == 30) { tile.tint = 0xe08e53 }
            if (tile.hitCount == 60) { tile.tint = 0xb36532 }
            else if (tile.hitCount == 90) {
                this.sound.play('brickSFX', {volume: .2})
                this.breakableTiles.removeTileAt(tile.x, tile.y)
            }
        }
    }
    interactableTiles_Handler(player, tile) {
        const chestIndex = [1413,1414]
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
        // platform control panel handler
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
        // barrel platform handler
        if(tile.index == 1478) {
            if(Phaser.Input.Keyboard.JustDown(this.keyE)) {
                this.sound.play('barrelSFX', {volume: .8})
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
        // chest handler
        if(chestIndex.includes(tile.index)) {
            if(this.keyE.isDown) {
                this.sound.play(this.loot_dialogues[this.randomizer], {volume: 1.5})
                this.sound.play('chestSFX', {volume: .8})
                this.playerScore += 50
                this.interactableTiles.removeTileAt(tile.x-1, tile.y)
                this.interactableTiles.removeTileAt(tile.x, tile.y)
                this.interactableTiles.removeTileAt(tile.x+1, tile.y)
            }
        }
        // Heal tile handler
        if(tile.index == 712) {
            this.sound.play('healSFX', {volume: 1.3})
            if(this.playerHP < 90) {
                this.playerHP += 10
                this.interactableTiles.removeTileAt(tile.x, tile.y)
            } else if (this.playerHP >= 90) { 
                this.playerHP =  100
                this.interactableTiles.removeTileAt(tile.x, tile.y) 
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
        if(this.keyE.isDown && this.enableMovingPlatform_1) {
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

        // BARREL HANDLER
    createBarrel(x, y) {
        this.barrelGroup.create(x, y, 'barrel')
        this.barrelGroup.children.iterate((barrel)=>{
            barrel.setImmovable(true)
        })
    }
    barrelCollection_Handler(player, barrel) {
        const spawnBarrelCords = [456,395,776]
        
        if(Phaser.Input.Keyboard.JustDown(this.keyE) && spawnBarrelCords.includes(barrel.x)) {
            this.sound.play('barrelSFX', {volume: .8})
            this.barrelCollected += 1
            console.log(`BARREL COUNT: ${this.barrelCollected}`)
            this.barrelGroup.remove(barrel, true, true)
            barrel.destroy()
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
            this.scene.start('GameSceneLevel2')
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