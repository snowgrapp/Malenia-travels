export class Time {
  constructor(scene) {
    this.scene = scene;

    // Container positionné en haut à droite, décalé de 10px des bords
    this.container = scene.add.container(scene.scale.width - 10, 10);
    this.container.setScrollFactor(0);
    this.container.setDepth(9999);

    // Fond graphique (rect arrondi)
    this.background = scene.add.graphics();
    this.container.add(this.background);

    // Texte affichant date et heure
    this.timeText = scene.add.text(0, 0, "", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
      align: "right"
    });
    this.timeText.setOrigin(1.1, -0.2); // align à droite, top
    this.container.add(this.timeText);

    this.updatePosition();
    scene.scale.on("resize", this.updatePosition, this);

    // Mise à jour chaque seconde
    this.timer = scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.updateTime,
      callbackScope: this
    });

    this.updateTime();
  }

  updateTime() {
    const now = new Date();

    // Format heure : HH:mm:ss
    const timeStr = now.toLocaleTimeString("fr-FR", { hour12: false });

    // Format date : jour mois année
    const dateStr = now.toLocaleDateString("fr-FR", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    this.timeText.setText(`${timeStr}\n${dateStr}`);

    // Met à jour le fond en fonction de la taille du texte
    this.background.clear();
    const padding = 8;
    const w = this.timeText.width + padding * 2;
    const h = this.timeText.height + padding * 2;
    this.background.fillStyle(0x1f1f1f, 0.8);
    this.background.fillRoundedRect(-w, 0, w, h, 10);
    this.background.lineStyle(2, 0xffffff, 0.3);
    this.background.strokeRoundedRect(-w, 0, w, h, 10);
  }

  updatePosition() {
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;

    // Position top-right avec 10px margin
    this.container.x = w - 30;
    this.container.y = 10;
  }

  destroy() {
    this.timer.remove();
    this.container.destroy(true);
  }
}
