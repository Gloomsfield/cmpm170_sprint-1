class GameWindow extends Phaser.Scene {
	constructor() {
		super("game-window_scene");
	}

	preload() {
		// load paths for less typing also for organization lowkey
		this.load.path = 'assets/sounds/'
		this.load.audio('textbox_hover', 'textbox_hover.mp3')
		this.load.audio('textbox_click', 'textbox_click.mp3')

		this.load.path = 'assets/images/'
		this.load.image('inventory', 'inventory.png');
		this.load.image('pausemenu', 'Play-Options-Exit.png)');
		this.load.image('levelborder', 'Level Border.png');
		this.load.image('tv', 'outergametv.png');
		this.load.spritesheet('rogueplayer', 'doc.png', { frameWidth: 16, frameHeight: 16 });

	}

	makeTextbox(x, y, text, func) {
		let button = this.add.text(x, y, text, this.scoreConfig)
			.setStyle({ backgroundColor: '#111' })
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				func(button);
				this.sound.play('textbox-click_sound', this.buttonAudioConfig);
			})
			.on('pointerover', () => {
				button.setStyle({ backgroundColor: '#f39c12' });
				this.sound.play('textbox-hover_sound', this.buttonAudioConfig);
			})
			.on('pointerout', () => button.setStyle({ backgroundColor: '#111' }));
		this.textOptions.add(button)
	}

	// load textbox options from room
	loadOptions(room) {
		let x = 100
		let y = 100
		if (room.type === Room.COMBAT_TYPE) {
			this.makeTextbox(x,y,"attack enemy", this.attackEnemyOption.bind(this))
			y += 25
		}
		this.makeTextbox(x,y,"Go to Map", this.goToMap.bind(this))
		y += 25;

		for (let option in room.options) {
			this.makeTextbox(x,y,option.text, option.func)
			y += 25;
		}
	}

	attackEnemyOption(button) {

	}

	// test use case for function passed into makeTextbox
	goToMap(button) {
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
		this.textOptions = []

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

		this.add.sprite(0,0, 'tv_image')

		this.cameras.main.setSize(300, 200);

		this.roomText = this.add.text(25,25,`ROOM: ${this.currRoom}`)

		// .bind(this) is CRUCIAL for nested function calls, otherwise context will be the button instead of game_window
		this.loadOptions(Room.maps.map1.rooms.r1)
	}
}

