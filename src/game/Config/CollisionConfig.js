// Fonction pour configurer les collisions dans la scène entre le joueur, les animaux et les objets du calque "Collision"
export const setupCollisions = (scene, player, animals) => {
   
   // Récupère le calque d’objets nommé "Collision" depuis la carte Tiled
    const collisionLayer = scene.map.getObjectLayer("Collision");
   

    // Crée un groupe d’objets statiques pour gérer les collisions
    const colliders = scene.physics.add.staticGroup();

    // Parcourt tous les objets du calque "Collision"
    collisionLayer.objects.forEach((object) => {
        // Crée un rectangle (collider) à la position de l’objet, centré, avec une taille légèrement réduite
        const collider = scene.add.rectangle(
            object.x + object.width / 2,
            object.y + object.height / 2,
            object.width - 2,
            object.height - 2
        );

        // Active la physique sur le rectangle, en tant qu’objet statique
        scene.physics.add.existing(collider, true);

        // Définit manuellement la taille de la hitbox du collider
        collider.body.setSize(object.width - 2, object.height - 2);


        // Ajoute le collider au groupe des colliders statiques
        colliders.add(collider);
    });

 

    // Active la collision entre le joueur et les colliders
    scene.physics.add.collider(player, colliders);



    // Parcourt tous les animaux
    animals.forEach((animal) => {
        if (animal?.sprite) {
            // Affiche la hitbox de chaque animal pour le debug
            animal.sprite.body.debugShowBody = true;

            // Gère la collision entre l’animal et les colliders statiques
            scene.physics.add.collider(animal.sprite, colliders, () => {
                animal.sprite.body.setVelocity(0); // Arrête le mouvement de l’animal s’il touche un obstacle
            });

            // Gère la collision entre l’animal et le joueur
            scene.physics.add.collider(animal.sprite, player);
        } 
    });
};
