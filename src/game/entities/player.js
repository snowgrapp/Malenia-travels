import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player");

        // Ajout à la scène et au système physique
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(17, 22); // taille de collision
        this.setScale(0.8); // taille visuelle

        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    static preload(scene) {
        scene.load.spritesheet("player", "public/assets/Cute_fantasy/Player/Player_New/Player_Anim/Player_Idle_Run_Death_Anim.png", {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    static createAnimations(scene) {
        scene.anims.create({
            key: "idle-player",
            frames: scene.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });

        scene.anims.create({
            key: "walk_down",
            frames: scene.anims.generateFrameNumbers("player", { start: 24, end: 29 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: "walk_up",
            frames: scene.anims.generateFrameNumbers("player", { start: 16, end: 21 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: "walk_right",
            frames: scene.anims.generateFrameNumbers("player", { start: 32, end: 37 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;

        // Déplacements
        if (this.cursors.left.isDown) {
            velocityX = -speed;
            this.anims.play("walk_right", true);
            this.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            velocityX = speed;
            this.anims.play("walk_right", true);
            this.setFlipX(false);
        }

        if (this.cursors.up.isDown) {
            velocityY = -speed;
            this.anims.play("walk_up", true);
        } else if (this.cursors.down.isDown) {
            velocityY = speed;
            this.anims.play("walk_down", true);
        }

        // Appliquer la vélocité
        this.setVelocity(velocityX, velocityY);

        // Animation idle
        if (velocityX === 0 && velocityY === 0) {
            this.anims.play("idle-player", true);
        }
    }
}
