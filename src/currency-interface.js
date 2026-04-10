class CurrencyInterface extends Phaser.EventEmitter {
	constructor(scene) {
		super(scene);
	}

	create() {
		this.account_balance = 100.0;
	}

	money_earn(amount) {
		this.account_balance += amount;
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

