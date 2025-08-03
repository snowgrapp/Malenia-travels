import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import { Game } from "./scenes/Game";

export const PhaserGame = forwardRef(function PhaserGame ({ currentActiveScene }, ref)
{
    const game = useRef();

    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        
        if (game.current === undefined)
        {
            game.current = StartGame("game-container");
            
            if (ref !== null)
            {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {

            if (game.current)
            {
                game.current.destroy(true);
                game.current = undefined;
            }

        }
    }, [ref]);

    useEffect(() => {
        EventBus.on('current-scene-ready', (currentScene) => {
            if (ref && ref.current) {
                ref.current.scene = currentScene;
    
                if (currentActiveScene instanceof Function) {
                    currentActiveScene(currentScene);
                }
            } else {
                console.error("Ref is null or undefined when setting the current scene");
            }
        });
    
        return () => {
            EventBus.removeListener('current-scene-ready');
        };
    }, [currentActiveScene, ref]);});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func 
}
