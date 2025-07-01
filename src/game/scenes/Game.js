import { Scene } from "phaser";
import { Player } from "../entities/player.js";
import { Chicken } from "../entities/Animals/Chicken/chicken.js";
import { Cow } from "../entities/Animals/Cow/cow.js";
import { Max } from "../entities/Npc/Max/max.js";
import { Npc } from "../entities/Npc/Npc.js";
import { DialogueBox } from "../ui/DialogueBox.js";
import { ToolBox } from "../ui/ToolBox.js";
import { EventBus } from "../EventBus";
import { setupCollisions } from "../Config/CollisionConfig.js";
import { setupUiCamera } from "../System/UiCameraSystem.js";


export class Game extends Scene {
    constructor() {
        super("Game");
        this.player = null;
        this.animals = [];
        this.npcs = [];
    }

    preload() {



        

        this.load.spritesheet("tool_icons", "/assets/Cute_Fantasy/Icons/Outline/Tool_Icons_Outline.png", {
            frameWidth: 16,
            frameHeight: 16
        });
    
        // Carte
        this.load.tilemapTiledJSON("map", "/assets/map/map-main.json");

        // Tilesets
        this.load.image(
            "grass_4_middle",
            "/assets/Cute_Fantasy/Tiles/Grass/Grass_4_Middle.png"
        );
        this.load.image(
            "path_middle",
            "/assets/Cute_Fantasy/Tiles/Grass/Path_Middle.png"
        );
        this.load.image(
            "fences",
            "/assets/Cute_Fantasy/Outdoor decoration/Fences.png"
        );
        this.load.image(
            "Land",
            "/assets/Cute_Fantasy/Tiles/FarmLand/FarmLand_Tile.png"
        );
        this.load.image(
            "River-board",
            "/assets/Cute_Fantasy/Tiles/Water/Water_Stone_Tile_4_Anim.png"
        );
        this.load.image(
            "farm",
            "/assets/Cute_Fantasy/House/Buildings/Other/Horse_Stable_3.png"
        );
        this.load.image(
            "house_main",
            "/assets/Cute_Fantasy/House/Buildings/Houses/House_3_5.png"
        );
        this.load.image(
            "house_pnj",
            "/assets/Cute_Fantasy/House/Buildings/Houses/House_5_2.png"
        );

        this.load.image(
            "outdoorDecor",
            "/assets/Cute_Fantasy/Outdoor decoration/Outdoor_Decor.png"
        );
        this.load.image(
            "big_fruit_tree",
            "/assets/Cute_Fantasy/Trees/Big_Fruit_Tree.png"
        );

        // Préchargement des entités
        Chicken.preload(this);
        Max.preload(this);
        Player.preload(this);
        Cow.preload(this);
    }

