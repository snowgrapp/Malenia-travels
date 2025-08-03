import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PhaserGame } from "./game/PhaserGame"; // Importez votre jeu Phaser

function App() {
    return (
        <Router>
            <Routes>
              
              

                {/* Route pour le jeu */}
                <Route path="/" element={<PhaserGame />} />
            </Routes>
        </Router>
    );
}

export default App;