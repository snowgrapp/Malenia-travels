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

        this.tools = [
            { frame: 3, name: "axe" },
            { frame: 2, name: "pickaxe" },
            { frame: 6, name: "water" }
        ];

        this.createIcons();
        this.updatePosition();

        scene.scale.on("resize", this.updatePosition.bind(this));
    }

    createIcons() {
        this.tools.forEach((tool, index) => {
            const icon = this.scene.add.sprite(0, 0, "tool_icons", tool.frame)
                .setScrollFactor(0)
                .setScale(1.8)
                .setInteractive({ useHandCursor: true });

            icon.on("pointerdown", () => {
                this.player.selectTool(tool.name);
                this.highlightSelected(index);
            });

            this.container.add(icon);
            this.toolIcons.push(icon);
        });
    }

    highlightSelected(selectedIndex) {
        this.toolIcons.forEach((icon, index) => {
            icon.setAlpha(index === selectedIndex ? 1 : 0.5);
        });
    }

    updatePosition() {
        const screenWidth = this.scene.sys.game.config.width;
        const screenHeight = this.scene.sys.game.config.height;

        const iconSize = 60;
        const padding = 10;
        const marginBottom = 5;
        const boxHeight = 70;

        const boxWidth = this.tools.length * iconSize + padding * 2;
        const baseX = (screenWidth / 2) - (boxWidth / 2);
        const baseY = screenHeight - boxHeight - marginBottom;

        this.background.clear()
            .fillStyle(0x333333, 0.8)
            .fillRoundedRect(baseX, baseY, boxWidth, boxHeight, 10)
            .lineStyle(2, 0xFFFFFF, 1)
            .strokeRoundedRect(baseX, baseY, boxWidth, boxHeight, 10);

        this.toolIcons.forEach((icon, index) => {
            icon.x = baseX + padding + (index * iconSize) + (iconSize / 2);
            icon.y = baseY + (boxHeight / 2);
        });
    }
}
