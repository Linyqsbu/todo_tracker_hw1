'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
        }
        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
        }
        document.getElementById("delete-list-button").onmousedown = function() {
            appModel.removeCurrentList();
        }
        document.getElementById("add-item-button").onmousedown = function() {
            appModel.addNewItemTransaction();
        }
        
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }

    //ACTIVATE THE CONTROL BUTTONS OF EACH ITEM
    activateButtons(list){
        let thisModel=this.model;
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
                thisModel.loadList(list.getId());
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
                thisModel.loadList(list.getId());
            }

            items[i].getElementsByClassName("delete-item")[0].onmousedown=function(){
                let r=confirm("Are you sure that you want to delete item "+list.items[i].description+"?");
                if(r){
                    thisModel.deleteItemTransaction(list.items[i],i)
                    //items[i].parentNode.removeChild(items[i]);
                    //thisModel.loadList(list.getId());
                }
            }
            
        }
        
    }

    makeEditable(list){
        let tasks=document.getElementById('todo-list-items-div').getElementsByClassName('list-item-card')//the collection of tasks in this list
        let appModel=this.model;
        for(let i=0;i<tasks.length;i++){

            let task=tasks[i].getElementsByClassName('task-col')[0]; //the description of the task
            let date=tasks[i].getElementsByClassName('due-date-col')[0]; //the date of the task
            let status=tasks[i].getElementsByClassName('status-col')[0];//the status of the task
            
            
            task.onmousedown=function(){
                let oldTask=task.textContent;
                let newTaskChild=document.createElement('input');
                newTaskChild.setAttribute('type','text');
                newTaskChild.setAttribute('class','editable');
                newTaskChild.setAttribute('value',oldTask);
                tasks[i].replaceChild(newTaskChild,task);

                let editTask=function(event){
                    let isClickInside=newTaskChild.contains(event.target);

                    if(!isClickInside){
                        /*
                        task.textContent=newTaskChild.value;
                        tasks[i].replaceChild(task,newTaskChild);
                        list.items[i].setDescription(task.textContent);
                        
                        */
                       let newTask=newTaskChild.value;
                       appModel.taskEditTransaction(list.items[i],oldTask,newTask);
                       document.removeEventListener('click',editTask);
                    }
                };
                
                document.addEventListener('click',editTask);
                
            }


            date.onmousedown=function(){
                let oldDate=date.textContent;
                let newDateChild=document.createElement('input');
                newDateChild.setAttribute('class','editable');
                newDateChild.setAttribute('type','date');
                newDateChild.setAttribute('value',oldDate);
                tasks[i].replaceChild(newDateChild,date);

                let editDate=function(event){
                    let isClickInside=newDateChild.contains(event.target);

                    if(!isClickInside){
                        /*
                        date.textContent=newDateChild.value;
                        tasks[i].replaceChild(date,newDateChild);
                        list.items[i].setDueDate(date.textContent);
                        */
                        let newDate=newDateChild.value;
                        appModel.dueDateEditTransaction(list.items[i],oldDate,newDate)
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
}