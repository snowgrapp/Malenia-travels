// cow.js
import { Animal } from '../animals.js';
import { createCowAnims } from '../../../Animations/CowAnimation.js'; // Assure-toi que le chemin est bon

export class Cow extends Animal {
    constructor(scene, x, y) {
        super(scene, x, y, "cow");

        // Retarde la config physique pour éviter l'erreur
        scene.time.delayedCall(0, () => {
            if (this.sprite.body) {
                this.sprite.body.setImmovable(true);
                this.sprite.body.setSize(8, 8);
            } else {
                console.error("Le corps physique n'existe pas encore sur la sprite !");
            }
        });

        // Lance l'animation idle un peu plus tard
        scene.time.delayedCall(100, () => {
            if (this.sprite.anims) {
                this.sprite.play("cow-idle");
            }
        });
    }

    static preload(scene) {
        scene.load.spritesheet("cow", "assets/Cute_Fantasy/Animals/Cow/Cow_01.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    static createAnims(scene) {
        createCowAnims(scene);
    }
}
