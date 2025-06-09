// Importation des classes représentant les entités spécifiques
import { Chicken } from "../entities/Animals/Chicken/chicken.js";
import { Cow } from "../entities/Animals/Cow/cow.js";
import { Max } from "../entities/Npc/Max/max.js";

// Fonction de configuration des NPCs et animaux dans la scène
export const setupNPCs = (scene) => {
  // Récupération du calque "Npc" depuis la carte Tiled
  const npcLayer = scene.map.getObjectLayer("Npc");

  // Tableaux pour stocker les animaux et les NPCs instanciés
  const animals = [];
  const npcs = [];

  // Vérifie que le calque est bien défini et contient une liste d’objets
  if (npcLayer && npcLayer.objects && Array.isArray(npcLayer.objects)) {
    npcLayer.objects.forEach((object) => {
      // Récupère les propriétés personnalisées de l’objet (depuis Tiled)
      const props = object.properties || [];

      // Cherche la propriété "type" dans les propriétés
      const typeProp = props.find((p) => p.name === "type");

      // Détermine le type de l’objet : soit depuis la propriété, soit depuis le nom
      const type = typeProp?.value || object.name;

      // Instancie l’objet selon son type, puis le stocke dans le tableau correspondant
      if (type === "Chicken") {
        animals.push(new Chicken(scene, object.x, object.y)); // Ajoute une poule
      } else if (type === "cow") {
        animals.push(new Cow(scene, object.x, object.y)); // Ajoute une vache
      } else if (type === "max") {
        npcs.push(new Max(scene, object.x, object.y)); // Ajoute un NPC nommé Max
      }
    });
  }

  // Retourne les listes d’animaux et de NPCs instanciés pour usage ultérieur
  return { animals, npcs };
};
