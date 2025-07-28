export class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.visible = false;
        this.container = scene.add.container(0, 0);
        this.container.setDepth(9999);

        this.items = {}; // { wood: { count: 3, icon: Phaser.GameObjects.Image, text: Phaser.GameObjects.Text } }

        this.inventoryBackground = scene.add.rectangle(
            scene.scale.width / 2,
            scene.scale.height / 2,
            300,
            200,
            0x000000,
            0.7
        ).setStrokeStyle(2, 0xffffff);
        this.container.add(this.inventoryBackground);

        this.slots = [];
        const slotSize = 40;
        const padding = 10;
        const cols = 5;
        const rows = 3;
        const startX = this.inventoryBackground.x - (cols * (slotSize + padding)) / 2 + slotSize / 2;
        const startY = this.inventoryBackground.y - (rows * (slotSize + padding)) / 2 + slotSize / 2;

        let slotIndex = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * (slotSize + padding);
                const y = startY + row * (slotSize + padding);

                const slot = scene.add.rectangle(x, y, slotSize, slotSize, 0x333333).setStrokeStyle(1, 0xffffff);
                this.container.add(slot);
                this.slots.push({ x, y, used: false, slotIndex });
                slotIndex++;
            }
        }

        this.container.setVisible(false);
        this.setupInput();
        this.setupDragEvents();
    }

    setupInput() {
        this.scene.input.keyboard.on('keydown-Q', () => this.toggle());
    }

    toggle() {
        this.visible = !this.visible;
        this.container.setVisible(this.visible);
    }

    addItem(type, frame) {
        if (this.items[type]) {
            this.items[type].count += 1;
            this.items[type].text.setText(this.items[type].count);
            return;
        }

        const slot = this.slots.find(s => !s.used);
        if (!slot) return;

        const icon = this.scene.add.image(slot.x, slot.y, "ressources", frame)
            .setScale(2)
            .setInteractive({ draggable: true });
        this.scene.input.setDraggable(icon);

        const countText = this.scene.add.text(slot.x + 10, slot.y + 10, "1", {
            fontSize: "12px",
            color: "#ffffff",
            fontFamily: "Arial",
            stroke: "#000",
            strokeThickness: 2
        }).setOrigin(1);

        this.container.add(icon);
        this.container.add(countText);

        slot.used = true;

        this.items[type] = {
            count: 1,
            icon,
            text: countText,
            slot
        };

        icon.on("pointerdown", (pointer) => {
            if (pointer.getDuration() < 300 && pointer.leftButtonReleased() && this.visible) {
                this.transferToToolBox(type, frame, icon);
            }
        });
    }

    setupDragEvents() {
        this.scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            if (this.visible) {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        });

        this.scene.input.on("dragend", (pointer, gameObject) => {
            // optionnel : snap dans les slots
        });

        this.scene.input.on("drop", (pointer, gameObject) => {
            if (!this.visible) return;

            const type = Object.keys(this.items).find(key => this.items[key].icon === gameObject);
            if (!type) return;

            if (this.scene.toolBox && this.scene.toolBox.container.getBounds().contains(pointer.x, pointer.y)) {
                this.transferToToolBox(type, gameObject.frame.name, gameObject);
            }
        });
    }
    transferToToolBox(type, frame, icon) {
        const toolBox = this.scene.toolBox;
        
        // Trouve un emplacement vide dans la toolbox
        const emptySlotIndex = toolBox.slots.findIndex(s => !s.used);
        if (emptySlotIndex === -1) return;
    
        const toolData = toolBox.tools.find(t => t.name === type);
        if (!toolData) return;
    
        // Crée la nouvelle icône dans la toolbox
        const newIcon = this.scene.add.sprite(0, 0, "tool_icons", frame)
            .setScrollFactor(0)
            .setScale(1.8)
            .setInteractive({ useHandCursor: true, draggable: false });
    
        newIcon.originalIndex = emptySlotIndex;
        newIcon.toolName = type;
    
        newIcon.on("pointerdown", (pointer) => {
            if (pointer.getDuration() < 300 && pointer.leftButtonReleased() && this.visible) {
                this.addItem(type, frame);
                newIcon.destroy();
                toolBox.toolIcons = toolBox.toolIcons.filter(i => i !== newIcon);
                toolBox.slots[emptySlotIndex].used = false;
                toolBox.updatePosition();
            } else if (!this.visible) {
                this.scene.player.selectTool(type);
                toolBox.highlightSelected(emptySlotIndex);
            }
        });
    
        toolBox.container.add(newIcon);
        toolBox.toolIcons.push(newIcon);
        toolBox.slots[emptySlotIndex].used = true;
        toolBox.updatePosition();
    
        // Supprime l'item de l'inventaire
        const item = this.items[type];
        if (item) {
            item.icon.destroy();
            item.text.destroy();
            item.slot.used = false;
            delete this.items[type];
        }
    }
}
