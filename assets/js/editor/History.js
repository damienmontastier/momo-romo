import ArrowsHelper from '../objects/ArrowsHelper';

class History{
    constructor() {
        this.list= []
        this.current = 0
    }

    push(o) {
        this.list.push(o)
        this.current = 0
    }

    undo() {
        if(this.current<this.list.length){

            this.current+= 1
            let command = this.command
            switch (this.command.name) {
                case 'moved':
                    command.target.position.copy(command.copy.position)
                    command.target.rotation.copy(command.copy.rotation)

                    ArrowsHelper.edited = false;
                    ArrowsHelper.update()
                    break;
                case 'deleted':
                    console.log('restore')
                    command.target.visible = true
                    ArrowsHelper.setTarget(command.target)
                    break;
                default:
                    break;
            }
            
        }
    }

    get command() {
        return this.list[(this.list.length)-this.current]
    }

    redo() {
        // console.log('redo')
        // if(this.current>0){
        //     this.current-= 1
        //     console.log(this.current,this.command)
        //     let command = this.list[(this.list.length-1)-this.current]
        //     command.target.position.copy(command.copy.position)

        //     ArrowsHelper.edited = false;
        //     ArrowsHelper.update()
        // }
    }
}

export default new History()