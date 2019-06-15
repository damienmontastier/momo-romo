import CANNON from 'cannon'

export default class physicParams {
    constructor() {
        // this.addWorld()
        this.world = new CANNON.World();
        this.world.gravity.set(0, -15, 0)

        // Restitution: rebond contactMaterial between two material (coef)
        // angularVelocity : vitesse angulaire (position X, Y, Z) / angularDamping : Freinage angulaire (coef)
        // Velocity : vitesse linéaire (position X, Y, Z) / linearDamping : Freinage Linéaire (coef)
        // contactEquationStiffness : rigidité au contact 1e(exposant)(value), contactEquationRelaxation : détente au contact (value) 
        // connect two bodies with spring (CANNON.Spring)

        // THREE JS
        // type: sphere, box, plane
        // name of the shape
        // r: rayon of the sphere
        // size : size of the shape except sphere
        // pos: position of the shape
        // rotate: rotation of the shape / use it with Math.radians for degrees
        // PHYSIC
        // physic: true or false
        // mass: mass of the shape
        // angularDamping: damping (freinage) angular (coef). Default value : 0
        // linearDamping: damping (freinage) linéaire (coef). Default value : 0

        // this.world.allowSleep = true;
        // this.world.sleepSpeedLimit = .1;
        // this.world.sleepTimeLimit = 1;
        // this.world.defaultContactMaterial.contactEquationStiffness = 1e2;
        // this.world.defaultContactMaterial.contactEquationRelaxation = 10;
        // this.world.defaultContactMaterial.restitution = 0;
        // this.world.defaultContactMaterial.friction = 0.1;
        // this.world.defaultContactMaterial.linearDamping = 1;
    }

    update() {
        this.world.step(1 / 60);
    }
}