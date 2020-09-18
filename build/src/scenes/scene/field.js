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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babylonjs/core");
var tools_1 = require("../tools");
var Field = /** @class */ (function (_super) {
    __extends(Field, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function Field() {
        var _this = this;
        return _this;
    }
    /**
     * Called on the scene starts.
     */
    Field.prototype.onStart = function () {
    };
    /**
     * Called each frame.
     */
    Field.prototype.onUpdate = function () {
        // Nothing to do now...
    };
    Field.prototype.newTurn = function (step) {
        var points = 0;
        this._kells.getChildMeshes(true).forEach(function (keel) {
            if (keel.reset(step)) {
                points++;
            }
        });
        return points;
    };
    __decorate([
        tools_1.fromChildren("keels")
    ], Field.prototype, "_kells", void 0);
    return Field;
}(core_1.TransformNode));
exports.default = Field;
//# sourceMappingURL=field.js.map