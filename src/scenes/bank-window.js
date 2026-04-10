class BankWindow extends Phaser.Scene {
	constructor() {
		super("bank-window_scene");
	}

	create(starting_balance) {
		this.cameras.main.setBackgroundColor(0xff0000);
		this.cameras.main.setSize(240.0, 180.0);
		this.cameras.main.setPosition(350.0, 65.0);

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

