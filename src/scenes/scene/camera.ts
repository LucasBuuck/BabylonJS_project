import { FreeCamera, PointerEventTypes, Mesh, PointerInfo, PhysicsImpostor, Vector3, KeyboardEventTypes, InstancedMesh, TransformNode } from "@babylonjs/core";

import { fromChildren, visibleInInspector, onPointerEvent, onKeyboardEvent, fromScene } from "../tools";
import Field from "./field";

export default class PlayerCamera extends FreeCamera {
    @fromChildren("ball")
    private _ball: Mesh;

    @fromScene("field")
    private field: Field;

    public gunMagazine: InstancedMesh[];

    @visibleInInspector("KeyMap", "Forward Key", "z".charCodeAt(0))
    private _forwardKey: number;

    @visibleInInspector("KeyMap", "Backward Key", "s".charCodeAt(0))
    private _backwardKey: number;

    @visibleInInspector("KeyMap", "Strafe Left Key", "q".charCodeAt(0))
    private _strafeLeftKey: number;

    @visibleInInspector("KeyMap", "Strafe Right Key", "d".charCodeAt(0))
    private _strafeRightKey: number;

    @visibleInInspector("number", "Ball Force Factor", 1)
    private _ballForceFactor: number;

    public pointsOfTurn: number;

    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    private constructor() {}

    /**
     * Called on the scene starts.
     */
    public onStart(): void {
        // For the example, let's configure the keys of the camera using the @visibleInInspector decorator.
        this.keysUp = [this._forwardKey];
        this.keysDown = [this._backwardKey];
        this.keysLeft = [this._strafeLeftKey];
        this.keysRight = [this._strafeRightKey];

        this.gunMagazine = [null];
    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        // Nothing to do now...
    }

    /**
     * Called on the user clicks on the canvas.
     * Used to request pointer lock and launch a new ball.
     */
    @onPointerEvent(PointerEventTypes.POINTERDOWN, false)
    private _onPointerEvent(info: PointerInfo): void {
        this._enterPointerLock();
        this._launchBall(info);
    }

    /**
     * Called on the escape key (key code 27) is up.
     * Used to exit pointer lock.
     */
    @onKeyboardEvent([27], KeyboardEventTypes.KEYUP)
    private _onEscapeKey(): void {
        const engine = this.getEngine();
        if (engine.isPointerLock) {
            engine.exitPointerlock();
        }
    }

    /**
     * Requests the pointer lock.
     */
    private _enterPointerLock(): void {
        const engine = this.getEngine();
        if (!engine.isPointerLock) {
            engine.enterPointerlock();
        }
    }

    /**
     * Launches a new ball from the camera position to the camera direction.
     */
    private _launchBall(info: PointerInfo): void {

        if (!this.gunMagazine[0]) this.gunMagazine[0] = null;
        
        // Create a new ball instance,
        if (this.gunMagazine[0] == null) {

            this.gunMagazine[0] = this._ball.createInstance("ballInstance");
            setTimeout(() => {

                setTimeout(() => { 

                    this.pointsOfTurn = this.field.newTurn(true); 
                    console.log(this.pointsOfTurn);
                }, 1000);
                // add next
                setTimeout(() => {
                    this.gunMagazine[0].dispose();
                    this.gunMagazine[0] = null;
                }, 1000);
            }, 5000);

            this.gunMagazine[0].position.copyFrom(this._ball.getAbsolutePosition());

            // Create physics impostor for the ball instance
            this.gunMagazine[0].physicsImpostor = new PhysicsImpostor(this.gunMagazine[0], PhysicsImpostor.SphereImpostor, { mass: 5, friction: 0.2, restitution: 0.8 });

            // Apply impulse on ball
            const force = this.getDirection(new Vector3(0, 0, 1)).multiplyByFloats(this._ballForceFactor, this._ballForceFactor, this._ballForceFactor);
            this.gunMagazine[0].applyImpulse(force, this.gunMagazine[0].getAbsolutePosition());

        }
    }
}
