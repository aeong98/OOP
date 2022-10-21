
interface Invitation{
    when: Date;
}

function Invitation(this:any, when: Date){
    this.when =when;
}


interface Ticket{
    fee: number;
    getFee : ()=>number;
}

function Ticket(this:any, fee:number){
    this.fee = fee;

    this.getFee = ()=>{ 
        return this.fee;
    }
}


interface Bag {
    amount: number;
    invitation : Invitation;
    ticket: Ticket;
    hasInvitation : ()=> boolean;
    hasTicket : ()=>boolean;
    setTicket: (ticket:Ticket)=>void;
    minusAmount : (amount:number)=>void;
    plusAmount: (amount:number)=>void;
}

function Bag(this:any, amount:number, invitation:Invitation,  ticket?:Ticket){
    this.amount=amount;
    this.invitation=invitation;
    this.ticket=ticket;

    this.hasInvitation = () => invitation!==null;
    this.hasTicket = ()=> ticket!==null;
    this.setTicket = ()=>{
        this.ticket=ticket;
    }
    this.minusAmount = (amount:number)=>{
        this.amount -= amount;
    }
    this.plusAmount = (amount:number)=>{
        this.amount +=amount;
    }
}

interface Audience{
    bag:Bag;
    getBag: ()=>Bag;
}

function Audience(this:any, bag:Bag){
    this.bag= bag;

    this.getBag = ()=> this.bag;
}

interface TicketOffice{
    amount: number;
    tickets: Ticket[];
    getTicket: ()=>Ticket;
    minusAmount: (amount:number)=>void;
    plusAmount: (amount:number)=>void;
}


function TicketOffice(this:any, amount:number, ...tickets:Ticket[]){
    this.amount = amount;
    this.tickets = [...tickets];

    this.getTicket=()=> tickets.shift();
    this.minusAmount=(amount:number)=>{
        this.amount -= amount;
    }
    this.plusAmount=(amount:number)=>{
        this.amount+=amount;
    }
}


interface TicketSeller {
    ticketOffice: TicketOffice;
    getTicketOffice: ()=>TicketOffice;
}

function TicketSeller(this:any, ticketOffice : TicketOffice){
    this.ticketOffice= ticketOffice;

    this.getTicketOffice =() => this.ticketOffice;
}



function Theater(this:any, ticketSeller: TicketSeller){
    this.ticketSeller=ticketSeller;
    
    this.enter=(audience:Audience)=>{
        if(audience.getBag().hasInvitation()){
            let ticket = this.ticketSeller.getTicketOffice().getTicket();
            audience.getBag().setTicket(ticket);
        }else{
            let ticket= this.ticketSeller.getTicketOffice().getTicket();
            audience.getBag().minusAmount(ticket.getFee());
            ticketSeller.getTicketOffice().plusAmount(ticket.getFee());
            audience.getBag().setTicket(ticket);
        }
    }
}
