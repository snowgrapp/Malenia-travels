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
import { Inventory } from "../System/UiInventory.js";

export class Game extends Scene {
    constructor() {
        super("Game");
        this.player = null;
        this.animals = [];
        this.npcs = [];
        this.foregroundObjects = [];
        this.cuttableTrees = [];
        this.droppedResources = [];
        this.crops = []; // Pour stocker les plantes
        this.growingCrops = []; // Pour suivre les plantes en croissance
    }

    preload() {
        this.load.audio('bgm', '/assets/Audio/music_main.mp3');

        this.load.spritesheet("tool_icons", "/assets/Cute_Fantasy/Icons/Outline/Tool_Icons_Outline.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("crops", "/assets/Cute_Fantasy/Crops/Crops.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.tilemapTiledJSON("map", "/assets/map/map-main.json");

        this.load.image("grass_4_middle", "/assets/Cute_Fantasy/Tiles/Grass/Grass_4_Middle.png");
        this.load.image("path_middle", "/assets/Cute_Fantasy/Tiles/Grass/Path_Middle.png");
        this.load.image("fences", "/assets/Cute_Fantasy/Outdoor decoration/Fences.png");
        this.load.image("Land", "/assets/Cute_Fantasy/Tiles/FarmLand/FarmLand_Tile.png");
        this.load.image("River-board", "/assets/Cute_Fantasy/Tiles/Water/Water_Stone_Tile_4_Anim.png");
        this.load.image("farm", "/assets/Cute_Fantasy/House/Buildings/Other/Horse_Stable_3.png");
        this.load.image("house_main", "/assets/Cute_Fantasy/House/Buildings/Houses/House_3_5.png");
        this.load.image("house_pnj", "/assets/Cute_Fantasy/House/Buildings/Houses/House_5_2.png");
        this.load.image("outdoorDecor", "/assets/Cute_Fantasy/Outdoor decoration/Outdoor_Decor.png");
        this.load.image("big_fruit_tree", "/assets/Cute_Fantasy/Trees/Big_Fruit_Tree.png");
        this.load.image("big_fruit_tree_object", "/assets/Cute_Fantasy/Trees/Big_Fruit_Tree_object.png");

        this.load.spritesheet("ressources", "/assets/Cute_Fantasy/Icons/No Outline/Resources_Icons_NO_Outline.png", {
            frameWidth: 16,
            frameHeight: 16
        });

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
            Decorations: this.map.addTilesetImage("Outdoor_Decor", "outdoorDecor"),
            Trees: this.map.addTilesetImage("Big_Fruit_Tree", "big_fruit_tree"),
        };

        this.layers = {};
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
        this.layers.Rocks = this.map.createLayer("Rocks", tilesets.Decorations, 0, 0);
        this.layers.Bush = this.map.createLayer("Bush", tilesets.Decorations, 0, 0);
        this.layers.Flowers = this.map.createLayer("Flowers", tilesets.Decorations, 0, 0);
        this.layers.Trees = this.map.createLayer("Trees", tilesets.Trees, 0, 0);

        Chicken.createAnims(this);
        Max.createAnims(this);
        Player.createAnimations(this);
        Cow.createAnims(this);

        // Animation pour la croissance des plantes
        this.anims.create({
            key: 'grow_crop',
            frames: [
                { key: 'crops', frame: 16 },
                { key: 'crops', frame: 17 },
                { key: 'crops', frame: 18 },
                { key: 'crops', frame: 19 },
                { key: 'crops', frame: 20 }
            ],
            frameRate: 1,
            repeat: 0
        });

        const spawnPoint = this.map.findObject("Player", obj => obj.name === "player");
        if (!spawnPoint) {
            console.error("Point d'apparition du joueur introuvable !");
            return;
        }
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);

        const chickenObjects = this.map.getObjectLayer("Chicken")?.objects.filter(obj => obj.name === "Chicken") || [];
        chickenObjects.forEach(obj => this.animals.push(new Chicken(this, obj.x, obj.y)));

