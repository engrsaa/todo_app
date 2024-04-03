#! /usr/bin/env node
import inquirer, { Answers } from "inquirer";
import chalk from "chalk";
// chalk theme declaration
const heading=chalk.bgHex('#CDFF00 ').black,question=chalk.hex('#FFAE42'),answer=chalk.hex('#A8CD13'),notification=chalk.cyan,optns=chalk.hex('#006400');
let tasksToSave:string[] = [];
let titleText = '\t Your To-Do Memorandum ';
let doAgain = true;
let addTaskReturn ='';
let addTask = async ():Promise<string> => {
    let returnValue = "";
    const askTask = await inquirer.prompt({
        name:'userTask',type:'input',message:question('Please provide task name to add:'),
    });
    let trimTask:string = askTask.userTask.trim();
    if(trimTask===""){
        returnValue = 'Blank Task Ignored!';
    }else{
        if(tasksToSave.some(arrayValue => arrayValue===trimTask)){
            returnValue = 'Existing Task Ignored!';
        }else{
            tasksToSave.push(trimTask);
            returnValue = 'New Task Added!';
        }
    }
    return returnValue;//console.log(notification(`${returnValue}`));
}
while(doAgain){
    addTaskReturn=await addTask();
    console.log(notification(addTaskReturn));
    let addMoreInquiry = await inquirer.prompt({
        name:'addMore',
        type:'confirm',
        default:'false',
        message:question('Do you want to add another task?')
    });
    doAgain=addMoreInquiry.addMore;
}
console.log(heading(titleText));
tasksToSave.forEach(arrayValue => console.log(answer(arrayValue)));
let editMemo = async () => {
    let requiredAction = await inquirer.prompt({
        name:'rqrdActn',
        type:'confirm',
        default:'false',
        message:question('Are you want to edit your memo?')
    });
    return requiredAction.rqrdActn;
}
let editMemoAns = await editMemo();
while(editMemoAns){
    let newArray =[...tasksToSave];
    titleText = '\n\t Your To-Do Memorandum ';
    async function askPriority():Promise<string> {
        let priorityInquiry = await inquirer.prompt({
            name:'prtyInqry',
            type:'list', choices:newArray,
            message:question(`Please select most prior task:`)
        });
        return priorityInquiry.prtyInqry;
    }
    let editArrayInquiry = await inquirer.prompt({
        name:'edtInqry',
        type:'list',
        choices:['Add new task','Delete task','Set Task priority','Update task'],
        message:question('Plese select an option:')
    });
    if(editArrayInquiry.edtInqry==='Add new task'){
        addTaskReturn = await addTask();
        console.log(notification(addTaskReturn));
        if(addTaskReturn==='New Task Added!'){titleText='\t Your Updated To-Do Memorandum ';}
    }else if(editArrayInquiry.edtInqry==='Update task' || editArrayInquiry.edtInqry==='Delete task'){
        
        let taskInquiry = await inquirer.prompt({
            name:'tskInqry',
            type:'list',choices:newArray,
            message:question(`Please select to ${editArrayInquiry.edtInqry}`)
        });
        if(editArrayInquiry.edtInqry === 'Delete task'){
            tasksToSave.splice(newArray.indexOf(taskInquiry.tskInqry),1);
            titleText='\t Your Updated To-Do Memorandum ';
        }else if(editArrayInquiry.edtInqry === 'Update task'){
            let updatedTask = await inquirer.prompt({name:'udtdTsk',type:'input',message:notification('Edit Task: '),default:taskInquiry.tskInqry});
            let checkTrimmedValue = updatedTask.udtdTsk.trim();
            if(newArray.some(arrayValue=>arrayValue===checkTrimmedValue)){
                console.log(notification('Existing Task Ignored!'));
            }else{
                tasksToSave.splice(newArray.indexOf(taskInquiry.tskInqry),1,updatedTask.udtdTsk);
                console.log(notification('Task Updated!'));
                titleText='\t Your Updated To-Do Memorandum ';
            }
        }
    }else if(editArrayInquiry.edtInqry==='Set Task priority'){
        for(let i=0;i<tasksToSave.length;i++){
            if(i!=tasksToSave.length-1){
                let priorTask = await askPriority();
                tasksToSave[i]=priorTask;
                newArray.splice(newArray.indexOf(priorTask),1);
            }else{
                tasksToSave[tasksToSave.length-1]=newArray[0];
                i=tasksToSave.length;
            }
        }
        titleText='\n\t Your Updated To-Do Memorandum ';
    }
    console.log(heading(titleText));
    tasksToSave.forEach(arrayValue =>console.log(answer(arrayValue)));
    editMemoAns=await editMemo();
}