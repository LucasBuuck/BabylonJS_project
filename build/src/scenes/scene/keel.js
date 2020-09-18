"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babylonjs/core");
var Keel = /** @class */ (function (_super) {
    __extends(Keel, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function Keel() {
        var _this = this;
        return _this;
    }
    /**
     * Called on the scene starts.
     */
    Keel.prototype.onStart = function () {
        this.physicsImpostor = this._scene.getPhysicsEngine().getImpostorForPhysicsObject(this);
        this.positionArray = [this.position.x, this.position.y, this.position.z];
    };
    Keel.prototype.fall = function () {
        if (Math.abs(this.position.x - this.positionArray[0]) > 0.5 || Math.abs(this.position.z - this.positionArray[2]) > 0.5) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Called each frame.
     */
    Keel.prototype.onUpdate = function () {
        // Nothing to do now...
    };
    Keel.prototype.reset = function (step) {
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
    };
    Keel.prototype.resetPosition = function () {
        this.setEnabled(true);
        this.position.x = this.positionArray[0];
        this.position.y = this.positionArray[1];
        this.position.z = this.positionArray[2];
        this.rotationQuaternion = core_1.Quaternion.Identity();
        this.physicsImpostor.setLinearVelocity(core_1.Vector3.Zero());
        this.physicsImpostor.setAngularVelocity(core_1.Vector3.Zero());
    };
    return Keel;
}(core_1.Mesh));
exports.default = Keel;
//# sourceMappingURL=keel.js.map