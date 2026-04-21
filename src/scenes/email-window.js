class EmailWindow extends Phaser.Scene {
    constructor() {
        super("email-window_scene");
    }

    create() {
        this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');
        this.cameras.main.setSize(340.0, 280.0);
        this.cameras.main.setPosition(635.0, 150.0);

        this.add.rectangle(170.0, 140.0, 340.0, 280.0)
            .setStrokeStyle(1, 0x888888)
            .setFillStyle(0x3c3c3c);

        this.add.rectangle(170.0, 12.0, 340.0, 24.0, 0x202020);

        this.add.text(8.0, 4.0, "Gmail", {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
        });

        this.add.text(270.0, 4.0, "—", { fontFamily: 'Arial', fontSize: '12px', color: '#ffffff' });
        this.add.text(295.0, 3.0, "□", { fontFamily: 'Arial', fontSize: '12px', color: '#ffffff' });
        this.add.text(318.0, 4.0, "✕", { fontFamily: 'Arial', fontSize: '12px', color: '#ffffff' });

        this.loadingText = this.add.text(12.0, 110.0, "Generating email...", {fontFamily: 'Arial', fontSize: '10px', color: '#aaaaaa',});

        this.notImportantBtn = this.add.rectangle(80.0, 254.0, 140.0, 22.0, 0x555555)
            .setStrokeStyle(1, 0x888888)
            .setInteractive({ useHandCursor: true })
            .on("pointerover",  () => this.notImportantBtn.setFillStyle(0x777777))
            .on("pointerout",   () => this.notImportantBtn.setFillStyle(0x555555))
            .on("pointerdown",  () => this.handleChoice("not important"));

        this.add.text(12.0, 246.0, "◀ NOT IMPORTANT", {
            fontFamily: 'Arial',
            fontSize: '10px',
            color: '#ffffff',
        });

        this.importantBtn = this.add.rectangle(258.0, 254.0, 120.0, 22.0, 0x555555)
            .setStrokeStyle(1, 0x888888)
            .setInteractive({ useHandCursor: true })
            .on("pointerover",  () => this.importantBtn.setFillStyle(0x777777))
            .on("pointerout",   () => this.importantBtn.setFillStyle(0x555555))
            .on("pointerdown",  () => this.handleChoice("important"));

        this.add.text(202.0, 246.0, "IMPORTANT ▶", {
            fontFamily: 'Arial',
            fontSize: '10px',
            color: '#ffffff',
        });

        this.setButtonsEnabled(false);
        this.spawnEmail();
    }

    setButtonsEnabled(enabled) {
        [this.notImportantBtn, this.importantBtn].forEach(btn => {
            btn.setAlpha(enabled ? 1 : 0.4);
            if (enabled) btn.setInteractive({ useHandCursor: true });
            else         btn.disableInteractive();
        });
    }

    handleChoice(choice) {
        this.setButtonsEnabled(false);
        this.currentEmail.submitChoice(choice);
    }

    spawnEmail() {
        this.loadingText.setVisible(true);
        this.setButtonsEnabled(false);

        if (this.currentEmail) { this.currentEmail.destroy(); this.currentEmail = null; }

        const email = new Email(this);
        this.currentEmail = email;


            this.loadingText.setVisible(false);
            this.setButtonsEnabled(true);


        email.on("sort-correct",   () => { this.events.emit("sort-correct");   this.spawnEmail(); });
        email.on("sort-incorrect", () => { this.events.emit("sort-incorrect"); this.spawnEmail(); });
    }
}