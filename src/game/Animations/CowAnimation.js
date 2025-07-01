export function createCowAnims(scene) {
    // Animation "idle-chicken" : la poule qui reste tranquille (frames 0 à 1)
    scene.anims.create({
        key: "cow-idle", // Nom de l'animation
        frames: scene.anims.generateFrameNumbers("cow", { start: 0, end: 1 }), // Images de la spritesheet à utiliser
        frameRate: 3, // Vitesse d'animation (3 images par seconde)
        repeat: -1, // Répéter en boucle infinie
    });

    // Animation "walk-chicken" : la poule qui marche (frames 8 à 13)
    scene.anims.create({
        key: "cow-walk",
        frames: scene.anims.generateFrameNumbers("cow", { start: 8, end: 15 }),
        frameRate: 8, // Animation plus rapide
        repeat: -1,
    });

    // Animation "eat-chicken" : la poule qui mange (frames 16 à 23)
    scene.anims.create({
        key: "cow-eat",
        frames: scene.anims.generateFrameNumbers("cow", { start: 16, end: 23 }),
        frameRate: 8,
        repeat: -1,
    });

    // Animation "sleep-chicken" : la poule qui dort (frames 48 à 55)
    scene.anims.create({
        key: "cow-sleep",
        frames: scene.anims.generateFrameNumbers("cow", { start: 56, end: 63 }),
        frameRate: 4, // Animation plus lente pour un effet sommeil
        repeat: -1,
    });
}