        const cowObjects = this.map.getObjectLayer("Cow")?.objects.filter(obj => obj.name === "Cow") || [];
        cowObjects.forEach(obj => this.animals.push(new Cow(this, obj.x, obj.y)));

        const npcObjects = this.map.getObjectLayer("Npc")?.objects || [];
        npcObjects.forEach(obj => {
            const npc = obj.name === "Max"
                ? new Max(this, obj.x, obj.y)
                : new Npc(this, obj.x, obj.y, "defaultNpcSprite");
            this.npcs.push(npc);
        });

        

        const treeObjects = this.map.getObjectLayer("Up_destroyed_tree")?.objects || [];
        treeObjects.forEach(obj => {
            const tree = this.add.image(obj.x, obj.y, "big_fruit_tree_object");
            tree.setOrigin(0, 1).setDepth(2000);
            tree.hitCount = 0;
            tree.isBeingCut = false;
            this.foregroundObjects.push(tree);
        });

        this.events.on("use-pickaxe", player => {
            let offsetX = 0;
            let offsetY = 0;
            switch (player.lastDirection) {
                case "up": offsetY = -16; break;
                case "down": offsetY = 16; break;
                case "left": offsetX = -16; break;
                case "right": offsetX = 16; break;
            }

            const targetX = player.x + offsetX;
            const targetY = player.y + offsetY;

            const tileX = this.map.worldToTileX(targetX);
            const tileY = this.map.worldToTileY(targetY);

            const currentTile = this.layers.Land.getTileAt(tileX, tileY);
            this.layers.Land.putTileAt(1, tileX, tileY);
        });

        // Écouteur pour l'événement de plantation
        EventBus.on('plant-seed', (player) => {
            this.plantSeed(player);
        });

        this.cuttableTrees = this.foregroundObjects;

        setupCollisions(this, this.player, [...this.animals, ...this.npcs]);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(2.5);
        this.cameras.main.startFollow(this.player);
        setupUiCamera(this);

