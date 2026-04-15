class UiOverlay extends Phaser.Scene {
	constructor() {
		super("ui-overlay_scene");

		this.initialized = false;
		this.controlsBound = false;
		this.lifecycleBound = false;
		this.defaultUiState = {
			health: 5,
			level: 1,
			selectedSlot: 0,
			pauseOpen: true,
			optionsOpen: false,
			exited: false,
			volume: 1,
		};
	}

	preload() {
		if (!this.textures.exists("ui-level-border")) {
			this.load.image("ui-level-border", "assets/images/Level Border.png");
		}
		if (!this.textures.exists("ui-pause-menu")) {
			this.load.image("ui-pause-menu", "assets/images/Play-Options-Exit.png");
		}
		if (!this.textures.exists("ui-inventory")) {
			this.load.image("ui-inventory", "assets/images/inventory.png");
		}
		if (!this.textures.exists("ui-health-bar")) {
			this.load.image("ui-health-bar", "assets/Hearts/PNG/health_bar/health_bar.png");
		}
		if (!this.textures.exists("ui-health-decoration")) {
			this.load.image("ui-health-decoration", "assets/Hearts/PNG/health_bar/health_bar_decoration.png");
		}
		if (!this.textures.exists("ui-heart-empty")) {
			this.load.image("ui-heart-empty", "assets/Hearts/PNG/basic/background.png");
		}
		if (!this.textures.exists("ui-heart-border")) {
			this.load.image("ui-heart-border", "assets/Hearts/PNG/basic/border.png");
		}
		if (!this.textures.exists("ui-heart-full")) {
			this.load.spritesheet("ui-heart-full", "assets/Hearts/PNG/animated/border/heart_animated_1.png", {
				frameWidth: 17,
				frameHeight: 17,
			});
		}
	}

	create() {
		if (!this.lifecycleBound) {
			this.events.on("shutdown", this.handleShutdown, this);
			this.events.on("destroy", this.handleDestroy, this);
			this.lifecycleBound = true;
		}

		if (this.initialized) {
			this.restoreUi();
			return;
		}

		this.uiState = {
			...this.defaultUiState,
			...this.uiState,
		};
		this.uiElements = [];
		this.pauseButtonHitAreas = [];
		this.slotHighlights = [];
		this.healthIcons = [];

		this.cameras.main.setBackgroundColor("#000000");

		try {
			this.buildHud();
			this.buildInventory();
			this.buildPauseMenu();
			this.bindControls();
			this.syncGameplayPause();
			this.initialized = true;
		} catch (error) {
			console.error("ui-overlay_scene failed to initialize", error);
			this.add.text(320, 438, "UI overlay failed to load", {
				fontFamily: "Courier New",
				fontSize: "14px",
				color: "#f6d7a7",
				backgroundColor: "#231a36",
				padding: { left: 8, right: 8, top: 4, bottom: 4 },
			}).setOrigin(0.5).setScrollFactor(0);
		}
	}

	restoreUi() {
		this.uiState = {
			...this.defaultUiState,
			...this.uiState,
		};

		this.refreshHealth();
		this.refreshInventorySelection();
		this.setPauseVisible(this.uiState.pauseOpen);
		this.setVolume(this.uiState.volume ?? this.sound.volume ?? 1);
		this.syncGameplayPause();
	}

	hasTexture(key) {
		return this.textures.exists(key) && key !== "__MISSING";
	}

	buildHud() {
		if (this.hasTexture("ui-health-bar") && this.hasTexture("ui-health-decoration")) {
			this.buildHealthBar(30, 24);
		}

		if (this.hasTexture("ui-level-border")) {
			this.levelFrame = this.add.image(552, 50, "ui-level-border")
				.setDisplaySize(128, 56)
				.setScrollFactor(0);
			this.uiElements.push(this.levelFrame);
		}

		this.levelLabel = this.add.text(552, 50, "LEVEL 1", {
			fontFamily: "Courier New",
			fontSize: "20px",
			color: "#5b4636",
			fontStyle: "bold",
		})
			.setOrigin(0.5)
			.setScrollFactor(0);
		this.uiElements.push(this.levelLabel);

		this.helpText = this.add.text(320, 438, "W/S: cycle slot   R: pause menu   Q/E: change health", {
			fontFamily: "Courier New",
			fontSize: "14px",
			color: "#f6d7a7",
			backgroundColor: "#231a36",
			padding: { left: 8, right: 8, top: 4, bottom: 4 },
		})
			.setOrigin(0.5)
			.setScrollFactor(0);
		this.uiElements.push(this.helpText);
	}

	buildHealthBar(x, y) {
		if (!this.hasTexture("ui-heart-full")) {
			return;
		}

		if (!this.anims.exists("ui-heart-pulse")) {
			this.anims.create({
				key: "ui-heart-pulse",
				frames: this.anims.generateFrameNumbers("ui-heart-full", { start: 0, end: 4 }),
				frameRate: 8,
				repeat: -1,
				yoyo: true,
			});
		}

		this.healthBar = this.add.image(x, y, "ui-health-bar")
			.setOrigin(0, 0)
			.setScrollFactor(0);
		this.uiElements.push(this.healthBar);

		this.healthBarDecoration = this.add.image(x, y, "ui-health-decoration")
			.setOrigin(0, 0)
			.setScrollFactor(0);
		this.uiElements.push(this.healthBarDecoration);

		this.maxHealth = 5;
		this.healthIcons = [];
		const heartStartX = this.healthBarDecoration.x + 14;
		const heartY = this.healthBarDecoration.y;

		for (let i = 0; i < this.maxHealth; i += 1) {
			const slotX = heartStartX + i * 10;
			const emptyHeart = this.add.image(slotX, heartY, "ui-heart-empty")
				.setOrigin(0, 0)
				.setScrollFactor(0);
			this.uiElements.push(emptyHeart);

			const fullHeart = this.add.sprite(slotX, heartY, "ui-heart-full", 0)
				.setOrigin(0, 0)
				.setScrollFactor(0)
				.play("ui-heart-pulse");
			this.uiElements.push(fullHeart);

			const borderHeart = this.add.image(slotX, heartY, "ui-heart-border")
				.setOrigin(0, 0)
				.setScrollFactor(0);
			this.uiElements.push(borderHeart);

			this.healthIcons.push({
				emptyHeart,
				fullHeart,
				borderHeart,
			});
		}

		this.refreshHealth();
	}

	buildInventory() {
		if (!this.hasTexture("ui-inventory")) {
			return;
		}

		this.inventory = this.add.image(553, 360, "ui-inventory")
			.setDisplaySize(160, 160)
			.setScrollFactor(0);
		this.uiElements.push(this.inventory);

		this.inventoryTitle = this.add.text(553, 311, " ", {
			fontFamily: "Courier New",
			fontSize: "22px",
			color: "#4d3c37",
			fontStyle: "bold",
		})
			.setOrigin(0.5)
			.setScrollFactor(0);
		this.uiElements.push(this.inventoryTitle);

		this.slotHighlights = [];
		const assetSize = 1080;
		const slotCenters = [
			{ x: 335.5, y: 512.5 },
			{ x: 463.5, y: 512.5 },
			{ x: 591.5, y: 512.5 },
			{ x: 719.5, y: 512.5 },
			{ x: 335.5, y: 640.5 },
			{ x: 463.5, y: 640.5 },
			{ x: 591.5, y: 640.5 },
			{ x: 719.5, y: 640.5 },
		];
		const slotHighlightSize = (124 / assetSize) * this.inventory.displayWidth;
		const inventoryLeft = this.inventory.x - this.inventory.displayWidth / 2;
		const inventoryTop = this.inventory.y - this.inventory.displayHeight / 2;

		slotCenters.forEach((slotCenter, index) => {
			const slotX = inventoryLeft + (slotCenter.x / assetSize) * this.inventory.displayWidth;
			const slotY = inventoryTop + (slotCenter.y / assetSize) * this.inventory.displayHeight;
			const slot = this.add.rectangle(slotX, slotY, slotHighlightSize, slotHighlightSize)
					.setStrokeStyle(2, 0xf7cf78, index === this.uiState.selectedSlot ? 1 : 0)
					.setFillStyle(0x000000, 0)
					.setScrollFactor(0);

			this.slotHighlights.push(slot);
			this.uiElements.push(slot);
		});
	}

	buildPauseMenu() {
		if (!this.hasTexture("ui-pause-menu")) {
			return;
		}

		this.pauseMenu = this.add.image(320, 240, "ui-pause-menu")
			.setDisplaySize(182, 242)
			.setScrollFactor(0)
			.setDepth(20);

		this.pauseHint = this.add.text(320, 374, "PAUSED", {
			fontFamily: "Courier New",
			fontSize: "13px",
			color: "#f2ded4",
		})
			.setOrigin(0.5)
			.setScrollFactor(0)
			.setDepth(20);

		this.pauseButtonHitAreas = [];
		const menuAssetSize = 1080;
		const menuLeft = this.pauseMenu.x - this.pauseMenu.displayWidth / 2;
		const menuTop = this.pauseMenu.y - this.pauseMenu.displayHeight / 2;
		const buttonSpecs = [
			{ key: "play", x: 524, y: 416, width: 210, height: 90, onClick: () => this.resumeGame() },
			{ key: "options", x: 524, y: 527, width: 220, height: 92, onClick: () => this.toggleOptionsMenu() },
			{ key: "exit", x: 524, y: 632, width: 210, height: 90, onClick: () => this.exitGame() },
		];

		buttonSpecs.forEach((button) => {
			const hitArea = this.add.rectangle(
				menuLeft + (button.x / menuAssetSize) * this.pauseMenu.displayWidth,
				menuTop + (button.y / menuAssetSize) * this.pauseMenu.displayHeight,
				(button.width / menuAssetSize) * this.pauseMenu.displayWidth,
				(button.height / menuAssetSize) * this.pauseMenu.displayHeight,
			)
				.setScrollFactor(0)
				.setDepth(21)
				.setFillStyle(0xffffff, 0.001)
				.setStrokeStyle(2, 0xf6d7a7, 0)
				.setInteractive({ useHandCursor: true })
				.on("pointerover", () => {
					if (this.uiState.pauseOpen && !this.uiState.exited) {
						hitArea.setStrokeStyle(2, 0xf6d7a7, 0.85);
					}
				})
				.on("pointerout", () => {
					hitArea.setStrokeStyle(2, 0xf6d7a7, 0);
				})
				.on("pointerup", () => {
					if (this.uiState.pauseOpen && !this.uiState.exited) {
						button.onClick();
					}
				});

			this.pauseButtonHitAreas.push(hitArea);
		});

		this.buildOptionsMenu();

		this.setPauseVisible(this.uiState.pauseOpen);
	}

	buildOptionsMenu() {
		this.optionsBackdrop = this.add.rectangle(320, 240, 206, 118, 0x1c1543, 0.97)
			.setScrollFactor(0)
			.setDepth(30)
			.setStrokeStyle(3, 0xf6d7a7, 1);
		this.optionsTitle = this.add.text(320, 198, "VOLUME", {
			fontFamily: "Courier New",
			fontSize: "16px",
			color: "#f6d7a7",
			fontStyle: "bold",
		})
			.setOrigin(0.5)
			.setScrollFactor(0)
			.setDepth(31);
		this.volumeValueText = this.add.text(320, 254, "100%", {
			fontFamily: "Courier New",
			fontSize: "14px",
			color: "#f2ded4",
		})
			.setOrigin(0.5)
			.setScrollFactor(0)
			.setDepth(31);
		this.volumeTrack = this.add.rectangle(320, 226, 120, 8, 0x4d3c37, 1)
			.setScrollFactor(0)
			.setDepth(31)
			.setInteractive({ useHandCursor: true });
		this.volumeFill = this.add.rectangle(260, 226, 120, 8, 0xf7cf78, 1)
			.setOrigin(0, 0.5)
			.setScrollFactor(0)
			.setDepth(32);
		this.volumeKnob = this.add.circle(380, 226, 9, 0xf6d7a7, 1)
			.setScrollFactor(0)
			.setDepth(33)
			.setStrokeStyle(2, 0x4d3c37, 1)
			.setInteractive({ draggable: true, useHandCursor: true });
		this.optionsCloseHint = this.add.text(320, 278, "Click Options again to close", {
			fontFamily: "Courier New",
			fontSize: "10px",
			color: "#cdb7aa",
		})
			.setOrigin(0.5)
			.setScrollFactor(0)
			.setDepth(31);

		this.input.setDraggable(this.volumeKnob);
		this.handleVolumeDrag = (pointer, gameObject, dragX) => {
			if (gameObject !== this.volumeKnob || !this.uiState.optionsOpen || !this.uiState.pauseOpen) {
				return;
			}

			const clampedX = Phaser.Math.Clamp(dragX, this.volumeTrack.x - this.volumeTrack.width / 2, this.volumeTrack.x + this.volumeTrack.width / 2);
			const volume = Phaser.Math.Clamp((clampedX - (this.volumeTrack.x - this.volumeTrack.width / 2)) / this.volumeTrack.width, 0, 1);
			this.setVolume(volume);
		};
		this.input.on("drag", this.handleVolumeDrag);

		this.volumeTrack.on("pointerdown", (pointer) => {
			if (!this.uiState.optionsOpen || !this.uiState.pauseOpen) {
				return;
			}

			const volume = Phaser.Math.Clamp((pointer.x - (this.volumeTrack.x - this.volumeTrack.width / 2)) / this.volumeTrack.width, 0, 1);
			this.setVolume(volume);
		});

		this.setVolume(this.sound.volume ?? 1);
		this.setOptionsVisible(false);
	}

	bindControls() {
		if (this.controlsBound) {
			return;
		}

		this.handlePauseToggle = () => {
			if (this.uiState.exited) {
				return;
			}

			this.uiState.pauseOpen = !this.uiState.pauseOpen;
			if (!this.uiState.pauseOpen) {
				this.uiState.optionsOpen = false;
				this.setOptionsVisible(false);
			}
			this.setPauseVisible(this.uiState.pauseOpen);
			this.syncGameplayPause();
		};

		this.handleSlotUp = () => {
			if (!this.slotHighlights || this.slotHighlights.length === 0) {
				return;
			}

			this.uiState.selectedSlot = Phaser.Math.Wrap(this.uiState.selectedSlot - 1, 0, this.slotHighlights.length);
			this.refreshInventorySelection();
		};

		this.handleSlotDown = () => {
			if (!this.slotHighlights || this.slotHighlights.length === 0) {
				return;
			}

			this.uiState.selectedSlot = Phaser.Math.Wrap(this.uiState.selectedSlot + 1, 0, this.slotHighlights.length);
			this.refreshInventorySelection();
		};

		this.handleHealthDown = () => {
			this.uiState.health = Phaser.Math.Clamp(this.uiState.health - 1, 0, this.maxHealth);
			this.refreshHealth();
		};

		this.handleHealthUp = () => {
			this.uiState.health = Phaser.Math.Clamp(this.uiState.health + 1, 0, this.maxHealth);
			this.refreshHealth();
		};

		this.input.keyboard.on("keydown-R", this.handlePauseToggle);
		this.input.keyboard.on("keydown-W", this.handleSlotUp);
		this.input.keyboard.on("keydown-S", this.handleSlotDown);
		this.input.keyboard.on("keydown-Q", this.handleHealthDown);
		this.input.keyboard.on("keydown-E", this.handleHealthUp);
		this.controlsBound = true;
	}

	refreshInventorySelection() {
		if (!this.slotHighlights) {
			return;
		}

		this.slotHighlights.forEach((slot, index) => {
			slot.setStrokeStyle(2, 0xf7cf78, index === this.uiState.selectedSlot ? 1 : 0);
		});
	}

	refreshHealth() {
		if (!this.healthIcons) {
			return;
		}

		this.healthIcons.forEach((heart, index) => {
			heart.fullHeart.setVisible(index < this.uiState.health);
		});
	}

	setPauseVisible(isVisible) {
		if (!this.pauseMenu || !this.pauseHint) {
			return;
		}

		this.pauseMenu.setVisible(isVisible);
		this.pauseHint.setVisible(isVisible);
		if (this.pauseButtonHitAreas) {
			this.pauseButtonHitAreas.forEach((hitArea) => {
				hitArea.setVisible(isVisible);
				hitArea.input.enabled = isVisible;
				hitArea.setStrokeStyle(2, 0xf6d7a7, 0);
			});
		}
		this.setOptionsVisible(isVisible && this.uiState.optionsOpen);
	}

	setOptionsVisible(isVisible) {
		const optionsElements = [
			this.optionsBackdrop,
			this.optionsTitle,
			this.volumeValueText,
			this.volumeTrack,
			this.volumeFill,
			this.volumeKnob,
			this.optionsCloseHint,
		];
		optionsElements.forEach((element) => {
			if (!element) {
				return;
			}
			element.setVisible(isVisible);
			if (element.input) {
				element.input.enabled = isVisible;
			}
		});
	}

	toggleOptionsMenu() {
		this.uiState.optionsOpen = !this.uiState.optionsOpen;
		this.setOptionsVisible(this.uiState.optionsOpen && this.uiState.pauseOpen);
	}

	resumeGame() {
		this.uiState.pauseOpen = false;
		this.uiState.optionsOpen = false;
		this.setPauseVisible(false);
		this.syncGameplayPause();
	}

	setVolume(volume) {
		const safeVolume = Phaser.Math.Clamp(volume, 0, 1);
		this.uiState.volume = safeVolume;
		this.sound.volume = safeVolume;

		if (!this.volumeTrack || !this.volumeKnob || !this.volumeFill || !this.volumeValueText) {
			return;
		}

		const trackLeft = this.volumeTrack.x - this.volumeTrack.width / 2;
		this.volumeKnob.x = trackLeft + this.volumeTrack.width * safeVolume;
		this.volumeFill.width = this.volumeTrack.width * safeVolume;
		this.volumeValueText.setText(`${Math.round(safeVolume * 100)}%`);
	}

	syncGameplayPause() {
		const shouldPause = this.uiState.pauseOpen && !this.uiState.exited;
		const innerScene = this.scene.get("inner-game_scene");
		if (innerScene) {
			if (shouldPause && !this.scene.isPaused("inner-game_scene")) {
				this.scene.pause("inner-game_scene");
			}
			if (!shouldPause && this.scene.isPaused("inner-game_scene")) {
				this.scene.resume("inner-game_scene");
			}
		}
	}

	exitGame() {
		this.uiState.exited = true;
		this.uiState.pauseOpen = false;
		this.uiState.optionsOpen = false;
		this.setPauseVisible(false);

		this.scene.stop("inner-game_scene");


		this.uiElements.forEach((element) => {
			if (element) {
				element.setVisible(false);
			}
		});

		if (this.exitOverlay) {
			this.exitOverlay.destroy();
		}

		this.exitOverlay = this.add.rectangle(320, 240, 640, 480, 0x000000, 1)
			.setScrollFactor(0)
			.setDepth(100);
	}

	handleShutdown() {
		if (this.controlsBound && this.input && this.input.keyboard) {
			this.input.keyboard.off("keydown-R", this.handlePauseToggle);
			this.input.keyboard.off("keydown-W", this.handleSlotUp);
			this.input.keyboard.off("keydown-S", this.handleSlotDown);
			this.input.keyboard.off("keydown-Q", this.handleHealthDown);
			this.input.keyboard.off("keydown-E", this.handleHealthUp);
		}
		if (this.handleVolumeDrag && this.input) {
			this.input.off("drag", this.handleVolumeDrag);
		}

		this.controlsBound = false;
		this.initialized = false;
	}

	handleDestroy() {
		this.handleShutdown();

		if (this.lifecycleBound) {
			this.events.off("shutdown", this.handleShutdown, this);
			this.events.off("destroy", this.handleDestroy, this);
			this.lifecycleBound = false;
		}
	}
}