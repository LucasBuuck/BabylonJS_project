import { Mesh, Quaternion, Vector3} from "@babylonjs/core";

export default class Keel extends Mesh {

    public positionArray: number[];

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

        this.physicsImpostor = this._scene.getPhysicsEngine().getImpostorForPhysicsObject(this);
        this.positionArray = [this.position.x, this.position.y, this.position.z];
    }

    public fall(): boolean {

        if(Math.abs(this.position.x - this.positionArray[0]) > 0.5 || Math.abs(this.position.z - this.positionArray[2]) > 0.5) {

            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        // Nothing to do now...
    }

    public reset(step: boolean): boolean {

        if (!step) {

            if (!this.fall()) {

                this.resetPosition();
                return false;
            }
            else {

                this.setEnabled(false);
                return true;
            }
        }
        else {

            if (this.isEnabled) {

                if (!this.fall()) {

                    this.resetPosition();
                    return false;
                }
            }
            this.resetPosition();
            return true;
        }

    }

    public resetPosition(): void {

        this.setEnabled(true);
        this.position.x = this.positionArray[0];
        this.position.y = this.positionArray[1];
        this.position.z = this.positionArray[2];
        this.rotationQuaternion = Quaternion.Identity();

        this.physicsImpostor.setLinearVelocity(Vector3.Zero());
        this.physicsImpostor.setAngularVelocity(Vector3.Zero());
    }
}
