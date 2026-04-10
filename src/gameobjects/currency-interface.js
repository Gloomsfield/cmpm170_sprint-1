class CurrencyInterface extends Phaser.GameObjects.GameObject {
	constructor(scene) {
		super(scene);

		scene.add.existing(this);

		this.account_balance = 100.0;
	}

	// returns the new balance
	money_earn(amount) {
		this.account_balance += amount;

		return this.account_balance;
	}

	// returns the new balance
	money_spend(amount, expense) {
		if(amount > this.account_balance) {
			this.emit("money-spend_fail", expense);

			return this.account_balance;
		}

		this.account_balance -= amount;

		this.emit("money-spend_success", expense);

		return this.account_balance;
	}
}

