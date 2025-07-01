export function createMaxAnims(scene) {
    scene.anims.create({
        key: "max-idle", // Nom de l'animation
        frames: scene.anims.generateFrameNumbers("max", { start: 0, end: 5 }), // Images de la spritesheet à utiliser
        frameRate: 3, // Vitesse d'animation (3 images par seconde)
        repeat: -1, // Répéter en boucle infinie
    });

    scene.anims.create({
        key: "max-walk",
        frames: scene.anims.generateFrameNumbers("max", { start: 8, end: 13 }),
        frameRate: 8, // Animation plus rapide
        repeat: -1,
    });
}

