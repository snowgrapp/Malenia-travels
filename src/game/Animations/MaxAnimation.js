export function createMaxAnims(scene) {
    // Animation "idle-chicken" : la poule qui reste tranquille (frames 0 à 1)
    scene.anims.create({
        key: "max-idle", // Nom de l'animation
        frames: scene.anims.generateFrameNumbers("max", { start: 0, end: 5 }), // Images de la spritesheet à utiliser
        frameRate: 3, // Vitesse d'animation (3 images par seconde)
        repeat: -1, // Répéter en boucle infinie
    });

    // Animation "walk-chicken" : la poule qui marche (frames 8 à 13)
    scene.anims.create({
        key: "max-walk",
        frames: scene.anims.generateFrameNumbers("max", { start: 8, end: 13 }),
        frameRate: 8, // Animation plus rapide
        repeat: -1,
    });

}
