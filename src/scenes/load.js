class Load extends Phaser.Scene {
	constructor() {
		super("load_scene");
	}

	preload() {
		this.load.once("complete", () => { this.scene.start("desktop_scene"); });

		this.load.path = "./assets/sounds/";
		this.load.audio("textbox_hover", "textbox_hover.mp3");
		this.load.audio("textbox_click", "textbox_click.mp3");

		this.load.path = "./assets/images/";
		this.load.image("inventory", "inventory.png");
		this.load.image("pausemenu", "Play-Options-Exit.png");
		this.load.image("levelborder", "LevelBorder.png");
		this.load.image("tv", "outergametv.png");

		this.load.spritesheet("rogueplayer", "doc.png", { frameWidth: 16, frameHeight: 16, });

		this.load.path = "./assets/fonts/"
		this.load.bitmapFont(
			"roboto_font",
			"roboto/roboto.png",
			"roboto/roboto.xml"
		);
	}
}