    create() {
        this.map = this.make.tilemap({ key: "map" });

        const tilesets = {
            Grass: this.map.addTilesetImage("Grass", "grass_4_middle"),
            Road: this.map.addTilesetImage("Road", "path_middle"),
            Fences: this.map.addTilesetImage("Fences", "fences"),
            Land: this.map.addTilesetImage("FarmLand", "Land"),
            River_board: this.map.addTilesetImage("River-board", "River-board"),
            Farm: this.map.addTilesetImage("Chicken-house", "farm"),
            House_main: this.map.addTilesetImage("House_main", "house_main"),
            House_pnj: this.map.addTilesetImage("House_pnj", "house_pnj"),
            Decorations: this.map.addTilesetImage(
                "Outdoor_Decor",
                "outdoorDecor"
            ),
            Outdoor_Decor: this.map.addTilesetImage(
                "Outdoor_Decor",
                "outdoorDecor"
            ),

            Trees: this.map.addTilesetImage("Big_Fruit_Tree", "big_fruit_tree"),
        };

        // Création des couches
    this.layers = {}; // Ajoute ceci

this.layers.Grass = this.map.createLayer("Grass", tilesets.Grass, 0, 0);
this.layers.Road = this.map.createLayer("Road", tilesets.Road, 0, 0);
this.layers.Fences = this.map.createLayer("Fences", tilesets.Fences, 0, 0);
this.layers.Land = this.map.createLayer("Land", tilesets.Land, 0, 0);
this.layers.River = this.map.createLayer("River", tilesets.River_board, 0, 0);
this.layers.Farm = this.map.createLayer("Farm", tilesets.Farm, 0, 0);
this.layers.UpFarm = this.map.createLayer("Up-Farm", tilesets.Farm, 0, 0).setDepth(1000);
this.layers.House = this.map.createLayer("House", tilesets.House_main, 0, 0);
this.layers.UpHouse = this.map.createLayer("Up_House", tilesets.House_main, 0, 0).setDepth(1000);
this.layers.HousePnj = this.map.createLayer("House_pnj", tilesets.House_pnj, 0, 0);
this.layers.UpHousePnj = this.map.createLayer("Up-House-pnj", tilesets.House_pnj, 0, 0).setDepth(1000);
this.layers.Decorations = this.map.createLayer("Decorations", tilesets.Decorations, 0, 0);
this.layers.Rocks = this.map.createLayer("Rocks", tilesets.Outdoor_Decor, 0, 0);
this.layers.Bush = this.map.createLayer("Bush", tilesets.Outdoor_Decor, 0, 0);
this.layers.Flowers = this.map.createLayer("Flowers", tilesets.Outdoor_Decor, 0, 0);
this.layers.Trees = this.map.createLayer("Trees", tilesets.Trees, 0, 0);
this.layers.UpTrees = this.map.createLayer("Up_Trees", tilesets.Trees, 0, 0).setDepth(1000);


        // Animations
        Chicken.createAnims(this);
        Max.createAnims(this);
        Player.createAnimations(this);
        Cow.createAnims(this);

        // Création du joueur
        const spawnPoint = this.map.findObject(
            "Player",
            (obj) => obj.name === "player"
        );
        if (!spawnPoint) {
            console.error("Point d’apparition du joueur introuvable !");
            return;
        }
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);

        // Création des animaux
        const chickenObjects =
            this.map
                .getObjectLayer("Chicken")
                ?.objects.filter((obj) => obj.name === "Chicken") || [];
        chickenObjects.forEach((obj) => {
            const chicken = new Chicken(this, obj.x, obj.y);
            this.animals.push(chicken);
        });


        const cowObjects =
        this.map
            .getObjectLayer("Cow")
            ?.objects.filter((obj) => obj.name === "Cow") || [];
    cowObjects.forEach((obj) => {
        const cow = new Cow(this, obj.x, obj.y);
        this.animals.push(cow);
    });

        // Création des PNJs
        const npcObjects = this.map.getObjectLayer("Npc")?.objects || [];
        npcObjects.forEach((obj) => {
            let npc;
            switch (obj.name) {
                case "Max":
                    npc = new Max(this, obj.x, obj.y);
                    break;
                default:
                    npc = new Npc(this, obj.x, obj.y, "defaultNpcSprite");
                    break;
            }
            this.npcs.push(npc);
        });

        // Collisions
        setupCollisions(this, this.player, [...this.animals, ...this.npcs]);

        // Caméra
        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
        this.cameras.main.setZoom(2.5);
        this.cameras.main.startFollow(this.player);
        setupUiCamera(this);

        // Interface - boîte de dialogue
        this.dialogueBox = new DialogueBox(this);
        this.toolBox = new ToolBox(this, this.player);


        // Touche d’interaction
        this.interactKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );

        // Scène prête
        EventBus.emit("current-scene-ready", this);
    }

    talkToNpc() {
        this.npcs.forEach((npc) => npc.update());
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.npcs.forEach((npc) => {
                if (npc.isPlayerNear) {
                    npc.talk();
                }
            });
        }
    }

    update() {
        if (this.player) this.player.update();
        this.talkToNpc();
        this.animals.forEach((animal) => animal.update && animal.update());
    }
}

