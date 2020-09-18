import { Mesh, InstancedMesh, TransformNode } from "@babylonjs/core";

import { fromChildren } from "../tools";
import Keel from "./keel";

export default class Field extends TransformNode {

    @fromChildren("keels")
    private _kells: TransformNode;

    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    public constructor() {}

    /**
     * Called on the scene starts.
     */
    public onStart(): void {
    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        // Nothing to do now...
    }

    public newTurn(step: boolean): number {

        var points: number = 0;

        this._kells.getChildMeshes(true).forEach(function(keel) {

            if((keel as Keel).reset(step)) {
                
                points++;
            }
        });
        
        return points;
    }
}
