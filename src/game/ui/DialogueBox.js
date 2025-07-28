export class DialogueBox {
    constructor(scene) {
        this.scene = scene;
        this.lines = [];
        this.index = 0;
        this.isActive = false;

        this.box = scene.add.graphics().setDepth(1000).setVisible(false);
        this.text = scene.add
            .text(0, 0, "", {
                fontSize: "12px",
                fill: "#ffffff",
                wordWrap: { width: 180 },
            })
            .setDepth(3000)
            .setVisible(false);

        scene.input.on("pointerdown", () => {
            if (this.isActive) this.nextLine();
        });
    }

    start(lines, target) {
        if (this.isActive || !target) return;

        this.lines = lines;
        this.index = 0;
        this.isActive = true;

        const padding = 10;
        const width = 200;
        const height = 60;

        const x = target.x - width / 2;
        const y = target.y - target.height - height - 10;

        this.box.clear();
        this.box.fillStyle(0x000000, 0.8);
        this.box.fillRoundedRect(x, y, width, height, 8);
        this.box.setVisible(true);

        this.text.setPosition(x + padding, y + padding);
        this.text.setText(this.lines[this.index]);
        this.text.setVisible(true);
    }

    nextLine() {
        this.index++;
        if (this.index < this.lines.length) {
            this.text.setText(this.lines[this.index]);
        } else {
            this.end();
        }
    }

    end() {
        this.isActive = false;
        this.box.setVisible(false);
        this.text.setVisible(false);
    }
}

