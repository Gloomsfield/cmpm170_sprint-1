class DungeonMap extends Phaser.Scene {
	constructor() {
		super("dungeon-map_scene");
	}

	init(data) {
		this.currMap = data.mapKey || "map1";
		this.spawnName = data.spawnName || "spawn_r1";
		this.fromRoom = data.fromRoom || null;
		this.triggerLocked = false;
	}

	create() {
		this.createMap();
		this.createPlayer();
		this.createCamera();
		this.createControls();
		this.createAnimations();
		this.createTriggers();
	}

	createMap() {
		this.map = this.make.tilemap({ key: this.currMap });

        this.cameras.main.setSize(620.0, 560.0);
        this.cameras.main.setPosition(20.0, 20.0);

        this.add.sprite(0, 0, 'tv_image').setOrigin(0, 0);

        this.tileset = this.map.addTilesetImage("MicroGameTest", "dungeon_tiles");

        this.groundLayer = this.map.createLayer("Background", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("Tile Layer 1", this.tileset, 0, 0);

        this.wallLayer.setCollisionByProperty({ collides: true });

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        console.log("currMap key:", this.currMap);
        console.log("all object layers:", this.map.objects.map(layer => layer.name));
    }

	createPlayer() {
		const spawn = this.findSpawnPoint(this.spawnName);

		this.player = this.physics.add.sprite(
			spawn.x,
			spawn.y,
			"player_spritesheet",
			0
		);

		this.player.setCollideWorldBounds(true);

		this.player.body.setSize(10, 12);
		this.player.body.setOffset(3, 4);

		this.physics.add.collider(this.player, this.wallLayer);
	}

	createCamera() {
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(this.player, true);
		this.cameras.main.setZoom(2);
	}

	createControls() {
		KEY_UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		KEY_DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		KEY_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		KEY_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		KEY_MENU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

		this.cursors = this.input.keyboard.createCursorKeys();
	}

	createAnimations() {
		// Only create once
		if (this.anims.exists("walk-down")) return;

		this.anims.create({
			key: "walk-down",
			frames: this.anims.generateFrameNumbers("player_spritesheet", { start: 0, end: 3 }),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: "walk-left",
			frames: this.anims.generateFrameNumbers("player_spritesheet", { start: 4, end: 7 }),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: "walk-right",
			frames: this.anims.generateFrameNumbers("player_spritesheet", { start: 8, end: 11 }),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: "walk-up",
			frames: this.anims.generateFrameNumbers("player_spritesheet", { start: 12, end: 15 }),
			frameRate: 8,
			repeat: -1
		});
	}

	createTriggers() {
        this.triggerZones = this.physics.add.staticGroup();

        const layer = this.map.getObjectLayer("Triggers");
        console.log("Triggers layer:", layer);

        if (!layer) {
            console.warn("No object layer named 'Triggers' found.");
            return;
        }

        layer.objects.forEach((obj) => {
            const props = this.propertiesArrayToObject(obj.properties || []);

            const zone = this.add.zone(
                obj.x + obj.width / 2,
                obj.y + obj.height / 2,
                obj.width,
                obj.height
            );

            this.physics.add.existing(zone, true);

            zone.name = obj.name || props.name || "";
            zone.triggerData = props;
            zone.triggerType = obj.type || props.type || "room";

            console.log("Trigger created:", zone.name, zone.triggerType, zone.triggerData);

            this.triggerZones.add(zone);
        });

        this.physics.add.overlap(
            this.player,
            this.triggerZones,
            this.handleTrigger,
            null,
            this
        );
    }

	findSpawnPoint(spawnName) {
		const layer = this.map.getObjectLayer("Spawns");
		if (!layer) {
			console.warn("No object layer named 'Spawns' found. Using fallback.");
			return { x: 32, y: 32 };
		}

		const spawn = layer.objects.find(obj => obj.name === spawnName);

		if (!spawn) {
			console.warn(`Spawn '${spawnName}' not found. Using fallback.`);
			return { x: 32, y: 32 };
		}

		return { x: spawn.x, y: spawn.y };
	}

	propertiesArrayToObject(propsArray) {
		let obj = {};

		propsArray.forEach((prop) => {
			obj[prop.name] = prop.value;
		});

		return obj;
	}

	handleTrigger(player, zone) {
        console.log("hit trigger:", zone.name, zone.triggerType, zone.triggerData);

        if (this.triggerLocked) return;
        this.triggerLocked = true;

        this.time.delayedCall(250, () => {
            this.triggerLocked = false;
        });

        const data = zone.triggerData || {};

        if (zone.triggerType === "room") {
            this.scene.start("game-window_scene", {
                mapKey: this.currMap,
                roomId: data.roomId,
                returnSpawn: data.returnSpawn || this.spawnName
            });
        }
        else if (zone.triggerType === "enemy") {
            this.scene.start("game-window_scene", {
                mapKey: this.currMap,
                roomId: data.roomId,
                enemyId: data.enemyId,
                returnSpawn: data.returnSpawn || this.spawnName
            });
        }
        else if (zone.triggerType === "exit") {
            this.scene.start("dungeon-map_scene", {
                mapKey: data.targetMap,
                spawnName: data.targetSpawn
            });
        }
        else if (zone.triggerType === "microtrans") {
            this.scene.start("game-window_scene", {
                mapKey: this.currMap,
                returnSpawn: data.returnSpawn || this.spawnName,
                fromMap: true,
                triggerName: zone.name,
                triggerType: zone.triggerType
            });
        }
    }

	update() {
		const speed = 80;
		let vx = 0;
		let vy = 0;

		if (KEY_LEFT.isDown || this.cursors.left.isDown) {
			vx = -speed;
		}
		else if (KEY_RIGHT.isDown || this.cursors.right.isDown) {
			vx = speed;
		}

		if (KEY_UP.isDown || this.cursors.up.isDown) {
			vy = -speed;
		}
		else if (KEY_DOWN.isDown || this.cursors.down.isDown) {
			vy = speed;
		}

		this.player.setVelocity(vx, vy);

		// Prevent diagonal movement being faster
		this.player.body.velocity.normalize().scale(speed);

		if (vx < 0) {
			this.player.anims.play("walk-left", true);
		}
		else if (vx > 0) {
			this.player.anims.play("walk-right", true);
		}
		else if (vy < 0) {
			this.player.anims.play("walk-up", true);
		}
		else if (vy > 0) {
			this.player.anims.play("walk-down", true);
		}
		else {
			this.player.anims.stop();
		}
	}
}