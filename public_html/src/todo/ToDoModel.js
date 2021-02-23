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
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
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
    }

    taskEdit(item, newTask){
        item.setDescription(newTask);
        this.view.viewList(this.currentList);
    }

    dueDateEditTransaction(item,oldDate,newDate){
        let transaction=new DueDateEdit_Transaction(this,oldDate,newDate,item);
        this.tps.addTransaction(transaction);
    }

    dueDateEdit(item,date){
        item.setDueDate(date);
        this.view.viewList(this.currentList);
    }

    statusEditTransaction(item,oldStat,newStat){
        let transaction=new StatusEdit_Transaction(this,oldStat,newStat,item);
        this.tps.addTransaction(transaction);
    }

    statusEdit(item,status){
        item.setStatus(status);
        this.view.viewList(this.currentList);
    }

    moveItemUpTransaction(i){
        let transaction=new MovingItemUp_Transaction(this,i);
        this.tps.addTransaction(transaction);
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
    }

    moveItemDown(i){
        let temp=this.currentList.items[i+1];
        this.currentList.items[i+1]=this.currentList.items[i];
        this.currentList.items[i]=temp;
        this.view.viewList(this.currentList);
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
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
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
        let r=confirm("Are you sure you want to delete this list?")
        if(r){
            let indexOfList = -1;
            for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
                if (this.toDoLists[i].id === this.currentList.id) {
                    indexOfList = i;
                }
            }
            this.toDoLists.splice(indexOfList, 1);
            this.currentList = null;
            this.view.clearItemsList();
            this.view.refreshLists(this.toDoLists);
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
    }

}