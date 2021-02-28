'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

//THIS TRANSACTION IS FOR EDITING THE TASK
export default class TaskEdit_Transaction extends jsTPS_Transaction{
    constructor(initModel, initOldTask, initNewTask, initListItem){
        super();
        this.model=initModel;
        this.oldTask=initOldTask;
        this.newTask=initNewTask;
        this.listItem=initListItem;
    }

    doTransaction(){
        this.model.taskEdit(this.listItem, this.newTask);
    }

    undoTransaction(){
        this.model.taskEdit(this.listItem, this.oldTask);
    }
}