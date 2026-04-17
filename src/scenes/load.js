class Load extends Phaser.Scene {
	constructor() {
		super("load_scene");
	}

	preload() {
		this.load.once("complete", () => { this.scene.start("desktop_scene"); });

		this.load.path = "./assets/sounds/";
		this.load.audio("textbox-hover_sound", "textbox-hover.mp3");
		this.load.audio("textbox-click_sound", "textbox-click.mp3");

		this.load.path = "./assets/images/";
		this.load.image("inventory_image", "inventory.png");
		this.load.image("pause-menu_image", "pause-menu.png");
		this.load.image("level-border_image", "level-border.png");
		this.load.image("tv_image", "tv.png");

		this.load.spritesheet("player_spritesheet", "player.png", { frameWidth: 16, frameHeight: 16, });

		this.load.image("dungeon_tiles", "FieldsTileset.png");

		this.load.path = "./assets/maps/";
		this.load.tilemapTiledJSON("map1", "MicroGameTestMap.json");

		this.load.path = "./assets/fonts/"
		this.load.bitmapFont(
			"roboto_font",
			"roboto/roboto.png",
			"roboto/roboto.xml"
		);
	}
}

