class Desktop extends Phaser.Scene {
	constructor() {
		super("desktop_scene")
	}

	create() {
		this.currency_interface = new CurrencyInterface(this);

		this.scene.launch("email-window_scene");
		this.scene.launch("game-window_scene");

		this.scene.get("email-window_scene").events.on("sort-correct", () => {
			this.currency_interface.money_earn(5.0); // TODO factor amount into config
		});

		this.currency_interface.on("money-spend_fail", (expense) => {});
		this.currency_interface.on("money-spend_success", (expense) => {});
	}
}

