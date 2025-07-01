export function setupUiCamera(scene){
    scene.uiCamera = scene.cameras.add(0,0, scene.scale.width,scene.scale.height);
    scene.uiCamera.setScroll(0,0);
    scene.uiCamera.setZoom(1);

    scene.uiCamera.ignore([
        scene.player,
        ...scene.npcs.map((n)=>n.sprite),
        ...scene.animals.map((a)=>a.sprite),
        ...Object.values(scene.layers),
    ])
}
