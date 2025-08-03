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

        this.tools = [
            { frame: 3, name: "axe", texture: "tool_icons" },
            { frame: 2, name: "pickaxe", texture: "tool_icons" },
            { frame: 6, name: "water", texture: "tool_icons" },
            { frame: 15, name: "carrotSeed", texture: "crops" },
            { frame: 57, name: "cornSeed", texture: "crops" },
            { frame: null, name: "empty3" },
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
                used: tool.frame !== null,
            });
        });
    }

    createIcons() {
        this.tools.forEach((tool, index) => {
            if (tool.frame === null) return;

            const icon = this.scene.add
                .sprite(0, 0, tool.texture, tool.frame)
                .setScrollFactor(0)
                .setScale(1.8)
                .setInteractive({ useHandCursor: true });

            icon.originalIndex = index;
            icon.toolName = tool.name;
            icon.textureKey = tool.texture; // Stocke texture
            icon.frameIndex = tool.frame; // Stocke frame

            icon.on("pointerdown", (pointer) => {
                if (
                    pointer.getDuration() < 300 &&
                    pointer.leftButtonReleased() &&
                    this.scene.inventory.visible
                ) {
                    this.transferToInventory(
                        tool.name,
                        tool.texture,
                        tool.frame,
                        icon
                    );
                } else if (!this.scene.inventory.visible) {
                    this.player.selectTool(tool.name);
                    this.highlightSelected(index);
                }
            });

            this.container.add(icon);
            this.toolIcons.push(icon);
        });
    }

    highlightSelected(selectedIndex) {
        this.toolIcons.forEach((icon) => {
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
        const boxWidth =
            padding * 2 + slotCount * iconSize + (slotCount - 1) * slotSpacing;

        const baseX = (screenWidth - boxWidth) / 2;
        const baseY = screenHeight - boxHeight - marginBottom;

        this.background
            .clear()
            .fillStyle(0x1f1f1f, 0.9)
            .fillRoundedRect(baseX, baseY, boxWidth, boxHeight, borderRadius)
            .lineStyle(2, 0xffffff, 0.3)
            .strokeRoundedRect(baseX, baseY, boxWidth, boxHeight, borderRadius);

        this.tools.forEach((tool, index) => {
            const slotX = baseX + padding + index * (iconSize + slotSpacing);
            const slotY = baseY + padding;

            this.background
                .fillStyle(0x2c2c2c, 0.7)
                .fillRoundedRect(slotX, slotY, iconSize, iconSize, 6)
                .lineStyle(1, 0x999999, 0.5)
                .strokeRoundedRect(slotX, slotY, iconSize, iconSize, 6);

            const icon = this.toolIcons.find(
                (icon) => icon.originalIndex === index
            );
            if (icon) {
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
    }

    transferToInventory(toolName, texture, frame, icon) {
        const inventory = this.scene.inventory;
        if (!inventory.visible) return;

        const emptySlot = inventory.slots.find((s) => !s.used);
        if (!emptySlot) return;

        inventory.addItem(toolName, texture, frame);

        // Supprime l'icône de la toolbox
        this.toolIcons = this.toolIcons.filter((i) => i !== icon);
        this.slots[icon.originalIndex].used = false;
        icon.destroy();
    }
}
