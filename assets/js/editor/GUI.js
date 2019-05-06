if (process.client) {
    var dat = require('dat.gui');
    class GUI extends dat.GUI {
        constructor() {
            super()
        }

        update(target) {
            this.remove();
            this.target = target;
            this.init();
        }

        remove() {
            if (this.position && this.rotation && this.scale) {
                this.removeFolder(this.position);
                this.removeFolder(this.rotation);
                this.removeFolder(this.scale);
                this.position = this.rotation = this.scale = null
            }
            if (this.checkpoint && this.target.mesh._type == "FixedProp") {
                this.removeFolder(this.checkpoint)
                this.checkpoint = null
            }
        }

        init() {
            this._params = {
                animated: this.target.checkpointAnimate,
                minigame: this.target.checkpointMinigame,
            };

            this.position = this.addFolder('position');
            this.position.open();
            this.position.add(this.target.position, 'x');
            this.position.add(this.target.position, 'y');
            this.position.add(this.target.position, 'z');

            this.rotation = this.addFolder('rotation');
            this.rotation.open();
            // this.rotation.add(this.target.rotation,'x');
            // this.rotation.add(this.target.rotation,'y');
            this.rotation.add(this.target.rotation, 'z');

            this.scale = this.addFolder('scale');
            this.scale.open();

            if (this.target.mesh._type == "FixedProp") {
                this.checkpoint = this.addFolder("Checkpoint");
                this.checkpoint.open();
                this.checkpoint.add(this._params, 'animated').name("animated").onChange((value) => {
                    this.target.checkpointAnimate = value
                });
                
                this.checkpoint.add(this._params, 'minigame').name("minigame").onChange((value) => {
                    this.target.checkpointMinigame = value
                });;

                this.scale.add(this.target.scale, 'x').name('scale').onChange(() => {
                    this.target.scale.y = this.target.scale.x
                });
            } else if (this.target.mesh._type == "Platform") {
                this.scale.add(this.target.scale, 'x').name('x (width)').onChange(() => {
                    this.target.scale.x
                });
            }
        }
    }

    var g = new GUI()
}

export default g;