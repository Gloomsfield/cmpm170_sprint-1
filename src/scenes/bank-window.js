class BankWindow extends Phaser.Scene {
	constructor() {
		super("bank-window_scene");
	}

	create(starting_balance) {
		this.cameras.main.setBackgroundColor(0xff0000);
		this.cameras.main.setSize(340.0, 280.0);
		this.cameras.main.setPosition(650.0, 20.0);

		this.add.bitmapText(
			5.0, 5.0,
			"roboto_font",
			"BANK",
			32.0
		);

		this.balance_text = this.add.bitmapText(
			5.0, 43.0,
			"roboto_font",
			"",
			20.0
		);

		this.balance_text_update(starting_balance);
	}

	balance_text_update(new_balance) {
		this.balance_text.text = `Current Balance: $${new_balance}`;
	}
}

