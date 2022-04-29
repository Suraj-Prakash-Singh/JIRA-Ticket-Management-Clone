let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");

let addFlag = false;
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let toolBoxColors = document.querySelectorAll(".color");

let colors = ["blue","yellow","green","pink"];
let modalPriorityColor = colors[colors.length-1];
let allPriorityColors = document.querySelectorAll(".priority-color");

let removeFlag = false;


// lock variables
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketsArr = [];

if(localStorage.getItem("jira_tickets")){
    // retrieve and display tickets

    ticketsArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketsArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
}


// Filteration functionality
for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click",(e)=>{
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter((ticketObj, idx) => {
            return currentToolBoxColor === ticketObj.ticketColor;
        })

        //Remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i = 0;i < allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        // Display new filtered tickets

        filteredTickets.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })

    toolBoxColors[i].addEventListener("dblclick", (e) => {
        //Remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i = 0;i < allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        ticketsArr.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
}
// Listener for modal priority coloring
allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((priorityColorElem,idx) => {
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");

        modalPriorityColor = colorElem.classList[0];
    })
})

addBtn.addEventListener("click", (e) => {

    // Display Modale Here
    // Genrate Ticket

    // AddFlag => true,  Display the modal.
    // AddFlag => false, Hide the modal. 

    addFlag = !addFlag;
    if (addFlag) {
        modalCont.style.display = "flex";
    }
    else {
        modalCont.style.display = "none";
    }
})

removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag; 
})

//listen for ctr+enter when in modal and genertae ticket of that text when buttons are pressed

//Genrating tickets dynamically

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        createTicket(modalPriorityColor,textareaCont.value);
        addFlag = false;
        setModalToDefault();
        // modalCont.innerText = "";
    }
})

function createTicket(ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid();
    let ticketcon = document.createElement("div");
    ticketTask = ticketTask.toUpperCase();
    ticketcon.setAttribute("class", "ticket-cont");
    ticketcon.innerHTML =
        `<div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">#${id}</div>
        <div class="task-area">${ticketTask}</div>
        <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>
    `;
    mainCont.appendChild(ticketcon);
    // Craete object of ticket and add to array
    if(!ticketID) 
    {
        ticketsArr.push({ticketColor, ticketTask, ticketID: id});
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    }

    handleColor(ticketcon,id);
    handleRemoval(ticketcon,id);
    handleLock(ticketcon,id);
}

function handleRemoval(ticketcon, id){
    //remove
    ticketcon.addEventListener("click",(e) => {
        if(!removeFlag) return;

        let idx = getTicketIdx(id);

        // DB removal
        ticketsArr.splice(idx, 1);
        let strTicketsArr = JSON.stringify(ticketsArr);
        localStorage.setItem("jira_tickets", strTicketsArr);

        // UI removal
        ticketcon.remove();
    })
}

function handleLock(ticketcon, id){
    let ticketLockElem = ticketcon.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticketcon.querySelector(".task-area");

    ticketLock.addEventListener("click" , (e) => {
        let ticketIdx = getTicketIdx(id);

        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable","true");
        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
        }

        // MOdify data in local storage
        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    })
}

function handleColor(ticket, id){
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        // Get ticketIdx from the tickets array
        let ticketIdx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];

        // get ticketcoolor index

        let currentTicketColorIdx = colors.findIndex((color) =>{
        return currentTicketColor === color;
        })

        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        //Modify data in local storage (priority color change)
        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    })
}

function getTicketIdx(id){
    let ticketIdx = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id;
    })
    return ticketIdx;
}
function setModalToDefault(){
    textareaCont.value = "";
    modalCont.style.display = "none";
    modalPriorityColor = colors[colors.length-1];
    allPriorityColors.forEach((priorityColorElem, idx) =>{
        priorityColorElem.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length-1].classList.add("border");
}