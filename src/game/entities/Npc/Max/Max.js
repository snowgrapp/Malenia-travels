
import { createMaxAnims } from "../../../Animations/MaxAnimation";
import { Npc } from "../Npc";

export class Max extends Npc {
    constructor(scene, x, y) {
        super(scene, x, y, "max");

        this.sprite.body.setImmovable(true);
        this.sprite.body.setSize(8, 8);

        scene.time.delayedCall(100, () => {
            if (this.sprite.anims) {
                this.sprite.play("max-idle");
            }
        });
    }

    static preload(scene) {
        scene.load.spritesheet("max", "assets/Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    static createAnims(scene) {
        createMaxAnims(scene);
    }
}
