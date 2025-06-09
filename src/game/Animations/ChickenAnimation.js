export function createChickenAnims(scene) {
    // Animation "idle-chicken" : la poule qui reste tranquille (frames 0 à 1)
    scene.anims.create({
        key: "chicken-idle", // Nom de l'animation
        frames: scene.anims.generateFrameNumbers("chicken", { start: 0, end: 1 }), // Images de la spritesheet à utiliser
        frameRate: 3, // Vitesse d'animation (3 images par seconde)
        repeat: -1, // Répéter en boucle infinie
    });

    // Animation "walk-chicken" : la poule qui marche (frames 8 à 13)
    scene.anims.create({
        key: "chicken-walk",
        frames: scene.anims.generateFrameNumbers("chicken", { start: 8, end: 13 }),
        frameRate: 8, // Animation plus rapide
        repeat: -1,
    });

    // Animation "eat-chicken" : la poule qui mange (frames 16 à 23)
    scene.anims.create({
        key: "chicken-eat",
        frames: scene.anims.generateFrameNumbers("chicken", { start: 16, end: 23 }),
        frameRate: 8,
        repeat: -1,
    });

    // Animation "sleep-chicken" : la poule qui dort (frames 48 à 55)
    scene.anims.create({
        key: "chicken-sleep",
        frames: scene.anims.generateFrameNumbers("chicken", { start: 48, end: 55 }),
        frameRate: 4, // Animation plus lente pour un effet sommeil
        repeat: -1,
    });
}
