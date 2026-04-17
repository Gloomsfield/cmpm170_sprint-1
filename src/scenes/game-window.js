class GameWindow extends Phaser.Scene {
	constructor() {
		super("game-window_scene");
	}

	init(data) {
		this.currMap = data.mapKey || "map1";
		this.currRoom = data.roomId || "r1";
		this.returnSpawn = data.returnSpawn || "spawn_r1";

		this.fromMap = data.fromMap || false;
		this.triggerName = data.triggerName || null;
		this.triggerType = data.triggerType || null;
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
		this.textOptions.push(button)
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

		this.scene.start("dungeon-map_scene", {
		mapKey: this.currMap,
		spawnName: "spawn_start"
		});
		/*
		this.currRoom = 'r2'
		this.roomText.setText(`ROOM: ${this.currRoom}`)
		*/
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

		this.cameras.main.setSize(620.0, 560.0);
		this.cameras.main.setPosition(20.0, 20.0);

		if (this.triggerType === "microtrans") {

			this.makeTextbox(100, 150, "Buy Microtransaction", this.buyMicrotransaction.bind(this));
		}

		this.roomText = this.add.text(25,25,`ROOM: ${this.currRoom}`)

		// .bind(this) is CRUCIAL for nested function calls, otherwise context will be the button instead of game_window
		this.loadOptions(Room.maps.map1.rooms.r1)
	}

	buyMicrotransaction(button) {
		button.setStyle({ backgroundColor: '#FFF' });
		console.log("Microtransaction purchase clicked.");
	}

	returnToMap(button) {
		button.setStyle({ backgroundColor: '#FFF' });

		this.scene.start("dungeon-map_scene", {
			mapKey: this.currMap,
			spawnName: this.returnSpawn
		});
	}
}

