let addBtn = document.querySelector(".add-btn");
let addFlag = false;
let modalCont = document.querySelector(".modal-cont");

addBtn.addEventListener("click",(e)=>{
    
    // Display Modale Here
    // Genrate Ticket

    // AddFlag => true,  Display the modal.
    // AddFlag => false, Hide the modal. 

    addFlag = !addFlag;
    if(addFlag){
        modalCont.style.display = "flex";
    } 
    else{
        modalCont.style.display = "none";
    }
})

// listen for ctr+enter when in modal and genertae ticket of that text when buttons are pressed

//Genrating tickets dynamically

// function createTicket(){
//     let ticketcon = document.createElement(".div");
//     ticketcon.setAttribute("class","ticket-cont");
//     ticketcon.innerHTML =   
//     // <div class="ticket-color"></div>
//     // <div class="ticket-id">Sample id</div>
//     // <div class="task-area">
//     //     Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus quos eligendi veritatis sed, ipsum incidunt?
//     // </div>
//     // ';
// }