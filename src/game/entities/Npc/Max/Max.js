import { createMaxAnims } from "../../../Animations/MaxAnimation";
import { Npc } from "../Npc";

export class Max extends Npc {
    constructor(scene, x, y) {
        // On utilise "max" comme clé de sprite pour animations
        super(scene, x, y, "max");

        // Définir les lignes de dialogue
        this.dialogues = [
            "Salut, bienvenue !",
            "Tu pourrais m'aider ?",
            "Va couper du bois et rapporte-moi 10 bouts de bois.",
        ];

        // Corps immobile et taille du corps physique
        this.sprite.body.setImmovable(true);
        this.sprite.body.setSize(16, 16); // Ajuste si besoin

        // Lancer l’animation idle après un court délai (évite crash si anim pas prête)
        scene.time.delayedCall(100, () => {
            if (this.sprite.anims && this.sprite.anims.animationManager.exists("max-idle")) {
                this.sprite.play("max-idle");
            }
        });
    }

    static preload(scene) {
        // Charger le spritesheet
        scene.load.spritesheet("max", "assets/Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    static createAnims(scene) {
        // Crée les animations via un fichier séparé
        createMaxAnims(scene);
    }
}

