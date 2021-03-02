'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction.js'
import TaskEdit_Transaction from './transactions/TaskEdit_Transaction.js'
import DueDateEdit_Transaciton from './transactions/DueDateEdit_Transaction.js'
import DueDateEdit_Transaction from './transactions/DueDateEdit_Transaction.js'
import StatusEdit_Transaction from './transactions/StatusEdit_Transaction.js'
import MovingItemUp_Transaction from './transactions/MovingItemUp_Transaction.js'
import MovingItemDown_Transaction from './transactions/MovingItemDown_Transaction.js'
import ListNameEdit_Transaction from './transactions/ListNameEdit_Transaction.js'

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;

        this.isListClosed=true;

    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd,i) {
        this.currentList.items.splice(i,0,itemToAdd);
        this.view.viewList(this.currentList);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        if(this.currentList!=null){
            let transaction = new AddNewItem_Transaction(this);
            this.tps.addTransaction(transaction);
            this.view.refreshUndoRedo(this.tps.hasTransactionToUndo(),this.tps.hasTransactionToRedo())
        }
    }

    /**
     * deleteItemTransaction
     * 
     * Creates a new transaction for deleting an item
     * @param {*} itemToRemove  the item to be removed
     * @param {*} i index of the removed item
     */
    deleteItemTransaction(itemToRemove,i){
        let transaction=new DeleteItem_Transaction(this, itemToRemove,i);
        this.tps.addTransaction(transaction);
        this.view.refreshUndoRedo(this.tps.hasTransactionToUndo(),this.tps.hasTransactionToRedo())
    }


    /**
     * taskEditTransaction 
     * 
     * Creates a new transaction for editing the description of an item
     * @param {} item 
     * @param {*} oldTask 
     * @param {*} newTask 
     */
    taskEditTransaction(item, oldTask, newTask){
        let transaction=new TaskEdit_Transaction(this,oldTask,newTask,item);
        this.tps.addTransaction(transaction);
        this.view.refreshUndoRedo(this.tps.hasTransactionToUndo(),this.tps.hasTransactionToRedo())
    }

    taskEdit(item, newTask){
        item.setDescription(newTask);
        this.view.viewList(this.currentList);
    }

    dueDateEditTransaction(item,oldDate,newDate){
        let transaction=new DueDateEdit_Transaction(this,oldDate,newDate,item);
        this.tps.addTransaction(transaction);
        this.view.refreshUndoRedo(this.tps.hasTransactionToUndo(),this.tps.hasTransactionToRedo())
    }

    dueDateEdit(item,date){
        item.setDueDate(date);
        this.view.viewList(this.currentList);
    }

    statusEditTransaction(item,oldStat,newStat){
        let transaction=new StatusEdit_Transaction(this,oldStat,newStat,item);
        this.tps.addTransaction(transaction);
        this.view.refreshUndoRedo(this.tps.hasTransactionToUndo(),this.tps.hasTransactionToRedo())
    }

    statusEdit(item,status){
        item.setStatus(status);
        this.view.viewList(this.currentList);
    }

    moveItemUpTransaction(i){
        let transaction=new MovingItemUp_Transaction(this,i);
        this.tps.addTransaction(transaction);
        this.view.refreshUndoRedo(this.tps.hasTransactionToUndo(),this.tps.hasTransactionToRedo())
    }

    moveItemUp(i){
        let temp=this.currentList.items[i];
        this.currentList.items[i]=this.currentList.items[i-1];
        this.currentList.items[i-1]=temp;
        this.view.viewList(this.currentList);
    }


    moveItemDownTransaction(i){
        let transaction=new MovingItemDown_Transaction(this,i);
        this.tps.addTransaction(transaction);
        this.view.refreshUndoRedo(this.tps.hasTransactionToUndo(),this.tps.hasTransactionToRedo())
    }

    moveItemDown(i){
        let temp=this.currentList.items[i+1];
        this.currentList.items[i+1]=this.currentList.items[i];
        this.currentList.items[i]=temp;
        this.view.viewList(this.currentList);
    }

    closeList(){
        this.view.refreshLists(this.toDoLists);
        this.currentList=null;
        this.view.clearItemsList();
        this.tps.clearAllTransactions();
        let header=document.getElementById('todo-list-header-card');
        let buttons=header.getElementsByClassName('list-item-control');
        this.view.deactivateListControl(buttons);
        this.view.refreshUndoRedo(false,false);
        let addList=document.getElementById('add-list-button');
        this.view.activateAddList(addList);
        this.isListClosed=true;
    }

    listNameEditTransaction(oldName, newName, listId){
        let transaction=new ListNameEdit_Transaction(this,oldName, newName,listId);
        this.tps.addTransaction(transaction);
        this.view.refreshUndoRedo(this.tps.hasTransactionToUndo(),this.tps.hasTransactionToRedo())
    }

    listNameEdit(newName, listId){
        let listIndex=-1;
        for(let i=0;i<this.toDoLists.length;i++){
            if(this.toDoLists[i].id==listId){
                listIndex=i;
            }
        }

        if(listIndex>=0){
            this.toDoLists[listIndex].setName(newName);
        }
        this.view.refreshLists(this.toDoLists);
    }


    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        if(this.isListClosed){
            let newList = new ToDoList(this.nextListId++);
            if (initName)
                newList.setName(initName);
            this.toDoLists.push(newList);
            this.view.appendNewListToView(newList);
            return newList;
        }
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let listToLoad = this.toDoLists[listIndex];
            this.currentList = listToLoad;
            this.toDoLists[listIndex]=this.toDoLists[0];
            this.toDoLists[0]=listToLoad;
            this.view.refreshLists(this.toDoLists);
            this.view.viewList(this.currentList);
        }
    }

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
        this.view.refreshUndoRedo(this.tps.hasTransactionToUndo(),this.tps.hasTransactionToRedo())
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        //if(this.currentList!=null){
            //let r=confirm("Are you sure you want to delete this list?")
            //if(r){
        let thisModel=this;
        let modal=document.createElement("div");
        document.getElementById('grid-container').appendChild(modal);
        modal.setAttribute("class","modal");
        modal.innerHTML="<div class='modal-container'>"+
                            "<h1>Delete List</h1>"+
                            "<p>Are you sure you want to delete this list?</p>"+
                                "<button type='button' id='listCancel' class='cancelbtn'>Cancel</button>"+
                                "<button type='button' id='listDelete' class='deletebtn'>Delete</button>"+
                        "</div>";

        let deleteButton=document.getElementById("listDelete");
        let cancelButton=document.getElementById("listCancel");

        deleteButton.onmousedown =function(){
            let indexOfList = -1;
            for (let i = 0; (i < thisModel.toDoLists.length) && (indexOfList < 0); i++) {
                if (thisModel.toDoLists[i].id === thisModel.currentList.id) {
                    indexOfList = i;
                }
            }
            thisModel.toDoLists.splice(indexOfList, 1);
            thisModel.currentList = null;
            thisModel.view.clearItemsList();
            thisModel.view.refreshLists(thisModel.toDoLists);
            document.getElementById('grid-container').removeChild(modal);
        }

        cancelButton.onmousedown=function(){
            document.getElementById('grid-container').removeChild(modal);
        }

        
        
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }


    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }

        this.view.refreshUndoRedo(this.tps.hasTransactionToUndo(),this.tps.hasTransactionToRedo())
    }

}