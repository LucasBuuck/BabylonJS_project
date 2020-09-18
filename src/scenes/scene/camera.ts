import { FreeCamera, PointerEventTypes, Mesh, PointerInfo, PhysicsImpostor, Vector3, KeyboardEventTypes, InstancedMesh } from "@babylonjs/core";
import { TextBlock, AdvancedDynamicTexture, StackPanel} from "@babylonjs/gui";
import { SSL_OP_CRYPTOPRO_TLSEXT_BUG } from "constants";

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
    public pointsOfPreviousTurn: number;
    public pointsTotal: number;

    private _scoreboard : TextBlock;
    private _scoreboardFirstLine : TextBlock;
    private _turnNumber: number;
    private scoreUI: AdvancedDynamicTexture;
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
        
        this.scoreUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        const stackPanel = new StackPanel();
        stackPanel.height = "100%";
        stackPanel.width = "100%";
        stackPanel.verticalAlignment = 0;
        this.scoreUI.addControl(stackPanel);

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

        this._turnNumber = 1;
        this.pointsOfPreviousTurn = 0;
        this.pointsTotal = 0;
    
    }

    public scoreUpdate() : void{
        if(this._turnNumber == 1) {
            this._scoreboard.text = "[ "+this.pointsOfTurn;
            this._scoreboardFirstLine.text = "1";
            this.pointsOfPreviousTurn = this.pointsOfTurn;
    }
        else if (this._turnNumber % 2 == 0)
        {
            this._scoreboard.text = this._scoreboard.text + " | "+ (this.pointsOfTurn - this.pointsOfPreviousTurn) + " ] ";
            this.pointsOfPreviousTurn = 0;
            this.pointsTotal += this.pointsOfTurn;
        }
        else {
        this._scoreboardFirstLine.text = this._scoreboardFirstLine.text + "       " + (Math.round(this._turnNumber/2));
        this._scoreboard.text = this._scoreboard.text + "[ "+ this.pointsOfTurn;
        this.pointsOfPreviousTurn = this.pointsOfTurn;
        }
    }

    private finalScoreDisplay() : void{

        var finalscore = new TextBlock();
         finalscore.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
         finalscore.fontSize = "18px";
         finalscore.color = "white";
         finalscore.resizeToFit = true;
         finalscore.text = "FIN DE PARTIE : \n SCORE : " + this.pointsTotal;
        this.scoreUI.addControl(finalscore);

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
        if(this._turnNumber == 21){
            this.finalScoreDisplay();
        }
        else {
        if (!this.gunMagazine[0]) this.gunMagazine[0] = null;
        
        // Create a new ball instance,
        if (this.gunMagazine[0] == null) {

            this.gunMagazine[0] = this._ball.createInstance("ballInstance");
            setTimeout(() => {

                setTimeout(() => { 

                    console.log(this._turnNumber);
                    console.log(this._turnNumber % 2);
                    this.pointsOfTurn = this.field.newTurn(this._turnNumber % 2 == 0); 
                    this.scoreUpdate();
                    ++this._turnNumber;
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
}
