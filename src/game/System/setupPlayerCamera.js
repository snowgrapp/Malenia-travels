// setupPlayerCamera.js
export function setupPlayerCamera(scene) {
    // Crée la caméra pour le joueur
    scene.playerCamera = scene.cameras.add(
        0,
        0,
        scene.scale.width,
        scene.scale.height,
        false,
        "playerCamera"
    );

    // Suit le joueur
    if (scene.player) {
        scene.playerCamera.startFollow(scene.player);
    }

    // Configure les limites
    if (scene.map) {
        scene.playerCamera.setBounds(
            0,
            0,
            scene.map.widthInPixels,
            scene.map.heightInPixels
        );
    }

    // Zoom par défaut
    scene.playerCamera.setZoom(2.5);

    // Liste des éléments UI à ignorer
    const uiIgnoreList = [
        scene.toolBox.conatiner,
        scene.inventory.container,
    ].filter(Boolean);

    scene.playerCamera.ignore(uiIgnoreList);

    // Méthode pour ajouter dynamiquement des éléments UI à ignorer
    scene.addToPlayerCameraIgnore = (gameObject) => {
        if (!scene.playerCamera.ignore.includes(gameObject)) {
            scene.playerCamera.ignore = [
                ...scene.playerCamera.ignore,
                gameObject,
            ];
        }
    };

    // Méthode pour supprimer des éléments de l'ignore
    scene.removeFromPlayerCameraIgnore = (gameObject) => {
        scene.playerCamera.ignore = scene.playerCamera.ignore.filter(
            (obj) => obj !== gameObject
        );
    };
}
