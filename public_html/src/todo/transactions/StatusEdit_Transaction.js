'use strict'

import{jsTPS_Transaction} from "../../common/jsTPS.js"

export default class StatusEdit_Transaction extends jsTPS_Transaction{
    constructor(initModel, initOldStat,initNewStat,initListItem){
        super();
        this.model=initModel;
        this.oldStat=initOldStat;
        this.newStat=initNewStat;
        this.listItem=initListItem;
    }

    doTransaction(){
        this.model.statusEdit(this.listItem, this.newStat);
    }

    undoTransaction(){
        this.model.statusEdit(this.listItem,this.oldStat);
    }
}