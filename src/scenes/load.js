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

		this.load.path = "./assets/0x72_DungeonTilesetII_v1.7/";
		this.load.image("dungeon_walls_tiles", "atlas_walls_high-16x32.png");

		this.load.path = "./assets/0x72_DungeonTilesetII_v1.7/frames/";
		this.load.image("pumpkin_dude_idle", "pumpkin_dude_idle_anim_f1.png");

		this.load.path = "./assets/maps/";
		this.load.tilemapTiledJSON("map1", "Split 1 Map 1.tmj");

		this.load.path = "./assets/fonts/"
		this.load.bitmapFont(
			"roboto_font",
			"roboto/roboto.png",
			"roboto/roboto.xml"
		);
	}
}
