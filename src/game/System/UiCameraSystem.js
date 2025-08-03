export function setupUiCamera(scene) {
    // Crée la caméra UI
    scene.uiCamera = scene.cameras.add(0, 0, scene.scale.width, scene.scale.height, false, 'uiCamera');
    scene.uiCamera.setScroll(0, 0);
    scene.uiCamera.setZoom(1);
    
    // Liste des éléments à ignorer par défaut
    const defaultIgnoreList = [
        scene.player,
        ...(scene.npcs?.map((n) => n?.sprite) || []),
        ...(scene.animals?.map((a) => a?.sprite) || []),
        ...Object.values(scene.layers || {}).filter(Boolean),
        ...(scene.foregroundObjects || []),
        ...(scene.cuttableTrees || []),
        ...(scene.droppedResources?.map((r) => r?.sprite) || []),
        ...(scene.crops?.map((c) => c?.sprite) || [])
    ].filter(Boolean); // Filtre les éléments null/undefined

    // Configure l'ignore
    scene.uiCamera.ignore(defaultIgnoreList);

    // Méthode pour ajouter dynamiquement des éléments à ignorer
    scene.addToUiCameraIgnore = (gameObject) => {
        if (!scene.uiCamera.ignore.includes(gameObject)) {
            scene.uiCamera.ignore = [...scene.uiCamera.ignore, gameObject];
        }
    };

    // Méthode pour supprimer des éléments de l'ignore
    scene.removeFromUiCameraIgnore = (gameObject) => {
        scene.uiCamera.ignore = scene.uiCamera.ignore.filter(obj => obj !== gameObject);
    };


}