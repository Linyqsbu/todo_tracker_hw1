'use strict'

import{jsTPS_Transaction} from "../../common/jsTPS.js"

export default class MovingItemDown_Transaction extends jsTPS_Transaction{
    constructor(initModel,i){
        super();
        this.model=initModel;
        this.itemIndex=i;
    }

    doTransaction(){
        this.model.moveItemDown(this.itemIndex);
    }

    undoTransaction(){
        this.model.moveItemUp(this.itemIndex+1)
    }
}