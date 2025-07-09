import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(17, 22);
        this.setScale(0.8);

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.actionKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.lastDirection = "down";
        this.lastFlipX = false;

        this.selectedTool = null;
    }

    static preload(scene) {
        scene.load.spritesheet(
            "player",
            "/assets/Cute_Fantasy/Player/Player_New/Player_Anim/Player_Idle_Run_Death_Anim.png",
            {
                frameWidth: 32,
                frameHeight: 32,
            }
        );

        scene.load.spritesheet(
            "player_actions",
            "/assets/Cute_Fantasy/Player/Player_New/Player_Anim/Player_Actions_Anim_Tool.png",
            {
                frameWidth: 48,
                frameHeight: 48,
            }
        );

        scene.load.spritesheet("player_jump", "public/assets/Cute_fantasy/Player/Player_New/Player_Anim/Player_Jump_Anim.png", {
            frameWidth: 48,
            frameHeight: 48
        });
    }

    static createAnimations(scene) {
        // Animations identiques à celles du code d’origine
        scene.anims.create({
            key: "idle-player",
            frames: scene.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: "idle-up",
            frames: scene.anims.generateFrameNumbers("player", { start: 16, end: 21 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: "idle-left",
            frames: scene.anims.generateFrameNumbers("player", { start: 8, end: 13 }),
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

        scene.anims.create({
            key: "jump",
            frames: scene.anims.generateFrameNumbers("player_jump", { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        // Animations outils
        scene.anims.create({
            key: "use_axe_right",
            frames: scene.anims.generateFrameNumbers("player_actions", { start: 18, end: 23 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: "use_axe",
            frames: scene.anims.generateFrameNumbers("player_actions", { start: 24, end: 29 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: "use_axe_up",
            frames: scene.anims.generateFrameNumbers("player_actions", { start: 30, end: 35 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: "use_pickaxe_right",
            frames: scene.anims.generateFrameNumbers("player_actions", { start: 0, end: 5 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: "use_pickaxe_up",
            frames: scene.anims.generateFrameNumbers("player_actions", { start: 12, end: 17 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: "use_pickaxe",
            frames: scene.anims.generateFrameNumbers("player_actions", { start: 6, end: 11 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: "use_water_right",
            frames: scene.anims.generateFrameNumbers("player_actions", { start: 66, end: 71 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: "use_water_up",
            frames: scene.anims.generateFrameNumbers("player_actions", { start: 60, end: 65 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: "use_water",
            frames: scene.anims.generateFrameNumbers("player_actions", { start: 59, end: 64 }),
            frameRate: 8,
            repeat: 0
        });
    }

    selectTool(toolName) {
        this.selectedTool = toolName;
    }

    useSelectedTool() {
        if (!this.selectedTool) return;

        const animMap = {
            axe: { down: "use_axe", up: "use_axe_up", side: "use_axe_right" },
            pickaxe: { down: "use_pickaxe", up: "use_pickaxe_up", side: "use_pickaxe_right" },
            water: { down: "use_water", up: "use_water_up", side: "use_water_right" }
        };

        const toolAnim = animMap[this.selectedTool];
        if (!toolAnim) return;

        switch (this.lastDirection) {
            case "up":
                this.anims.play(toolAnim.up, true);
                break;
            case "left":
                this.anims.play(toolAnim.side, true);
                this.setFlipX(true);
                break;
            case "right":
                this.anims.play(toolAnim.side, true);
                this.setFlipX(false);
                break;
            case "down":
            default:
                this.anims.play(toolAnim.down, true);
                break;
        }

        this.setVelocity(0, 0);
    }

    update() {
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;
        let moving = false;

        // On bloque le déplacement si animation d'outil en cours
        const currentAnim = this.anims.currentAnim?.key;
        const isUsingTool = [
            "use_axe", "use_axe_up", "use_axe_right",
            "use_pickaxe", "use_pickaxe_up", "use_pickaxe_right",
            "use_water", "use_water_up", "use_water_right"
        ].includes(currentAnim);

        if (this.anims.isPlaying && isUsingTool) {
            this.setVelocity(0, 0);
            return;
        }

        // Touche Z pour utiliser l'outil sélectionné
        if (Phaser.Input.Keyboard.JustDown(this.actionKey)) {
            this.useSelectedTool();
            return;
        }

        // Gestion des déplacements
        if (this.cursors.left.isDown) {
            velocityX = -speed;
            this.anims.play("walk_right", true);
            this.setFlipX(true);
            this.lastDirection = "left";
            this.lastFlipX = true;
            moving = true;
        } else if (this.cursors.right.isDown) {
            velocityX = speed;
            this.anims.play("walk_right", true);
            this.setFlipX(false);
            this.lastDirection = "right";
            this.lastFlipX = false;
            moving = true;
        }

        if (this.cursors.up.isDown) {
            velocityY = -speed;
            this.anims.play("walk_up", true);
            this.lastDirection = "up";
            moving = true;
        } else if (this.cursors.down.isDown) {
            velocityY = speed;
            this.anims.play("walk_down", true);
            this.lastDirection = "down";
            moving = true;
        }

        this.setVelocity(velocityX, velocityY);

        // Animations idle selon dernière direction
        if (!moving) {
            switch (this.lastDirection) {
                case "up":
                    this.anims.play("idle-up", true);
                    break;
                case "down":
                    this.anims.play("idle-player", true);
                    break;
                case "left":
                    this.anims.play("idle-left", true);
                    this.setFlipX(true);
                    break;
                case "right":
                    this.anims.play("idle-left", true);
                    this.setFlipX(false);
                    break;
            }
        }
    }
}
