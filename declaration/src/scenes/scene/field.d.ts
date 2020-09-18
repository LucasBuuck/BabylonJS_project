import { TransformNode } from "@babylonjs/core";
export default class Field extends TransformNode {
    private _kells;
    /**
     * Override constructor.
     * @warn do not fill.
     */
    constructor();
    /**
     * Called on the scene starts.
     */
    onStart(): void;
    /**
     * Called each frame.
     */
    onUpdate(): void;
    newTurn(step: boolean): number;
}
