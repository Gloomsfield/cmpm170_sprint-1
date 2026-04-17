class Email extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0.0, 10.0);
        scene.add.existing(this);

        this.subject = "Loading...";
        this.message = "Please wait.";
        this.category = null;

        this.subject_text = new Phaser.GameObjects.BitmapText(scene, 5.0, 5.0, "roboto_font", this.subject, 12.0).setMaxWidth(320.0);
        this.message_text = new Phaser.GameObjects.BitmapText(scene, 5.0, 22.0, "roboto_font", this.message, 12.0).setMaxWidth(320.0);

        this.add([this.subject_text, this.message_text]);

        this.setSize(330.0, 140.0);
        this.setInteractive({
            draggable: true,
            hitAreaCallback: (hit_area, event_x, event_y) => {return ((-5.0 <= event_x && event_x < 335.0) && (-5.0 <= event_y && event_y < 145.0));}
        });

        this.on("drag", (pointer, drag_x, drag_y) => { this.setPosition(drag_x, drag_y); });

        this.on("dragend", () => {
            if (this.x < -20.0) { this.emit(this.category === "trash" ? "sort-correct" : "sort-incorrect"); }
            if (this.x > 20.0)  { this.emit(this.category === "archive" ? "sort-correct" : "sort-incorrect"); }
            this.setPosition(0.0, 10.0);
        });

        this.disableInteractive();
        this.loadEmail(scene);
    }

    async loadEmail(scene) {
        const email = await tryGenerateEmail();
        const rankedEmail = await tryRankEmail(email);
        const lines = email.split("\n").filter(l => l.trim() !== "");

        this.subject = lines[0] || email;
        this.message = lines.slice(1).join("\n") || "";
        this.category = rankedEmail === "important" ? "archive" : "trash";

        this.subject_text.setText(this.subject);
        this.message_text.setText(this.message);

        this.setSize(330.0, 140.0);
        this.setInteractive({
            draggable: true,
            hitAreaCallback: (hit_area, event_x, event_y) => {return ((-5.0 <= event_x && event_x < 335.0) && (-5.0 <= event_y && event_y < 145.0));}
        });

        this.emit("email-loaded");
    }
}