        this.dialogueBox = new DialogueBox(this);
        this.toolBox = new ToolBox(this, this.player);
        this.inventory = new Inventory(this);

        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.actionKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        EventBus.emit("current-scene-ready", this);
    }

    plantSeed(player) {
        // Vérifie si le joueur a bien sélectionné les graines de carotte
        if (player.selectedTool !== "carrotSeed") return;
    
        // Détermine la position devant le joueur
        let offsetX = 0;
        let offsetY = 0;
        switch (player.lastDirection) {
            case "up": offsetY = -16; break;
            case "down": offsetY = 16; break;
            case "left": offsetX = -16; break;
            case "right": offsetX = 16; break;
        }
    
        const targetX = player.x + offsetX;
        const targetY = player.y + offsetY;
    
        // Convertit en coordonnées de tile
        const tileX = this.map.worldToTileX(targetX);
        const tileY = this.map.worldToTileY(targetY);
    
        // Vérifie si c'est une tile "Land"
        const landTile = this.layers.Land.getTileAt(tileX, tileY);
        if (!landTile || landTile.index === -1) {
            console.log("Pas sur une terre cultivable !");
            return; // Pas de terre cultivable
        }
    
        // Vérifie si une plante existe déjà à cet endroit
        const existingCrop = this.crops.find(c => 
            c.tileX === tileX && c.tileY === tileY
        );
        if (existingCrop) {
            console.log("Il y a déjà une plante ici !");
            return;
        }
    
        // Crée la plante
        const worldX = this.map.tileToWorldX(tileX) + 8;
        const worldY = this.map.tileToWorldY(tileY) + 8;
        
        const crop = this.add.sprite(worldX, worldY, 'crops', 16);
        crop.setOrigin(0.5, 0.5);
        crop.tileX = tileX;
        crop.tileY = tileY;
        crop.growthStage = 0;
        crop.isReady = false;
    
        this.crops.push(crop);
        this.startGrowing(crop);
        
        console.log("Graine plantée avec succès !");
    }
    startGrowing(crop) {
        crop.anims.play('grow_crop');
        crop.isHarvested = false; // Nouvelle propriété
        
        crop.on('animationcomplete', () => {
            crop.isReady = true;
            crop.setFrame(20);
        });
    }

    harvestCrop(crop) {
        if (!crop.isReady) return;
        
        // Ajoute la carotte à l'inventaire (frame 20 pour la carotte mature)
        this.inventory.addItem('carrotSeed', 20);
        this.inventory.addItem('cornSeed', 62); // Utilise 'carrot' comme type et frame 20
        
        // Supprime la plante
        crop.destroy();
        this.crops = this.crops.filter(c => c !== crop);
    }

    talkToNpc() {
        this.npcs.forEach(npc => npc.update());
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.npcs.forEach(npc => {
                if (npc.isPlayerNear) npc.talk();
            });
        }
    }

    update() {
        if (this.player) this.player.update();
        this.talkToNpc();
        this.animals.forEach(animal => animal.update && animal.update());
    
        // Récupération automatique des ressources proches
        this.droppedResources = this.droppedResources.filter(resource => {
            const playerBounds = this.player.getBounds();
            const resBounds = resource.sprite.getBounds();
    
            if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, resBounds)) {
                this.inventory.addItem(resource.type, resource.frame);
                resource.sprite.destroy();
                return false;
            }
    
            return true;
        });

     
     
        
            // Gestion de la récolte automatique
            this.crops = this.crops.filter(crop => {
                if (!crop.isReady) return true; // Garder si pas mûr
                
                const playerBounds = this.player.getBounds();
                const cropBounds = crop.getBounds();
                
                if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, cropBounds)) {
                    // Ajoute directement à l'inventaire
                    this.inventory.addItem('carrotSeed', 20); // Frame 20 pour carotte mature
                    this.inventory.addItem('cornSeed', 62);
                    crop.destroy();
                    return false; // Retirer de la liste
                }
                return true; // Garder si pas récolté
            });
        
            // ... reste du code existant ...
        
    
        // Gestion de la récolte
        if (Phaser.Input.Keyboard.JustDown(this.actionKey)) {
            // Vérifie d'abord s'il y a une plante à récolter
            const closeCrop = this.crops.find(crop => {
                const playerBounds = this.player.getBounds();
                const cropBounds = crop.getBounds();
                return Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, cropBounds);
            });

            if (closeCrop) {
                this.harvestCrop(closeCrop);
                return;
            }

            // Si pas de plante à récolter, vérifie les arbres à couper
            const axe = this.player.selectedTool === "axe";
    
            if (axe) {
                const closeTree = this.cuttableTrees.find(tree => {
                    const playerBounds = this.player.getBounds();
                    const treeBounds = tree.getBounds();
                    return Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, treeBounds) && !tree.isBeingCut;
                });
    
                if (closeTree) {
                    closeTree.isBeingCut = true;
                    this.player.useSelectedTool();
    
                    this.time.addEvent({
                        delay: 500,
                        repeat: 2,
                        callback: () => {
                            closeTree.hitCount++;
    
                            if (closeTree.hitCount < 3) {
                                this.player.useSelectedTool();
                            }
    
                            if (closeTree.hitCount >= 3) {
                                const wood = this.add.image(closeTree.x, closeTree.y, "ressources", 24);
                                wood.setOrigin(0.5, 1);
                                wood.setDepth(1999);
    
                                this.droppedResources.push({
                                    sprite: wood,
                                    type: "wood",
                                    frame: 24
                                });
    
                                closeTree.destroy();
                            }
    
                            if (closeTree.hitCount === 3) {
                                closeTree.isBeingCut = false;
                            }
                        }
                    });
                } else {
                    this.player.useSelectedTool();
                }
            } else {
                this.player.useSelectedTool();
            }
        }
    }

    
}





