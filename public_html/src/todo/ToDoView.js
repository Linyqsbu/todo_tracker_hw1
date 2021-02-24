'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button");
        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
  
        listElement.onmousedown = function() {
            //listsElement.insertBefore(listElement,listsElement.firstChild);
            thisController.handleLoadList(newList.id);
            listsElement.firstChild.style.backgroundColor="rgb(255,200,25)";
            listsElement.firstChild.style.color="black";
            thisController.model.tps.clearAllTransactions();
            
        }
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }


    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];
            let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>"
                                + "<div class='task-col'>" + listItem.description + "</div>"
                                + "<div class='due-date-col'>" + listItem.dueDate + "</div>"
                                + "<div class='status-col'>" + listItem.status + "</div>"
                                + "<div class='item-controls-col'>"
                                + " <div class='list-item-control material-icons arrow_up'>keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons arrow_down'>keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons delete-item'>close</div>"
                                + "</div>";
            itemsListDiv.innerHTML += listItemElement;
            
            let currentItem=document.getElementById('todo-list-item-'+listItem.id);
            if(listItem.status=="complete"){
                currentItem.getElementsByClassName('status-col')[0].style.color="#8ed4f8";
            }

            else{
                currentItem.getElementsByClassName('status-col')[0].style.color="#f5bc75";
            }

        }

        this.controller.makeEditable(list);
        this.controller.activateButtons(list);
        
    }

    

    
    
    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}
