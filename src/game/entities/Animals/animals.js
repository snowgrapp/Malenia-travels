export class Animal {
    constructor(scene, x, y, type) {
        this.scene = scene; // Référence à la scène Phaser
        this.type = type;   // Type de l’animal (utilisé pour les animations)

        // États internes de l’animal
        this.isSleeping = false;
        this.isEating = false;
        this.currentDirection = null; // Dernière direction de déplacement

        // Création du sprite physique dans la scène
        this.sprite = scene.physics.add.sprite(x, y, type);
        this.sprite.setDepth(10); // Affiche le sprite devant d'autres éléments
        this.sprite.body.setCollideWorldBounds(true); // Empêche de sortir de la map
        this.sprite.body.setSize(15, 15); // Redimensionne la hitbox
        this.sprite.body.setOffset(8, 10); // Décale la hitbox pour mieux coller au visuel

        // Comportements automatiques de l’animal
        this.idle();              // Joue l’animation idle au démarrage
        this.startBehaviorLoop(); // Lance le déplacement aléatoire
        this.startSleepCheck();   // Active les vérifications de sommeil
        this.startEatCheck();     // Active les vérifications pour manger

        // Attache une gestion des collisions globales à cet animal
        this.scene.physics.world.on('collide', this.handleCollision, this);
    }

    // Joue l’animation idle de l’animal
    idle() {
        this.sprite.anims.play(`${this.type}-idle`, true);
    }

    // Joue l’animation de marche et change l’orientation du sprite selon la direction
    move(dir) {
        this.sprite.anims.play(`${this.type}-walk`, true);
        if (dir === "left") {
            this.sprite.setFlipX(false); // Non inversé
        } else if (dir === "right") {
            this.sprite.setFlipX(true); // Inversé horizontalement
        }
    }

    // Fait se déplacer l’animal dans une direction donnée s’il ne dort/mange pas
    moveInDirection(dir) {
        if (!this.isSleeping && !this.isEating) {
            const speed = 50; // Vitesse du déplacement
            this.currentDirection = dir;

            this.sprite.body.setVelocity(0); // Réinitialise la vitesse

            // Définit la direction de la vitesse selon le choix
            switch (dir) {
                case "up": this.sprite.body.setVelocityY(-speed); break;
                case "down": this.sprite.body.setVelocityY(speed); break;
                case "left": this.sprite.body.setVelocityX(-speed); break;
                case "right": this.sprite.body.setVelocityX(speed); break;
            }

            this.move(dir); // Joue l’animation correspondante

            // Arrête le déplacement après un court délai
            this.scene.time.delayedCall(400, () => {
                if (!this.isSleeping && !this.isEating) {
                    this.sprite.body.setVelocity(0);
                    this.currentDirection = null;
                }
            });
        }
    }

    // Boucle comportementale : déplace l’animal aléatoirement toutes les 2 à 4 secondes
    startBehaviorLoop() {
        const directions = ["up", "down", "left", "right"];
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 4000), // Temps aléatoire
            callback: () => {
                if (!this.isSleeping && !this.isEating) {
                    const randomDirection = Phaser.Utils.Array.GetRandom(directions);
                    this.moveInDirection(randomDirection);
                }
            },
            loop: true
        });
    }

    // Vérifie toutes les 20 à 40 secondes si l’animal doit dormir
    startSleepCheck() {
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(20000, 40000),
            callback: () => {
                if (!this.isEating && Phaser.Math.Between(0, 100) < 30) {
                    this.sleep();
                }
            },
            loop: true
        });
    }

    // Fait dormir l’animal pendant 30 secondes
    sleep() {
        this.isSleeping = true;
        this.sprite.body.setVelocity(0); // Arrête le mouvement
        this.sprite.anims.play(`${this.type}-sleep`, true); // Joue l’animation de sommeil

        // Réveil automatique après 30 secondes
        this.scene.time.delayedCall(30000, () => {
            this.wakeUp();
        });
    }

    // Réveille l’animal (retour à l’état idle)
    wakeUp() {
        this.isSleeping = false;
        this.idle();
    }

    // Vérifie toutes les 20 à 40 secondes si l’animal doit manger
    startEatCheck() {
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(20000, 40000),
            callback: () => {
                if (!this.isSleeping && Phaser.Math.Between(0, 100) < 40) {
                    this.startEating();
                }
            },
            loop: true
        });
    }

    // Démarre l’animation de repas pendant 3 secondes
    startEating() {
        this.isEating = true;
        this.sprite.body.setVelocity(0); // Arrête le mouvement
        this.sprite.anims.play(`${this.type}-eat`, true); // Joue l’animation de repas

        this.scene.time.delayedCall(3000, () => {
            this.stopEating();
        });
    }

    // Termine l’action de manger et repasse à l’état idle
    stopEating() {
        this.isEating = false;
        this.idle();
    }

    // Gestion des collisions : si le sprite est impliqué, stoppe le mouvement et inverse la direction
    handleCollision(gameObject1, gameObject2) {
        if (gameObject1 === this.sprite || gameObject2 === this.sprite) {
            this.sprite.body.setVelocity(0); // Arrêt immédiat

            // Inverse la direction actuelle en cas de collision
            switch (this.currentDirection) {
                case "up": this.moveInDirection("down"); break;
                case "down": this.moveInDirection("up"); break;
                case "left": this.moveInDirection("right"); break;
                case "right": this.moveInDirection("left"); break;
            }
        }
    }
}
