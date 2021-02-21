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
            listsElement.removeChild(listElement);
            listsElement.insertBefore(listElement,listsElement.firstChild);
            thisController.handleLoadList(newList.id);
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
            
        }   
        this.makeEditable(list);
        this.activateButtons(list);
        
    }

    //ACTIVATE THE CONTROL BUTTONS OF EACH ITEM
    activateButtons(list){
        let tempView=this;
        let items=document.getElementById('todo-list-items-div').childNodes;
        for(let i=0;i<items.length;i++){
            items[i].getElementsByClassName("arrow_up")[0].onmousedown=function(){
                if(i!=0){
                    let temp=list.items[i];
                    list.items[i]=list.items[i-1];
                    list.items[i-1]=temp;
                }
            
                if(items[i].previousSibling){
                    items[i].parentNode.insertBefore(items[i],items[i].previousSibling);
                }
                tempView.viewList(list);
            }

            items[i].getElementsByClassName("arrow_down")[0].onmousedown=function(){
                if(i!=list.items.length-1){
                    let temp=list.items[i+1];
                    list.items[i+1]=list.items[i];
                    list.items[i]=temp;
                }

                if(items[i].nextSibling){
                    items[i].parentNode.insertBefore(items[i].nextSibling,items[i]);
                }
                tempView.viewList(list);
            }

            items[i].getElementsByClassName("delete-item")[0].onmousedown=function(){
                let r=confirm("Are you sure that you want to delete item "+list.items[i].description+"?");
                if(r){
                    list.items.splice(i,1);
                    items[i].parentNode.removeChild(items[i]);
                    tempView.viewList(list);
                }
            }
            
        }
        
    }

    makeEditable(list){
        let tasks=document.getElementById('todo-list-items-div').getElementsByClassName('list-item-card')//the collection of tasks in this list

        for(let i=0;i<tasks.length;i++){

            let task=tasks[i].getElementsByClassName('task-col')[0]; //the description of the task
            let date=tasks[i].getElementsByClassName('due-date-col')[0]; //the date of the task
            let status=tasks[i].getElementsByClassName('status-col')[0];//the status of the task
            
            
            task.onmousedown=function(){
                let newTaskChild=document.createElement('input');
                newTaskChild.setAttribute('type','text');
                newTaskChild.setAttribute('class','editable');
                newTaskChild.setAttribute('value',task.textContent);
                tasks[i].replaceChild(newTaskChild,task);

                let editTask=function(event){
                    let isClickInside=newTaskChild.contains(event.target);

                    if(!isClickInside){
                        task.textContent=newTaskChild.value;
                        tasks[i].replaceChild(task,newTaskChild);
                        list.items[i].setDescription(task.textContent);
                        document.removeEventListener('click',editTask);
                    }
                };
                
                document.addEventListener('click',editTask);
                
            }


            date.onmousedown=function(){
                let newDateChild=document.createElement('input');
                newDateChild.setAttribute('class','editable');
                newDateChild.setAttribute('type','date');
                newDateChild.setAttribute('value',date.textContent);
                tasks[i].replaceChild(newDateChild,date);

                let editDate=function(event){
                    let isClickInside=newDateChild.contains(event.target);

                    if(!isClickInside){
                        date.textContent=newDateChild.value;
                        tasks[i].replaceChild(date,newDateChild);
                        list.items[i].setDueDate(date.textContent);
                        document.removeEventListener('click',editDate)
                    }
                };

                document.addEventListener('click', editDate);
            }


            status.onmousedown=function(){
                let newStatusChild=document.createElement('select');
                let op1=document.createElement('option');//incomplete option
                let op2=document.createElement('option');
                newStatusChild.appendChild(op1);
                newStatusChild.appendChild(op2);
                newStatusChild.setAttribute('class','editable');
                if(status.textContent=='incomplete'){
                    op1.text='incomplete';
                    op1.value='incomplete';
                    op2.text='complete';
                    op2.value='complete';
                }
                else{
                    op1.text='complete';
                    op1.value='complete';
                    op2.text='incomplete';
                    op2.value='incomplete';
                }

                tasks[i].replaceChild(newStatusChild,status);

                let editStatus=function(event){
                    let isClickInside=newStatusChild.contains(event.target);

                    if(!isClickInside){
                        status.textContent=newStatusChild.value;
                        tasks[i].replaceChild(status,newStatusChild);
                        list.items[i].setStatus(status.textContent);
                        document.removeEventListener('click',editStatus)
                    }
                };
                document.addEventListener('click', editStatus);
                
            }
        }
    }

    
    
    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}
