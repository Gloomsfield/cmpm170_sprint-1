class CurrencyInterface extends Phaser.GameObjects.GameObject {
	constructor(scene) {
		super(scene);

		scene.add.existing(this);

		this.account_balance = 100.0;
	}

	money_earn(amount) {
		this.account_balance += amount;
		console.log(`money earned: ${amount}`);
	}

	money_spend(amount, expense) {
		if(amount > this.account_balance) {
			this.emit("money-spend_fail", expense);

			return false;
		}

		this.account_balance -= amount;

		this.emit("money-spend_success", expense);

		return true;
	}
}

