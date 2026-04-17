/* CMPM 170 - sprint 1
 * team:
 *		noah flournoy
 *		cassian jones
 *		josh gioffre
 *		hannah gong
 *		yuval szwarcbord
 *		amory acosta
 */

let config = {
	type: Phaser.WEBGL,

	width: 640,
	height: 480,

	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},

	scene: [ Load, Desktop, BankWindow, EmailWindow, GameWindow, DungeonMap],
};

let game = new Phaser.Game(config);

let KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_MENU;