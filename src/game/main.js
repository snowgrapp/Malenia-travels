import { Game } from "./scenes/Game";
import Phaser from "phaser";
import { HomeScene } from "./ui/HomeScene.js";
// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [HomeScene, Game], // Ajoutez HomeScene ici


    parent: "game-container",
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 0 },
        },
    },
    scene: [Game],
};

const StartGame = (parent) => {
    
return new Phaser.Game({ ...config, parent });
};

export default StartGame;