import { Mesh } from "@babylonjs/core";
export default class Keel extends Mesh {
    positionArray: number[];
    /**
     * Override constructor.
     * @warn do not fill.
     */
    constructor();
    /**
     * Called on the scene starts.
     */
    onStart(): void;
    fall(): boolean;
    /**
     * Called each frame.
     */
    onUpdate(): void;
    reset(step: boolean): boolean;
    resetPosition(): void;
}
