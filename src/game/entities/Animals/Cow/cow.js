// cow.js
import { Animal } from '../animals.js';

export class Cow extends Animal {
    constructor(scene, x, y) {
        super(scene, x, y, "cow");

        this.body.setImmovable(true);
        this.body.setSize(10, 10);

        scene.time.delayedCall(100, () => {
            if (this.anims) {
                this.play("idle-cow");
            }
        });

        this.specialBehavior();
    }

    static preload(scene) {
        scene.load.spritesheet("cow", "assets/Cute_Fantasy/Animals/Cow/Cow_01.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    static createAnims(scene) {
        scene.anims.create({
            key: "idle-cow",
            frames: scene.anims.generateFrameNumbers("cow", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1,
        });

        scene.anims.create({
            key: "walk-cow",
            frames: scene.anims.generateFrameNumbers("cow", { start: 8, end: 13 }),
            frameRate: 8,
            repeat: -1,
        });

        scene.anims.create({
            key: "eat-cow",
            frames: scene.anims.generateFrameNumbers("cow", { start: 16, end: 23 }),
            frameRate: 8,
            repeat: -1,
        });

        scene.anims.create({
            key: "sleep-cow",
            frames: scene.anims.generateFrameNumbers("cow", { start: 48, end: 55 }),
            frameRate: 4,
            repeat: -1,
        });
    }

    specialBehavior() {
        // Exemple de comportement spécifique
    }
}
