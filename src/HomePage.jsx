// //import React from "react";
// import { useNavigate } from "react-router-dom";

// export const HomePage = () => {
//     const navigate = useNavigate();

//     const handleStartGame = () => {
//         navigate("/game"); // Redirige vers la route du jeu
//     };

//     return (
//         <div
//             style={{
//                 display: "flex", // Utilisation de flexbox pour centrer
//                 flexDirection: "column", // Aligne les éléments verticalement
//                 justifyContent: "center", // Centre verticalement
//                 alignItems: "center", // Centre horizontalement
//                 height: "100vh", // Prend toute la hauteur de l'écran
//                 backgroundImage: "url('/assets/Home.png')", // Chemin de l'image
//                 backgroundSize: "cover", // L'image couvre tout l'écran
//                 backgroundPosition: "center", // Centrer l'image
//                 fontFamily: "'Jersey 20', sans-serif", // Applique la police Jersey 20
//             }}
//         >
//             <h1
//                 style={{
//                     color: "white",
//                     fontSize: "4rem", // Taille du texte beaucoup plus grande
//                     marginBottom: "20px", // Espacement entre le titre et le bouton
//                     textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)", // Ajout d'une ombre pour le texte
//                 }}
//             >
//                 Malenia Travels
//             </h1>
//             <button
//                 onClick={handleStartGame}
//                 style={{
//                     padding: "20px 40px", // Bouton plus grand
//                     fontSize: "2rem", // Texte du bouton plus grand
//                     backgroundColor: "rgba(0, 0, 0, 0.7)", // Fond semi-transparent
//                     color: "white",
//                     border: "none",
//                     borderRadius: "10px", // Bordures arrondies plus visibles
//                     cursor: "pointer", // Curseur en forme de main
//                     boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Ajout d'une ombre au bouton
//                     fontFamily: "'Jersey 20', sans-serif", // Applique la police Jersey 20 au bouton
//                 }}
//             >
//                 Nouvelle Partie
//             </button>
//         </div>
//     );
// };