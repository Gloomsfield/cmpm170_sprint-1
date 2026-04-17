class EmailWindow extends Phaser.Scene {
    constructor() {
        super("email-window_scene");
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.cameras.main.setSize(340.0, 280.0);
        this.cameras.main.setPosition(650.0, 310.0);

		this.add.bitmapText(5.0, 220.0, "roboto_font", "◀ NOT IMPORTANT", 10.0);
		this.add.bitmapText(210.0, 220.0, "roboto_font", "IMPORTANT ▶", 10.0);

		this.add.rectangle(80.0, 228.0, 150.0, 20.0).setStrokeStyle(1, 0x000000).setFillStyle();
		this.add.rectangle(255.0, 228.0, 120.0, 20.0).setStrokeStyle(1, 0x000000).setFillStyle();

        this.loadingText = this.add.bitmapText(100.0, 130.0, "roboto_font", "Generating email...", 10.0);

        this.spawnEmail();
    }

    spawnEmail() {
        this.loadingText.setVisible(true);

        if (this.currentEmail) { this.currentEmail.destroy(); this.currentEmail = null; }

        const email = new Email(this);
        this.currentEmail = email;

        email.on("email-loaded", () => { this.loadingText.setVisible(false); });
        email.on("sort-correct", () => { this.events.emit("sort-correct"); this.spawnEmail(); });
        email.on("sort-incorrect", () => { this.events.emit("sort-incorrect"); this.spawnEmail(); });
    }
}