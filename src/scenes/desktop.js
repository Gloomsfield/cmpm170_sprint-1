class Desktop extends Phaser.Scene {
	constructor() {
		super("desktop_scene")
	}

	create() {
		this.currency_interface = new CurrencyInterface(this);

		this.scene.launch("email-window_scene");
		this.scene.launch("game-window_scene");
		this.scene.launch("bank-window_scene", this.currency_interface.account_balance);

		this.email_scene = this.scene.get("email-window_scene");
		this.game_scene = this.scene.get("game-window_scene");
		this.bank_scene = this.scene.get("bank-window_scene");

		this.scene.get("email-window_scene").events.on("sort-correct", () => {
			// TODO - factor amount into config
			this.bank_scene.balance_text_update(this.currency_interface.money_earn(5.0));
		});

		this.currency_interface.on("money-spend_fail", (expense) => {});
		this.currency_interface.on("money-spend_success", (expense) => {});
	}
}

