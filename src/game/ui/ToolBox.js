export class ToolBox {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        this.container = scene.add.container();
        this.container.setScrollFactor(0);
        this.container.setDepth(9999);

        this.background = scene.add.graphics();
        this.container.add(this.background);

        this.toolIcons = [];
        this.slots = [];

        // Outils disponibles dans la toolbox
        this.tools = [
            { frame: 3, name: "axe", texture: "tool_icons" },
            { frame: 2, name: "pickaxe", texture: "tool_icons" },
            { frame: 6, name: "water", texture: "tool_icons" },
            { frame: 15, name: "carrotSeed", texture: "crops" }, // Graines de carotte (frame 16 de crops.png)
            { frame: 57, name: "cornSeed", texture: "crops" },
            { frame: null, name: "empty3" }
        ];

        this.createSlots();
        this.createIcons();
        this.updatePosition();

        scene.scale.on("resize", this.updatePosition.bind(this));

        this.setupDragEvents();
    }

    createSlots() {
        this.tools.forEach((tool, index) => {
            this.slots.push({
                x: 0,
                y: 0,
                index: index,
                used: tool.frame !== null
            });
        });
    }

    createIcons() {
        this.tools.forEach((tool, index) => {
            if (tool.frame === null) return;
    
            const icon = this.scene.add.sprite(0, 0, tool.texture || "tool_icons", tool.frame)
                .setScrollFactor(0)
                .setScale(tool.name === "carrotSeed" ? 1.2 : 1.8)
                .setScale(tool.name === "cornSeed" ? 1.2 : 1.8)
                .setInteractive({ useHandCursor: true, draggable: false });
    
            icon.originalIndex = index;
            icon.toolName = tool.name;
    
            icon.on("pointerdown", (pointer) => {
                if (pointer.getDuration() < 300 && pointer.leftButtonReleased() && this.scene.inventory.visible) {
                    this.transferToInventory(tool.name, tool.frame, icon);
                } else if (!this.scene.inventory.visible) {
                    this.player.selectTool(tool.name);
                    this.highlightSelected(index);
                    // On ne plante pas directement ici, c'est la touche Z qui le fera
                }
            });
    
            this.container.add(icon);
            this.toolIcons.push(icon);
        });
    }

    highlightSelected(selectedIndex) {
        this.toolIcons.forEach((icon, index) => {
            icon.setAlpha(icon.originalIndex === selectedIndex ? 1 : 0.5);
        });
    }

    updatePosition() {
        const screenWidth = this.scene.sys.game.config.width;
        const screenHeight = this.scene.sys.game.config.height;
    
        const iconSize = 48;
        const slotSpacing = 12;
        const padding = 16;
        const borderRadius = 12;
        const boxHeight = iconSize + padding * 2;
        const marginBottom = 20;
    
        const slotCount = this.tools.length;
        const boxWidth = padding * 2 + (slotCount * iconSize) + ((slotCount - 1) * slotSpacing);
    
        const baseX = (screenWidth - boxWidth) / 2;
        const baseY = screenHeight - boxHeight - marginBottom;
    
        // Dessine le fond général
        this.background.clear()
            .fillStyle(0x1f1f1f, 0.9)
            .fillRoundedRect(baseX, baseY, boxWidth, boxHeight, borderRadius)
            .lineStyle(2, 0xffffff, 0.3)
            .strokeRoundedRect(baseX, baseY, boxWidth, boxHeight, borderRadius);
    
        // Dessine chaque case et place l'icône
        this.tools.forEach((tool, index) => {
            const slotX = baseX + padding + index * (iconSize + slotSpacing);
            const slotY = baseY + padding;
    
            this.background
                .fillStyle(0x2c2c2c, 0.7)
                .fillRoundedRect(slotX, slotY, iconSize, iconSize, 6)
                .lineStyle(1, 0x999999, 0.5)
                .strokeRoundedRect(slotX, slotY, iconSize, iconSize, 6);
    
            const icon = this.toolIcons.find(icon => icon.originalIndex === index);
            if (icon) {
                icon.setScale(1.6);
                icon.x = slotX + iconSize / 2;
                icon.y = slotY + iconSize / 2;
            }
    
            this.slots[index].x = slotX + iconSize / 2;
            this.slots[index].y = slotY + iconSize / 2;
        });
    }

    setupDragEvents() {
        this.scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            if (this.scene.inventory.visible) {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        });

        this.scene.input.on("dragend", (pointer, gameObject) => {
            const inventory = this.scene.inventory;
            const toolboxBounds = this.container.getBounds();
            const invBounds = inventory.container.getBounds();

            const toolName = Object.keys(inventory.items).find(
                key => inventory.items[key].icon === gameObject
            );

            if (invBounds.contains(pointer.x, pointer.y)) return;

            if (toolboxBounds.contains(pointer.x, pointer.y) && toolName) {
                const item = inventory.items[toolName];
                if (item) {
                    item.icon.destroy();
                    item.text.destroy();
                    const slot = inventory.slots.find(s => s.x === item.icon.x && s.y === item.icon.y);
                    if (slot) slot.used = false;
                    delete inventory.items[toolName];

                    const toolIndex = this.tools.findIndex(t => t.name === toolName);
                    const emptySlotIndex = this.slots.findIndex(s => !s.used);
                    
                    if (emptySlotIndex !== -1) {
                        const icon = this.scene.add.sprite(0, 0, "tool_icons", this.tools[toolIndex].frame)
                            .setScrollFactor(0)
                            .setScale(1.8)
                            .setInteractive({ useHandCursor: true, draggable: false });

                        icon.originalIndex = emptySlotIndex;
                        icon.toolName = toolName;

                        icon.on("pointerdown", (pointer) => {
                            if (pointer.getDuration() < 300 && pointer.leftButtonReleased() && this.scene.inventory.visible) {
                                this.transferToInventory(toolName, this.tools[toolIndex].frame, icon);
                            } else if (!this.scene.inventory.visible) {
                                this.player.selectTool(toolName);
                                this.highlightSelected(emptySlotIndex);
                            }
                        });

                        this.toolIcons.push(icon);
                        this.container.add(icon);
                        this.slots[emptySlotIndex].used = true;
                        this.updatePosition();
                    }
                }
            } else {
                this.updatePosition();
            }
        });
    }

    transferToInventory(toolName, frame, icon) {
        const inventory = this.scene.inventory;
        if (!inventory.visible) return;

        const emptySlot = inventory.slots.find(s => !s.used);
        if (!emptySlot) return;

        const iconImg = this.scene.add.image(emptySlot.x, emptySlot.y, "tool_icons", frame)
            .setScale(2)
            .setInteractive({ draggable: true });
        this.scene.input.setDraggable(iconImg);

        const countText = this.scene.add.text(emptySlot.x + 10, emptySlot.y + 10, "1", {
            fontSize: "12px",
            color: "#ffffff",
            fontFamily: "Arial",
            stroke: "#000",
            strokeThickness: 2
        }).setOrigin(1);

        inventory.container.add(iconImg);
        inventory.container.add(countText);

        iconImg.on("pointerdown", (pointer) => {
            if (pointer.getDuration() < 300 && pointer.leftButtonReleased() && inventory.visible) {
                this.scene.inventory.transferToToolBox(toolName, frame, iconImg);
            }
        });

        inventory.items[toolName] = {
            count: 1,
            icon: iconImg,
            text: countText,
            slot: emptySlot
        };

        emptySlot.used = true;

        // Supprime l'icône de la toolbox
        this.toolIcons = this.toolIcons.filter(i => i !== icon);
        this.slots[icon.originalIndex].used = false;
        icon.destroy();
    }
}