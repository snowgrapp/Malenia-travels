// Importation de la classe parent Animal et des animations spécifiques pour la poule
import { Animal } from '../animals.js'; // À adapter selon ta structure de dossiers
import { createChickenAnims } from '../../../Animations/ChickenAnimation.js';

export class Chicken extends Animal {
    constructor(scene, x, y) {
        // Appel du constructeur parent avec type "chicken"
        super(scene, x, y, "chicken");

        // Rend la hitbox immobile (ne sera pas déplacée par la physique)
        this.sprite.body.setImmovable(true);
        // Redéfinit la taille de la hitbox pour qu'elle soit plus petite (4x4)
        this.sprite.body.setSize(8, 8);

        // Après un petit délai, lance l'animation idle de la poule si possible
        scene.time.delayedCall(100, () => {
            if (this.sprite.anims) {
                this.sprite.play("chicken-idle");
            }
        });
    }

    // Méthode statique pour précharger les sprites de la poule avant la scène
    static preload(scene) {
        scene.load.spritesheet("chicken", "assets/Cute_Fantasy/Animals/Chicken/Chicken_02.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    // Méthode statique pour créer les animations spécifiques de la poule
    static createAnims(scene) {
        createChickenAnims(scene);
    }

}
