export class Animal {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type;

        this.isSleeping = false;
        this.isEating = false;
        this.currentDirection = null;

        this.sprite = scene.physics.add.sprite(x, y, type);
        this.sprite.setDepth(10);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setSize(15, 15);
        this.sprite.body.setOffset(8, 10);

        this.idle(); // Toujours idle par défaut

        // Lancement d’un cycle de comportement aléatoire
        this.startRandomBehaviorLoop();

        // Collisions
        this.scene.physics.world.on('collide', this.handleCollision, this);
    }

    idle() {
        this.sprite.anims.play(`${this.type}-idle`, true);
    }

    move(dir) {
        if (dir === "left") {
            this.sprite.setFlipX(false);
        } else if (dir === "right") {
            this.sprite.setFlipX(true);
        }
    }

    moveInDirection(dir) {
        if (!this.isSleeping && !this.isEating) {
            const speed = 50;
            this.currentDirection = dir;

            this.sprite.body.setVelocity(0);

            switch (dir) {
                case "up": this.sprite.body.setVelocityY(-speed); break;
                case "down": this.sprite.body.setVelocityY(speed); break;
                case "left": this.sprite.body.setVelocityX(-speed); break;
                case "right": this.sprite.body.setVelocityX(speed); break;
            }

            this.move(dir); // ajuste le flipX

            // Revenir à l’état idle après 400ms
            this.scene.time.delayedCall(400, () => {
                this.sprite.body.setVelocity(0);
                this.currentDirection = null;
                if (!this.isSleeping && !this.isEating) this.idle();
            });
        }
    }

    // Comportement aléatoire toutes les 5–8 sec
    startRandomBehaviorLoop() {
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(5000, 8000),
            loop: true,
            callback: () => {
                if (this.isSleeping || this.isEating) return;

                const actions = ["idle", "sleep", "eat", "move"];
                const choice = Phaser.Utils.Array.GetRandom(actions);

                switch (choice) {
                    case "idle":
                        this.idle();
                        break;
                    case "sleep":
                        this.sleep();
                        break;
                    case "eat":
                        this.startEating();
                        break;
                    case "move":
                        const directions = ["up", "down", "left", "right"];
                        const dir = Phaser.Utils.Array.GetRandom(directions);
                        this.moveInDirection(dir);
                        break;
                }
            }
        });
    }

    sleep() {
        this.isSleeping = true;
        this.sprite.body.setVelocity(0);
        this.sprite.anims.play(`${this.type}-sleep`, true);

        this.scene.time.delayedCall(30000, () => {
            this.wakeUp();
        });
    }

    wakeUp() {
        this.isSleeping = false;
        this.idle();
    }

    startEating() {
        this.isEating = true;
        this.sprite.body.setVelocity(0);
        this.sprite.anims.play(`${this.type}-eat`, true);

        this.scene.time.delayedCall(3000, () => {
            this.stopEating();
        });
    }

    stopEating() {
        this.isEating = false;
        this.idle();
    }

    handleCollision(gameObject1, gameObject2) {
        if (gameObject1 === this.sprite || gameObject2 === this.sprite) {
            this.sprite.body.setVelocity(0);

            switch (this.currentDirection) {
                case "up": this.moveInDirection("down"); break;
                case "down": this.moveInDirection("up"); break;
                case "left": this.moveInDirection("right"); break;
                case "right": this.moveInDirection("left"); break;
            }
        }
    }
}
