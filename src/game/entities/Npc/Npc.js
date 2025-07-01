export class Npc {
    constructor(scene, x, y, type = "defaultNpc") {
        this.scene = scene;
        this.type = type;
        this.currentDirection = null;
        this.isPlayerNear = false;
        this.sprite = scene.physics.add.sprite(x, y, type);
        this.sprite.setDepth(1100);
        this.sprite.body.setCollideWorldBounds(true);
        this.idle();
        this.startBehaviorLoop();

        this.scene.physics.world.on("collide", this.handleCollision, this);
    }

    talk() {
        if (!this.scene.dialogueBox.isActive) {
            this.scene.dialogueBox.start(this.dialogues, this.sprite);
        }
    }

    idle() {
        this.sprite.anims.play(`${this.type}-idle`, true);
    }

    move(dir) {
        this.sprite.anims.play(`${this.type}-walk`, true);
        this.sprite.setFlipX(dir === "right");
    }

    moveInDirection(dir) {
        const speed = 50;
        this.currentDirection = dir;
        this.sprite.body.setVelocity(0);

        switch (dir) {
            case "up":
                this.sprite.body.setVelocityY(-speed);
                break;
            case "down":
                this.sprite.body.setVelocityY(speed);
                break;
            case "left":
                this.sprite.body.setVelocityX(-speed);
                break;
            case "right":
                this.sprite.body.setVelocityX(speed);
                break;
        }

        this.move(dir);

        this.scene.time.delayedCall(400, () => {
            this.sprite.body.setVelocity(0);
            this.currentDirection = null;
            this.idle();
        });
    }

    startBehaviorLoop() {
        const directions = ["up", "down", "left", "right"];
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 4000),
            callback: () => {
                const dir = Phaser.Utils.Array.GetRandom(directions);
                this.moveInDirection(dir);
            },
            loop: true,
        });
    }

    handleCollision(gameObject1, gameObject2) {
        if (gameObject1 === this.sprite || gameObject2 === this.sprite) {
            this.sprite.body.setVelocity(0);
            this.currentDirection = null;
            this.idle();
        }
    }

    update() {
        const player = this.scene.player;
        if (!player) return;
        
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x,
            this.sprite.y,
            player.x,
            player.y
        );
    
        this.isPlayerNear = distance < 100;
        
    }
}


