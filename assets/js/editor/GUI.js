if (process.client) {
    var dat = require('dat.gui');
    class GUI extends dat.GUI {
        constructor() {
            super()
        }

        update(target) {
            this.remove();
            this.target = target;
            console.log(this.target)
            this.init();
        }

        remove() {
            if (this.position && this.rotation && this.scale) {
                this.removeFolder(this.position);
                this.removeFolder(this.rotation);
                this.removeFolder(this.scale);
                this.position = this.rotation = this.scale = null
            }
        }

        init() {
            let params = {
                alignOnGrid: () => {
                    this.target.position.y = this.target.scale.y / 2
                }
            }
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

            if (this.target.mesh._type == "Platform") {
                this.scale.add(this.target.scale, 'x').name('x (width)').onChange(() => {
                    this.target.scale.x
                });
            } else {
                this.scale.add(this.target.scale, 'x').name('scale').onChange(() => {
                    this.target.scale.y = this.target.scale.x
                });
            }
            this.position.add(params, 'alignOnGrid')
        }

    }

    var g = new GUI()
}

export default g;