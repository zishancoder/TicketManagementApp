let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let TicketBucket = document.querySelector(".ticket-bucket");
let priorityColours =  ["lightblue","lightgreen","lightpink","black"];
let priorityColoursList = modalCont.querySelectorAll(".priority-colour");
let toolBoxPriorityColour = document.querySelectorAll(".color");
let saveButton = document.querySelector("button");

let removeFlag = false;
let flag = false;
let priorityColour;
/** ---------------------------------------------------Add sign Functionality--------------------------------- */
addBtn.addEventListener("click",(e)=>{
    flag=!flag;
    //flag->true->Display Modal
    //flag->false->Hide Modal
    if(flag)
    {
        modalCont.style.display="flex";
        priorityColoursList.forEach((elem)=>{
            elem.classList.remove("border");
            if(elem.classList.contains("black"))
            {
                elem.classList.add("border");
                priorityColour="black";
            }
        })
        addBtn.style.backgroundColor="#a5b1c2";
    }
    else
    {
        modalCont.style.display="none";
        addBtn.removeAttribute("style");
    }
})

/**------------------------------To generate New Ticket------------------------------------------------------- */
function createTicket(ticketPriorityColour,ticketId,task){
    let newTicket = document.createElement("div");
    newTicket.setAttribute("class","ticket-cont");
    newTicket.innerHTML=`
            <div class="ticket-priority-colour ${ticketPriorityColour}"></div>
            <div class="ticket-id-cont">#${ticketId}</div>
            <div class="ticket-task-cont">${task}</div>
            <div class="ticket-lock-cont"><i class="fa-solid fa-lock"></div>`;
    TicketBucket.appendChild(newTicket);
    removeTicketHandler(newTicket,ticketId);
    lockTicketHandler(newTicket,ticketId);
    ticketColourHandler(newTicket,ticketId);
    SaveTicket(ticketPriorityColour,ticketId,task);
}

function removeTicketHandler(ticket,id)
{
    ticket.addEventListener("click",()=>{
        if(removeFlag)
        {
            ticket.remove();
            let idx = getTicketIndex(id);
            allTicketDetails.splice(idx,1);
            localStorage.setItem('jira-tickets',JSON.stringify(allTicketDetails));
        }
    })
}

function lockTicketHandler(ticket,id)
{
    let lockIcon = ticket.querySelector(".ticket-lock-cont").children[0];
    let taskArea = ticket.querySelector(".ticket-task-cont");
    lockIcon.addEventListener("click",()=>{
        if(lockIcon.classList.contains("fa-lock"))
        {
            lockIcon.classList.remove("fa-lock");
            lockIcon.classList.add("fa-lock-open");
            taskArea.setAttribute("contenteditable","true");
        }
        else
        {
            lockIcon.classList.remove("fa-lock-open");
            lockIcon.classList.add("fa-lock");
            taskArea.removeAttribute("contenteditable");
            updateTask(taskArea.innerText,id);
        }
        })
}

function ticketColourHandler(ticket,id){
    let ticketColourSection = ticket.querySelector(".ticket-priority-colour");
    ticketColourSection.addEventListener("click",()=>{
        let currentPriorityColour=ticketColourSection.classList[1];
        let idx = priorityColours.indexOf(currentPriorityColour);
        idx++;
        idx=idx%priorityColours.length;
        ticketColourSection.classList.remove(currentPriorityColour);
        ticketColourSection.classList.add(priorityColours[idx]);
        console.log(priorityColours[idx])
        updateColour(priorityColours[idx],id);
    })
}
/**------------------------------------------------Modal Functionality------------------------------------------- */
// On pressing Shift Ticket Should Generate.
modalCont.addEventListener("keydown",(e)=>{
    if(e.key=="Shift")
    {
        let task = modalCont.querySelector("textarea").value;
        createTicket(priorityColour,shortid.generate(),task);
        modalCont.querySelector("textarea").value="";
        modalCont.style.display="none";
        addBtn.removeAttribute("style");
        flag=false;
    }
})

// To Toggel border on priority colour.
priorityColoursList.forEach((elem)=>{
    elem.addEventListener("click",(e)=>{
        //To remove border class.
        priorityColoursList.forEach((elem,)=>{
            elem.classList.remove("border");
        })

        //To add border class to current elem.
        e.currentTarget.classList.add("border");
        priorityColour=e.currentTarget.classList[0];
    })
})

/**------------------------------------------------Remove Sign Functionality---------------------------- */
removeBtn.addEventListener("click",()=>{
    removeFlag=!removeFlag;
    if(removeFlag)
    {
        removeBtn.style.backgroundColor = "#a5b1c2";
    }
    else
    {
        removeBtn.removeAttribute("style");
    }
})

/**-----------------------------------------Ticket Filteration Funtionality--------------------------------------------------------- */

toolBoxPriorityColour.forEach((elem)=>{
    elem.addEventListener("click",()=>{
        let selectedColour = elem.classList[0];
        let tickets = TicketBucket.querySelectorAll(".ticket-cont");
        tickets.forEach((ticket)=>{
            let currTicketColour = ticket.children[0].classList[1];
            if(currTicketColour==selectedColour)
            {
                ticket.style.display="block";
            }
            else
            {
                ticket.style.display="none";
            }
        })
    })

    elem.addEventListener("dblclick",()=>{
        let tickets = TicketBucket.querySelectorAll(".ticket-cont");
       tickets.forEach((ticket)=>{
        ticket.style.display="block";
       })
    })
})
/**-----------------------------Storage Functionality--------------------------------------------------------- */

let allTicketDetails=[];
let idx=0;

// To save ticket in browser local storage.
function SaveTicket(colour,id,task){
    allTicketDetails[idx]={
        colour: colour,
        id: id,
        task: task
    };
    idx++;
    localStorage.setItem('jira-tickets',JSON.stringify(allTicketDetails));
    localStorage.setItem('totalSavedTickes',JSON.stringify(idx));
}

// To generate saved Tickets when browser restart
(function generateSavedTickets(){
    let savedTickets = JSON.parse(localStorage.getItem('jira-tickets'));
    savedTickets.forEach((ticket)=>{
        createTicket(ticket.colour,ticket.id,ticket.task);
    })
})();


// Returns idx of ticket present in local storage
function getTicketIndex(id){
   let idx = allTicketDetails.findIndex((ticket,idx)=>{
        if(ticket.id==id)
            return idx;
   });
   if(idx<0)
        return 0;
    else    
        return idx;
}

function updateColour(colour,id){
    let idx = getTicketIndex(id);
    allTicketDetails[idx].colour=colour;
    localStorage.setItem('jira-tickets',JSON.stringify(allTicketDetails));
}

function updateTask(task,id){
    let idx = getTicketIndex(id);
    allTicketDetails[idx].task=task;
    localStorage.setItem('jira-tickets',JSON.stringify(allTicketDetails));
}


/**----------------------------------------Save Button For Mobile Users------------------------------------------- */

saveButton.addEventListener("touchstart",()=>{
    let task = modalCont.querySelector("textarea").value;
    createTicket(priorityColour,shortid.generate(),task);
    modalCont.querySelector("textarea").value="";
    modalCont.style.display="none";
    addBtn.removeAttribute("style");
    flag=false;
})
