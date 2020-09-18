import { FreeCamera, PointerEventTypes, Mesh, PointerInfo, PhysicsImpostor, Vector3, KeyboardEventTypes } from "@babylonjs/core";
import { TextBlock, AdvancedDynamicTexture, StackPanel} from "@babylonjs/gui";
import { SSL_OP_CRYPTOPRO_TLSEXT_BUG } from "constants";

import { fromChildren, visibleInInspector, onPointerEvent, onKeyboardEvent } from "../tools";

export default class PlayerCamera extends FreeCamera {
    @fromChildren("ball")
    private _ball: Mesh;

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

    private _scoreboard : TextBlock;
    private _scoreboardFirstLine : TextBlock;

    private _nbKeelTouched: number;
    private _turnNumber: number;



    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    private constructor() { }

    /**
     * Called on the scene starts.
     */
    public onStart(): void {
        // For the example, let's configure the keys of the camera using the @visibleInInspector decorator.
        this.keysUp = [this._forwardKey];
        this.keysDown = [this._backwardKey];
        this.keysLeft = [this._strafeLeftKey];
        this.keysRight = [this._strafeRightKey];
        
        var scoreUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        const stackPanel = new StackPanel();
        stackPanel.height = "100%";
        stackPanel.width = "100%";
        stackPanel.verticalAlignment = 0;
        scoreUI.addControl(stackPanel);

        this._scoreboardFirstLine = new TextBlock();
        this._scoreboardFirstLine.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
        this._scoreboardFirstLine.fontSize = "24px";
        this._scoreboardFirstLine.color = "white";
        this._scoreboardFirstLine.resizeToFit = true;
        stackPanel.addControl(this._scoreboardFirstLine);

        this._scoreboard = new TextBlock();
        this._scoreboard.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
        this._scoreboard.fontSize = "18px";
        this._scoreboard.color = "white";
        this._scoreboard.resizeToFit = true;
        stackPanel.addControl(this._scoreboard);

        this._nbKeelTouched = 0;
        this._turnNumber = 1;
    
    }

    public scoreUpdate() : void{
        if(this._turnNumber == 1) {
            this._scoreboard.text = "[ "+this._nbKeelTouched;
            this._scoreboardFirstLine.text = "1";
    }
        else if (this._turnNumber % 2 == 0)
            this._scoreboard.text = this._scoreboard.text + " | "+ this._nbKeelTouched + " ] ";
        else {
        this._scoreboardFirstLine.text = this._scoreboardFirstLine.text + "       " + (Math.round(this._turnNumber/2));
        this._scoreboard.text = this._scoreboard.text + "[ "+ this._nbKeelTouched;
        }
    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        
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

        // if (this._ball.instances.length == 0) {

        // Create a new ball instance
        const ballInstance = this._ball.createInstance("ballInstance");

        ballInstance.position.copyFrom(this._ball.getAbsolutePosition());

        // Create physics impostor for the ball instance
        ballInstance.physicsImpostor = new PhysicsImpostor(ballInstance, PhysicsImpostor.SphereImpostor, { mass: 5, friction: 0.2, restitution: 0.8 });

        // Apply impulse on ball
        const force = this.getDirection(new Vector3(0, 0, 1)).multiplyByFloats(this._ballForceFactor, this._ballForceFactor, this._ballForceFactor);
        ballInstance.applyImpulse(force, ballInstance.getAbsolutePosition());
        this.scoreUpdate();
        ++this._turnNumber;
        // }
    }
}
