import { Scene } from "phaser";
import { Player } from "../entities/player.js";
import { Chicken } from "../entities/Animals/Chicken/chicken.js";
import { EventBus } from "../EventBus";
import { setupCollisions } from "../Config/CollisionConfig.js";
import { loadAssets } from "../Config/AssetsLoaderConfig.js";
import { Npc } from "../entities/Npc/Npc.js";
import { Max } from "../entities/Npc/Max/max.js";

export class Game extends Scene {
    constructor() {
        super("Game");
        this.player = null;
        this.animals = [];
        this.npcs = [];
    }

    preload() {
        loadAssets(this);
        Chicken.preload(this);
        Max.preload(this); // Charge Max aussi
    }

    create() {
        this.map = this.make.tilemap({ key: "map" });

        const tilesets = {
            Grass: this.map.addTilesetImage("Grass", "grass_4_middle"),
            Road: this.map.addTilesetImage("Road", "path_middle"),
            Trees: this.map.addTilesetImage("Big_Fruit_Tree", "big_fruit_tree"),
            House_main: this.map.addTilesetImage("House_main", "house_main"),
            FarmLand: this.map.addTilesetImage("FarmLand", "farmLand"),
            Outdoor_Decor: this.map.addTilesetImage(
                "Outdoor_Decor",
                "outdoorDecor"
            ),
            RiverBoard: this.map.addTilesetImage("River-board", "RiverBoard"),
            Fences: this.map.addTilesetImage("Fences", "fences"),
            House_pnj: this.map.addTilesetImage("House_pnj", "house_pnj"),
            Farm: this.map.addTilesetImage("Farm", "farm"),
        };

        Object.entries(tilesets).forEach(([layer, tileset]) => {
            this.map.createLayer(layer, tileset, 0, 0);
        });

        this.map.createLayer("Up_Trees", tilesets.Trees, 0, 0).setDepth(1000);
        
        this.map
            .createLayer("Up-House", tilesets.House_main, 0, 0)
            .setDepth(1000);
        this.map
            .createLayer("Up-House-pnj", tilesets.House_pnj, 0, 0)
            .setDepth(1000);
        this.map.createLayer("Up-Farm", tilesets.Farm, 0, 0).setDepth(1000);

        Chicken.createAnims(this);
        Max.createAnims(this); // Lance animations Max

        const spawnPoint = this.map.findObject(
            "Player",
            (obj) => obj.name === "player"
        );
        Player.createAnimations(this);
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.physics.add.existing(this.player);

        const chickenObjects =
            this.map.filterObjects(
                "Chicken",
                (obj) => obj.name === "Chicken"
            ) || [];
        chickenObjects.forEach((obj) => {
            const chicken = new Chicken(this, obj.x, obj.y);
            this.animals.push(chicken);
        });

        // Spawn des NPCs dynamiquement
        const npcObjects = this.map.filterObjects("Npc", () => true) || [];

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

        setupCollisions(this, this.player, [...this.animals, ...this.npcs]);

        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.player);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        if (this.player) this.player.update();
        this.animals.forEach((a) => a.update && a.update());
        this.npcs.forEach((npc) => npc.update && npc.update());
    }
}

