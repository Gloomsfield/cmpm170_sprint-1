// constants
const EMAIL_MARGIN = 5.0;
const EMAIL_PADDING = 2.5;

class Email extends Phaser.GameObjects.Container {
	constructor(scene) {
		super(scene, 0.0, 0.0);

		scene.add.existing(this);
		let email_contents = Email.generate_contents();

		this.subject = email_contents.subject;
		this.message = email_contents.message;

		this.subject_text = new Phaser.GameObjects.BitmapText(
			scene,
			0.0, 0.0,
			"roboto_font",
			this.subject,
			12.0
		);

		this.message_text = new Phaser.GameObjects.BitmapText(
			scene,
			0.0, 15.0,
			"roboto_font",
			this.message,
			12.0
		);

		this.add([ this.subject_text, this.message_text ]);

		this.setInteractive({
			draggable: true,
			hitAreaCallback: (hit_area, event_x, event_y) => {
				return (-5.0 <= event_x && event_x < scene.cameras.main.width - 5.0) && (-5.0 <= event_y && event_y < 40.0);
			}
		});

		this.on("drag", (pointer, drag_x, drag_y) => {
			this.setPosition(drag_x, drag_y);
		});

		this.on("dragend", () => {
			if(this.x < -75.0 || 75.0 < this.x ) {
				console.log("edge");
			}

			this.setPosition(0.0, 0.0);
		});

		scene.add.existing(this);
	}

	static generate_contents() {
		return {
			subject: "test subject line",
			message: "this is a test email.",
			category: "trash", // TODO - factor into Category class (though that might be overkill...)
		};
	}
}

