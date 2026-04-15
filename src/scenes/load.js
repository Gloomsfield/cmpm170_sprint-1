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

		this.load.image("ui-level-border", "assets/images/Level Border.png");
		this.load.image("ui-pause-menu", "assets/images/Play-Options-Exit.png");
		this.load.image("ui-inventory", "assets/images/inventory.png");
		this.load.image("ui-health-bar", "assets/Hearts/PNG/health_bar/health_bar.png");
		this.load.image("ui-health-decoration", "assets/Hearts/PNG/health_bar/health_bar_decoration.png");
		this.load.image("ui-heart-empty", "assets/Hearts/PNG/basic/background.png");
		this.load.image("ui-heart-border", "assets/Hearts/PNG/basic/border.png");

		this.load.spritesheet("ui-heart-full", "assets/Hearts/PNG/animated/border/heart_animated_1.png", {
			frameWidth: 17,
			frameHeight: 17,
		});

		this.load.spritesheet("player_spritesheet", "player.png", { frameWidth: 16, frameHeight: 16, });

		this.load.path = "./assets/fonts/"
		this.load.bitmapFont(
			"roboto_font",
			"roboto/roboto.png",
			"roboto/roboto.xml"
		);
	}
}

