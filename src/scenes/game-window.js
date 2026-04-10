class GameWindow extends Phaser.Scene {
	constructor() {
		super("game-window_scene");
	}
	preload() {
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
				this.sound.play('textbox_click', this.buttonAudioConfig);
			})
			.on('pointerover', () => {
				button.setStyle({ backgroundColor: '#f39c12' });
				this.sound.play('textbox_hover', this.buttonAudioConfig);
			})
			.on('pointerout', () => button.setStyle({ backgroundColor: '#111' }));
	}

	// test use case for function passed into makeTextbox
	fart(button) {
		button.setStyle({ backgroundColor: '#FFF' })
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

		this.makeTextbox(100,100,"hello i am under the water please help me", this.fart)
		this.makeTextbox(100,125,"aaaaaaaaaaaaaaa", this.fart)
		this.makeTextbox(100,150,"pee pee poo poo", this.fart)

		this.cameras.main.setSize(300, 200);
	}
}

