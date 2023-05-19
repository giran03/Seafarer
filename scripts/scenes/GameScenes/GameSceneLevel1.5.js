export default class GameSceneLevel1_5 extends Phaser.Scene
{
    constructor() 
    { 
        super('GameSceneLevel1_5')

        this.overlayScene = 'OverlaySceneLevel1_5'
    }

    create() {
        console.log('⚠️ GAME SCENE LEVEL 1.5 START ⚠️')
        this.scene.stop('OverlaySceneLevel1')
        this.scene.stop('GameSceneLevel1')
        const {width, height} = this.scale
        const spawn_dialogues = ['spawn_1','spawn_2','spawn_3','spawn_4']
        this.enemy_defeat_dialogues = ['kill_1', 'kill_2']
        this.loot_dialogues = ['loot_1', 'loot_2']

        // set attributes
        this.attackUprade = false
        this.attackRange = 25           //default: 25
        this.playerHP = 100             //default: 100
        this.playerScore = this.scene.get('GameSceneLevel1').data.get('playerScore')

        // get the center of the screen
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        // 🗺️ TILE MAPS, SETS, LAYERS 🗺️
        this.tileMap = this.make.tilemap({ key: 'level_1_5_Tilemap', tileHeight: 16, tileWidth: 16})
        this.tileSet = this.tileMap.addTilesetImage('atlasImage', 'atlas')
            // background
        this.backgroundBot = this.tileMap.createLayer('backgroundBot', this.tileSet).setCollisionByExclusion([-1])            
        this.backgroundMid = this.tileMap.createLayer('backgroundMid', this.tileSet).setCollisionByExclusion([-1])            
        this.backgroundTop = this.tileMap.createLayer('backgroundTop', this.tileSet).setCollisionByExclusion([-1])    
            // PARALLAX BACKGROUND
        this.layer_5 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl1_5_5').setOrigin(.5).setScrollFactor(0)
        this.layer_4 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl1_5_4').setOrigin(.5).setScrollFactor(0)
        this.layer_3 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl1_5_3').setOrigin(.5).setScrollFactor(0)
        this.layer_2 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl1_5_2').setOrigin(.5).setScrollFactor(0)
        this.layer_1 = this.add.tileSprite(this.screenCenterX, this.screenCenterY, width, height, 'lvl1_5_1').setOrigin(.5).setScrollFactor(0)
            // other maps
        this.terrainTiles = this.tileMap.createLayer('terrain', this.tileSet).setCollisionByExclusion([-1])
        this.coinTiles = this.tileMap.createLayer('coinTiles', this.tileSet).setCollisionByExclusion([-1])
        this.interactableTiles = this.tileMap.createLayer('interactableTiles', this.tileSet).setCollisionByExclusion([-1])
        this.breakableTiles = this.tileMap.createLayer('breakableTiles', this.tileSet).setCollisionByExclusion([-1])
        this.invisibleTiles = this.tileMap.createLayer('invisibleTiles', this.tileSet).setCollisionByExclusion([-1]).setVisible(false)

        // PORTAL
        this.portal = this.physics.add.image(765, 709, 'portal')
        this.portal.body.allowGravity = false
        this.portalAnim()

        // 🫧 PLAYER 🫧
        this.player = this.physics.add.sprite(40, 101, 'guraNormalIdle') // default 40, 101
        .play('guraNormalIdleAnim', true).setScale(.2)
        this.player.preFX.addGlow(0x8af1ff, 2)
        this.playerAttackGroup = this.physics.add.staticGroup()
        this.sound.play(spawn_dialogues[Phaser.Math.Between(0,3)],{ volume: 2})

        // ENEMIES
            // shrimp
        this.Shrimp_Group = this.physics.add.group()
        const shrimp_1 = this.Shrimp_Group.create(704 ,225, 'Dark_Shrimp').setFlipX(true)
        this.tweenAnim_Handler(shrimp_1, 34*16, this, 3000)
        const shrimp_2 = this.Shrimp_Group.create(241 ,290, 'Dark_Shrimp')
        this.tweenAnim_Handler(shrimp_2, 19.5*16, this, 600)
        const shrimp_3 = this.Shrimp_Group.create(145 ,452, 'Dark_Shrimp')
        this.tweenAnim_Handler(shrimp_3, 33*16, this, 3500)
        const shrimp_4 = this.Shrimp_Group.create(1568 ,225, 'Dark_Shrimp')
        this.tweenAnim_Handler(shrimp_4, 107*16, this, 3500)
        this.Shrimp_Group.children.iterate((shrimp)=>{
            shrimp.play('shrimpAnim', true)
            shrimp.body.allowGravity = false
        })
            // comet
        this.Comet_Group = this.physics.add.group()
        const comet_1 =  this.Comet_Group.create(425,160, 'comet').setFlipX(true)
        this.tweenAnim_Handler(comet_1, 185, this, 3000, 'Back.easeOut')
        const comet_2 =  this.Comet_Group.create(752, 223, 'comet')
        this.tweenAnim_Handler(comet_2, 70*16, this, 5000, 'Back.easeOut')
        const comet_3 =  this.Comet_Group.create(525, 625, 'comet')
        this.tweenAnim_Handler(comet_3, 20*16, this, 6000, 'Circ.easeInOut')
        const comet_4 =  this.Comet_Group.create(1231, 112, 'comet')
        this.tweenAnim_Handler(comet_4, 90*16, this, 1500, 'Circ.easeInOut')
        this.Comet_Group.children.iterate((comet)=>{
            comet.play('cometAnim', true)
            comet.body.allowGravity = false
        })
            // ghost
        this.Ghost_Group = this.physics.add.group()
        const ghost_1 =  this.Ghost_Group.create(32, 704, 'ghost')
        this.tweenAnim_Handler(ghost_1, 12*16, this, 3000, 'Power2')
        const ghost_2 =  this.Ghost_Group.create(592, 385, 'ghost')
        this.tweenAnim_Handler(ghost_2, 55*16, this, 3000,'Power2')
        const ghost_3 =  this.Ghost_Group.create(1185, 52, 'ghost').setFlipX(true)
        this.tweenAnim_Handler(ghost_3, 47*16, this, 2500, 'Circ.easeInOut')
        const ghost_4 =  this.Ghost_Group.create(1760, 400, 'ghost').setFlipX(true)
        this.tweenAnim_Handler(ghost_4, 78*16, this, 7000,)
        this.Ghost_Group.children.iterate((ghost)=>{
            ghost.play('ghostAnim', true)
            ghost.body.allowGravity = false
        })
            // gigaduck
        this.GigaDuck_Group = this.physics.add.group()
        const gigaDuck_1 =  this.GigaDuck_Group.create(792, 663, 'gigaDuck')
        this.tweenAnim_Handler(gigaDuck_1, 67*16, this, 3500, 'Circ.easeInOut')
        this.GigaDuck_Group.children.iterate((gigaDuck)=>{
            gigaDuck.play('gigaDuckAnim', true)
            gigaDuck.body.allowGravity = false
            gigaDuck.setScale(.7)
        })

        // POWER-UPS
        this.trident = this.physics.add.sprite(33, 768, 'trident')  

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
        this.physics.add.overlap(this.player, this.Ghost_Group, this.enemyDamage_Handler, null, this)
        this.physics.add.overlap(this.player, this.GigaDuck_Group, this.enemyDamage_Handler, null, this)
            // misc
        this.physics.add.overlap(this.player, this.coinTiles, this.coin_Handler, null, this)
        this.physics.add.overlap(this.player, this.trident, this.powerUp_Handler, null, this)
        this.physics.add.overlap(this.player, this.interactableTiles, this.interactableTiles_Handler, null, this)
        this.physics.add.overlap(this.playerAttackGroup, this.breakableTiles, this.tilesBreak_Handler, null, this)
        
        this.physics.add.overlap(this.playerAttackGroup, this.Shrimp_Group, this.enemyHP_Handler, null, this)
        this.physics.add.overlap(this.playerAttackGroup, this.Comet_Group, this.enemyHP_Handler, null, this)
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
            this.scene.start('GameSceneLevel2')
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
            this.layer_4.tilePositionX += .25
            this.layer_5.tilePositionX += .2
        } else if(this.keyA.isDown && !this.player.body.blocked.left) {
            this.layer_1.tilePositionX -= 1
            this.layer_2.tilePositionX -= .8
            this.layer_3.tilePositionX -= .5
            this.layer_4.tilePositionX -= .25
            this.layer_5.tilePositionX -= .2
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
            attackSFX_to_play = 'attack_2'
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
            // }if(this.Chicken_Group.contains(enemy)) {
            //     this.playerHP -= 2
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
        if(enemy.hitCount > 29) {   // ~2 hits
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
                this.playerScore += 150
                this.removeGroupChild(this.GigaDuck_Group, enemy)
            }
        }
        this.damagedAnim(enemy)
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
            this.sound.play('coinSFX', {volume: .4})
            this.playerScore += 2
            this.coinTiles.removeTileAt(coin.x, coin.y)
        }
    }
    tilesBreak_Handler(player, tile) {
        const sandstoneRocks = [ 543, 544, 545, 546,
                                607, 608, 609, 610,
                                671, 672, 673, 674,
                                735, 736, 737, 738,
                                799, 800, 801, 802]

        if (tile.index == 146) {
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
        // chest handler
        if(chestIndex.includes(tile.index)) {
            if(this.keyE.isDown) {
                this.sound.play(this.loot_dialogues[this.randomizer], {volume: .7})
                this.sound.play('chestSFX', {volume: .4})
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