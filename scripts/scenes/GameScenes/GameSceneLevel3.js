export default class GameSceneLevel3 extends Phaser.Scene
{
    //******************************************//
    //              LEVEL 3 MAP                 //
    //          Created by @JoshBG2             //
    //******************************************//

    constructor() 
    { 
        super('GameSceneLevel3')

        this.overlayScene = 'OverlaySceneLevel3'
    }

    create() {
        console.log('⚠️ GAME SCENE LEVEL 3 START ⚠️')
        this.scene.stop('OverlaySceneLevel2')
        this.scene.stop('GameSceneLevel2')
        const {width, height} = this.scale
        const spawn_dialogues = ['spawn_1','spawn_2','spawn_3','spawn_4']
        this.enemy_defeat_dialogues = ['kill_1', 'kill_2']
        this.loot_dialogues = ['loot_1', 'loot_2']

        // set attributes
        this.attackUprade = false
        this.barrelCollected = 0
        this.attackRange = 25           //default: 25
        this.playerHP = 100             //default: 100
        this.playerScore = this.scene.get('GameSceneLevel2').data.get('playerScore')    // gets the last score from level 2

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
            // PARALLAX BACKGROUND
        this.layer_7 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl4_7').setOrigin(.5).setScrollFactor(0)
        this.layer_6 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl4_6').setOrigin(.5).setScrollFactor(0)
        this.layer_5 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl4_5').setOrigin(.5).setScrollFactor(0)
        this.layer_4 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl4_4').setOrigin(.5).setScrollFactor(0)
        this.layer_3 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl4_3').setOrigin(.5).setScrollFactor(0)
        this.layer_2 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl4_2').setOrigin(.5).setScrollFactor(0)
        this.layer_1 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl4_1').setOrigin(.5).setScrollFactor(0)
            // other maps
        this.terrainTiles = this.tileMap.createLayer('terrain', this.tileSet).setCollisionByExclusion([-1])
        this.coinTiles = this.tileMap.createLayer('coinTiles', this.tileSet).setCollisionByExclusion([-1])
        this.interactableTiles = this.tileMap.createLayer('interactableTiles', this.tileSet).setCollisionByExclusion([-1])
        this.breakableTiles = this.tileMap.createLayer('breakableTiles', this.tileSet).setCollisionByExclusion([-1])
        this.invisibleTiles = this.tileMap.createLayer('invisibleTiles', this.tileSet).setCollisionByExclusion([-1]).setVisible(false)

        // PORTAL
        this.portal = this.physics.add.image(2030, 435, 'portal')
        this.portal.body.allowGravity = false
        this.portalAnim()

        // 🫧 PLAYER 🫧
        this.player = this.physics.add.sprite(33, 751, 'guraNormalIdle') 
        .play('guraNormalIdleAnim', true).setScale(.2)
        this.player.preFX.addGlow(0x8af1ff, 2)
        this.playerAttackGroup = this.physics.add.staticGroup()
        this.sound.play(spawn_dialogues[Phaser.Math.Between(0,3)],{ volume: 2})

        // ENEMIES
            // shrimp
        this.Shrimp_Group = this.physics.add.group()
        const shrimp_1 = this.Shrimp_Group.create(610, 751, 'Dark_Shrimp').setFlipX(true)
        this.tweenAnim_Handler(shrimp_1, 399, this, 3000)
        const shrimp_2 = this.Shrimp_Group.create(399, 751, 'Dark_Shrimp')
        this.tweenAnim_Handler(shrimp_2, 610, this, 3000)
        const shrimp_3 = this.Shrimp_Group.create(1320, 639, 'Dark_Shrimp').setFlipX(true)
        this.tweenAnim_Handler(shrimp_3, 1151, this, 3000)
        const shrimp_4 = this.Shrimp_Group.create(1151, 639, 'Dark_Shrimp')
        this.tweenAnim_Handler(shrimp_4, 1320, this, 3000)
        const shrimp_5 = this.Shrimp_Group.create(1151, 447, 'Dark_Shrimp')
        this.tweenAnim_Handler(shrimp_5, 1330, this, 3000)
        const shrimp_6 = this.Shrimp_Group.create(1826, 335, 'Dark_Shrimp').setFlipX(true)
        this.tweenAnim_Handler(shrimp_6, 1743, this, 3000)
        const shrimp_7 = this.Shrimp_Group.create(1908, 223, 'Dark_Shrimp').setFlipX(true)
        this.tweenAnim_Handler(shrimp_7, 1582, this, 3000)
        const shrimp_8 = this.Shrimp_Group.create(1666, 335, 'Dark_Shrimp').setFlipX(true)
        this.tweenAnim_Handler(shrimp_8, 1583, this, 3000)
        this.Shrimp_Group.children.iterate((shrimp)=>{
            shrimp.play('shrimpAnim', true)
            shrimp.body.allowGravity = false;
        })
            // comet
        this.Comet_Group = this.physics.add.group()
        const comet_1 = this.Comet_Group.create(1394, 735, 'comet').setFlipX(true)
        this.tweenAnim_Handler(comet_1, 1140, this, 3000, 'Back.easeOut')
        const comet_2 = this.Comet_Group.create(1394, 543, 'comet').setFlipX(true)
        this.tweenAnim_Handler(comet_2, 1245, this, 3000, 'Back.easeOut')
        const comet_3 = this.Comet_Group.create(1245, 543, 'comet')
        this.tweenAnim_Handler(comet_3, 1394, this, 3000, 'Back.easeOut')
        const comet_4 = this.Comet_Group.create(1582, 223, 'comet')
        this.tweenAnim_Handler(comet_4, 1908, this, 3000, 'Back.easeOut')
        const comet_5 = this.Comet_Group.create(1908, 223, 'comet').setFlipX(true)
        this.tweenAnim_Handler(comet_5, 1582, this, 3000, 'Back.easeOut')
        const comet_6 = this.Comet_Group.create(2018, 335, 'comet').setFlipX(true)
        this.tweenAnim_Handler(comet_6, 1903, this, 3000, 'Circ.easeInOut')
        const comet_7 = this.Comet_Group.create(659, 143, 'comet')
        this.tweenAnim_Handler(comet_7, 944, this, 3000, 'Circ.easeInOut')
        this.Comet_Group.children.iterate((comet)=>{
            comet.play('cometAnim', true)
            comet.body.allowGravity = false
        })
            //chicken
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
        const ghost_1 = this.Ghost_Group.create(447, 319, 'ghost')
        this.tweenAnim_Handler(ghost_1, 498, this, 3000)
        const ghost_2 = this.Ghost_Group.create(944, 143, 'ghost').setFlipX(true)
        this.tweenAnim_Handler(ghost_2, 659, this, 3000, 'Circ.easeInOut')
        const ghost_3 = this.Ghost_Group.create(1394, 351, 'ghost').setFlipX(true)
        this.tweenAnim_Handler(ghost_3, 1215, this, 3000, 'Circ.easeInOut')
        const ghost_4 = this.Ghost_Group.create(1151, 255, 'ghost')
        this.tweenAnim_Handler(ghost_4, 1321, this, 3000, 'Circ.easeInOut')
        const ghost_5 = this.Ghost_Group.create(1119, 223, 'ghost')
        this.tweenAnim_Handler(ghost_5, 1321, this, 3000, 'Back.easeOut')
        const ghost_6 = this.Ghost_Group.create(354, 751, 'ghost').setFlipX(true)
        this.tweenAnim_Handler(ghost_6, 31, this, 3000)
        const ghost_7 = this.Ghost_Group.create(1583, 335, 'ghost')
        this.tweenAnim_Handler(ghost_7, 1666, this, 3000)
        this.Ghost_Group.children.iterate((ghost)=>{
            ghost.play('ghostAnim', true)
            ghost.body.allowGravity = false
        })
            // gigaduck
        this.GigaDuck_Group = this.physics.add.group()
        const gigaDuck_1 =  this.GigaDuck_Group.create(1923, 615, 'gigaDuck').setFlipX(true).setScale(1.35)
        this.tweenAnim_Handler(gigaDuck_1, 1696, this, 3000, 'Circ.easeInOut')
        this.GigaDuck_Group.children.iterate((gigaDuck)=>{
            gigaDuck.play('gigaDuckAnim', true)
            gigaDuck.body.allowGravity = false
        })

        // BARREL
        this.barrelGroup = this.physics.add.group()
        this.createBarrel(403, 48)
        
        // POWER-UPS
        this.trident = this.physics.add.sprite(1273, 111, 'trident')

        // MOVING PLATFORM
        this.movingPlatformGroup = this.physics.add.group()
        this.movingPlatform_1 = this.movingPlatformGroup.create(1885, 140, 'movingPlatform_lvl4').setScale(0.8)
        this.movingPlatform_2 = this.movingPlatformGroup.create(545,80,'movingPlatform_lvl4').setScale(0.5)
        this.movingPlatform_3 = this.movingPlatformGroup.create(1925,473,'movingPlatform_lvl4').setScale(0.6).setVisible(false)
            // moving platform animation
        this.tweenAnim_Handler(this.movingPlatform_2, 545, 315, 2500)
        this.tweenAnim_Handler(this.movingPlatform_3, 1915, 730, 2500)

        this.movingPlatformGroup.children.iterate((platform)=>{
            platform.setImmovable(true)
            platform.body.allowGravity = false
        })

        // 📦 COLLISIONS 📦
            //player
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
        this.physics.add.collider(this.player, this.movingPlatformGroup)
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

        this.input.on('pointerdown', ()=> {
            this.scene.start('GameVictoryScene')
            console.log('Player X: ' + Math.floor(this.player.x) + 
                    '\t\tPlayer Y: ' + Math.floor(this.player.y))
        })

        // OVERLAY SCENE
        this.scene.launch(this.overlayScene) 
        this.scene.bringToTop(this.overlayScene)
    }

    update() { // UPDATE AND ADD HP AND SCORE 
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
            this.layer_1.tilePositionX += 1
            this.layer_2.tilePositionX += .8
            this.layer_3.tilePositionX += .5
            this.layer_4.tilePositionX += .35
            this.layer_5.tilePositionX += .3
            this.layer_6.tilePositionX += .25
            this.layer_7.tilePositionX += .2
        } else if(this.keyA.isDown && !this.player.body.blocked.left) {
            this.layer_1.tilePositionX -= 1
            this.layer_2.tilePositionX -= .8
            this.layer_3.tilePositionX -= .5
            this.layer_4.tilePositionX -= .35
            this.layer_5.tilePositionX -= .3
            this.layer_6.tilePositionX -= .25
            this.layer_7.tilePositionX -= .2
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
            this.playerEmitter()
        }
        else if (this.controls.right.isDown || this.keyD.isDown) {
            this.player.setVelocityX(300).setFlipX(false).anims.play('guraNormalRunAnim', true)
            this.playerEmitter()
        }
        if (this.controls.up.isDown && this.player.body.blocked.down || this.keyW.isDown && this.player.body.blocked.down) { 
            this.player.setVelocityY(-430)
            this.playerEmitter()
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
        if(this.attackUpgrade) {
            attackAnimation_to_play = 'playerAttackAnim_upgrade'
            attackSFX_to_play = 'attack_2'
            this.attackRange = 40
        }
        if(this.player.flipX) { // this condition is to check whether the player is flipped
            playerAttack = this.playerAttackGroup.create(this.player.x - this.attackRange, this.player.y, 'playerAttack')
            .refreshBody().anims.play(attackAnimation_to_play, true).setFlipX(true)
            if(this.attackUpgrade) { 
                playerAttack.setScale(1.3) 
                playerAttack2 = this.playerAttackGroup.create(this.player.x + this.attackRange, this.player.y, 'playerAttack')
                .refreshBody().anims.play(attackAnimation_to_play, true)
                if(this.attackUpgrade) { playerAttack2.setScale(1.3) }
            }
        } else {
            playerAttack = this.playerAttackGroup.create(this.player.x + this.attackRange, this.player.y, 'playerAttack')
            .refreshBody().anims.play(attackAnimation_to_play, true)
            if(this.attackUpgrade) { 
                playerAttack.setScale(1.3)
                playerAttack2 = this.playerAttackGroup.create(this.player.x - this.attackRange, this.player.y, 'playerAttack')
                .refreshBody().anims.play(attackAnimation_to_play, true).setFlipX(true)
                if(this.attackUpgrade) { playerAttack2.setScale(1.3) } 
            }
        }
        
        this.sound.play(attackSFX_to_play, {volume: .6})
        playerAttack.flipY = Math.random() >= 0.5   // random flip for attack animation 
        setTimeout(()=>{
            playerAttack.destroy()
            if(this.attackUpgrade) { playerAttack2.destroy() }
        }, 300);
    }

    playerBounds() {
        if (this.player.y >= 900) {
            this.playerHP -= 10
            console.log("PLAYER HP: " + this.playerHP)
            this.playerHP_Handler()
            this.player.enableBody(true, 33, 750, true, true)
        }
    }
    playerHP_Handler() {
        if (this.playerHP <= 0) {
            this.playerDeathAnim()
            this.time.delayedCall(500, ()=>{
                this.scene.start('GameOverScene')
            })
        }
    }
    playerEmitter() {
        this.player.depth = 10
        let emitter = this.add.particles(0,0, 'guraNormalRun', {
            follow: this.player,
            scale: this.player.scale,
            lifespan: { min: 20, max: 30 },
            angle: { min: 180, max: 180 },
            speed: 75,
            blendMode: 'SCREEN'
        })
        this.time.delayedCall(50, () => { emitter.stop() }, null, this)
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
            console.log.apply("PLAYER HP: " + this.playerHP)
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
                this.sound.play('enemySFX', {volume: .8})
                this.movingPlatform_3.setVisible(true)
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
                this.attackUpgrade = true
                this.trident.destroy()
            }
        }
    }

        // TILES HANDLER
    coin_Handler(player, coin) {
        if (coin.index == 711) {
            this.sound.play('coinSFX', {volume: .4})
            this.playerScore += 2
            this.coinTiles.removeTileAt(coin.x, coin.y)
        }
    }
    tilesBreak_Handler(player, tile) {
        const sandstoneRocks = [     554, 555,
                                617, 618, 619, 620,
                                681, 682, 683, 684,
                                745, 746, 747, 748,
                                809, 810, 811, 812  ]

        if (tile.index == 162) {
            tile.hitCount = tile.hitCount || 0;
            tile.hitCount++;
                // ~15 per hit; ~30 = 2 hits
            if(this.attackUpgrade) {
                if (tile.hitCount >= 15) { this.sound.play('brickSFX', {volume: .2});this.breakableTiles.removeTileAt(tile.x, tile.y) }
            } else {
                if (tile.hitCount == 15) { tile.tint = 0xb36532 }
                else if (tile.hitCount == 30) { this.sound.play('brickSFX', {volume: .2});this.breakableTiles.removeTileAt(tile.x, tile.y) }
            }
        }
        if(sandstoneRocks.includes(tile.index) && this.attackUpgrade) {
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
        // barrel platform
        if(tile.index == 1478) {
            if(Phaser.Input.Keyboard.JustDown(this.keyE)) {
                this.sound.play('barrelSFX', {volume: .8})
                if(this.barrelCollected == 1) {
                    this.createBarrel(1463, 111)
                    this.enableMovingPlatform_1 = true
                    this.tweenAnim_Handler(this.movingPlatform_1, 1605, 140, 2500)
                }
            }
        }
        // chest handler
        if(chestIndex.includes(tile.index)) {
            if(this.keyE.isDown) {
                this.sound.play(this.loot_dialogues[this.randomizer], {volume: .7})
                this.sound.play('chestSFX', {volume: .4})
                this.playerScore += 25
                this.interactableTiles.removeTileAt(tile.x-1, tile.y)
                this.interactableTiles.removeTileAt(tile.x, tile.y)
                this.interactableTiles.removeTileAt(tile.x+1, tile.y)
            }
        }
        // Heal tile handler
        if(tile.index == 712) {
            this.sound.play('healSFX', {volume: 1})
            if(this.playerHP < 85) {
                this.playerHP += 15
                this.interactableTiles.removeTileAt(tile.x, tile.y)
            } else if (this.playerHP >= 85) { 
                this.playerHP =  100
                this.interactableTiles.removeTileAt(tile.x, tile.y) 
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
        const spawnBarrelCords = [403]
        
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
        this.time.delayedCall(250,()=>{
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