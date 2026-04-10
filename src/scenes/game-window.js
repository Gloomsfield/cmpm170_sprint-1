class GameWindow extends Phaser.Scene {
	constructor() {
		super("game-window_scene");
	}

	makeTextbox(x, y, text, func) {
		let button = this.add.text(x, y, text, this.scoreConfig)
			.setStyle({ backgroundColor: '#111' })
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				func(button);
				this.sound.play('textbox_click', this.buttonAudioConfig);
			})
			.on('pointerover', () => {
				button.setStyle({ backgroundColor: '#f39c12' });
				this.sound.play('textbox_hover', this.buttonAudioConfig);
			})
			.on('pointerout', () => button.setStyle({ backgroundColor: '#111' }));
	}

	// test use case for function passed into makeTextbox
	moveToNextRoom(button) {
		button.setStyle({ backgroundColor: '#FFF' })
		this.currRoom = 'r2'
		this.roomText.setText(`ROOM: ${this.currRoom}`)
	}

	create() {
		KEY_UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		KEY_DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		KEY_MENU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

		this.currMap = "map1"
		this.currRoom = "r1"

		this.scoreConfig = {
			fontFamily: 'Arial',
			fontSize: '10px',
			color: '#FFFFFF',
			align: 'left',
			padding: {
				top: 5,
				bottom: 5,
			},
		}

		this.buttonAudioConfig = {
			volume: 1,
			loop: false
		}

		this.add.sprite(0,0, 'tv')

		this.cameras.main.setSize(300, 200);

		this.roomText = this.add.text(25,25,`ROOM: ${this.currRoom}`)

		this.makeTextbox(100,100,"move to next room", this.moveToNextRoom.bind(this))
		this.makeTextbox(100,125,"fight enemy", this.moveToNextRoom.bind(this))
		this.makeTextbox(100,150,"run to previous room", this.moveToNextRoom.bind(this))
	}
}

