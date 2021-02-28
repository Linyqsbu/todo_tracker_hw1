'use strict'

import{jsTPS_Transaction} from "../../common/jsTPS.js"

export default class ListNameEdit_Transaction extends jsTPS_Transaction{
    constructor(initModel, initOldName, initNewName,id){
        super();
        this.model=initModel;
        this.oldName=initOldName;
        this.newName=initNewName;
        this.listId=id;
    }

    doTransaction(){
        this.model.listNameEdit(this.newName, this.listId);
    }

    undoTransaction(){
        this.model.listNameEdit(this.oldName, this.listId);
    }
}