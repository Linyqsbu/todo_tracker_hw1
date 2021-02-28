'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

//THIS TRANSACTION IS FOR DELETING AN ITEM FROM A LIST
export default class DeleteItem_Transaction extends jsTPS_Transaction{
    constructor(initModel,itemToRemove,i){
        super();
        this.model=initModel;
        this.itemRemoved=itemToRemove;
        this.index=i;
    }

    doTransaction(){
        this.model.removeItem(this.itemRemoved);
    }

    undoTransaction(){
        this.model.addItemToCurrentList(this.itemRemoved,this.index);
    }
}
