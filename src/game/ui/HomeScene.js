import { Scene } from "phaser";

export class HomeScene extends Scene {
    constructor() {
        super("HomeScene");
    }

    preload() {
        this.load.image("background", "/assets/home/background.png");
        this.load.image("startButton", "/assets/home/start_button.png");
    }

    create() {
        this.add.image(400, 300, "background").setOrigin(0.5, 0.5);

        const startButton = this.add.image(400, 400, "startButton").setOrigin(0.5, 0.5).setInteractive();

        startButton.on("pointerdown", () => {
            this.scene.start("Game"); // Passe à la scène principale du jeu
        });
    }
}