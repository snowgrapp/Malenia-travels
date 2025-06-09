import { Player } from "../entities/player.js";

export function loadAssets(scene) {
    // Préchargement du joueur
    Player.preload(scene);

    // Carte
    scene.load.tilemapTiledJSON("map", "assets/Map/map-main.json");

    // Tilesets
    scene.load.image(
        "grass_4_middle",
        "assets/Cute_Fantasy/Tiles/Grass/Grass_4_Middle.png"
    );
    scene.load.image(
        "path_middle",
        "assets/Cute_Fantasy/Tiles/Grass/Path_Middle.png"
    );
    scene.load.image(
        "big_fruit_tree",
        "assets/Cute_Fantasy/Trees/Big_Fruit_Tree.png"
    );
    scene.load.image(
        "house_main",
        "assets/Cute_Fantasy/House/Buildings/Houses/House_3_5.png"
    );
    scene.load.image(
        "farmLand",
        "assets/Cute_Fantasy/Tiles/FarmLand/FarmLand_Tile.png"
    );
    scene.load.image(
        "outdoorDecor",
        "assets/Cute_Fantasy/Outdoor-decoration/Outdoor_Decor.png"
    );
    scene.load.image(
        "RiverBoard",
        "assets/Cute_Fantasy/Tiles/Water/Water_Stone_Tile_4_Anim.png"
    );
    scene.load.image(
        "fences",
        "assets/Cute_Fantasy/Outdoor-decoration/Fences.png"
    );
    scene.load.image(
        "house_pnj",
        "assets/Cute_Fantasy/House/Buildings/Houses/House_5_2.png"
    );
    scene.load.image(
        "farm",
        "assets/Cute_Fantasy/House/Buildings/Other/Horse_Stable_3.png"
    );
}


