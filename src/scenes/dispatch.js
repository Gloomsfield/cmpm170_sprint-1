class Dispatch extends Phaser.Scene {
	constructor() {
		super("dispatch_scene")
	}

	create() {
		this.scene.launch("load_scene");
		this.scene.get("load_scene").load.once("complete", () => {
			this.scene.stop("load_scene");
			this.scene.launch("outer-game_scene");
		});
	}
}

