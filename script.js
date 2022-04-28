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

// listen for ctr+enter when in modal and genertae ticket of that text when buttons are pressed

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
    ticketcon.setAttribute("class", "ticket-cont");
    ticketcon.innerHTML =
        `<div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">#${id}</div>
        <div class="task-area">${ticketTask}</div>
        <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>
    `;
    mainCont.appendChild(ticketcon);
    // Craete object of ticket and add to array
    if(!ticketID) ticketsArr.push({ticketColor, ticketTask, ticketID: id});

    handleColor(ticketcon);
    handleRemoval(ticketcon);
    handleLock(ticketcon);
}

function handleRemoval(ticketcon){
    //remove
    if(removeFlag){
        ticketcon.remove();
    }
}

function handleLock(ticketcon){
    let ticketLockElem = ticketcon.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticketcon.querySelector(".task-area");

    ticketLock.addEventListener("click" , (e) => {
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
    })
}

function handleColor(ticket){
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
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
    })
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