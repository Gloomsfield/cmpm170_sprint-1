class InnerGame extends Phaser.Scene {
	constructor() {
		super("inner-game_scene");
	}

	preload() {
		this.load.image('player', "ibm_smiley_large.png")
	}

	create() {
		this.player = this.physics.add.sprite(100, 450, 'player');
		this.player.setScale(0.5);
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update() {
		this.player.setVelocity(0);
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-160);
		}
		else if (this.cursors.right.isDown) {
			this.player.setVelocityX(160);
		}
		if (this.cursors.up.isDown) {
			this.player.setVelocityY(-160);
		} 
		else if (this.cursors.down.isDown) {
			this.player.setVelocityY(160);
		}
	}

	
}

