interface Invitation{
    when: Date;
}

function Invitation(this:Invitation, when: Date){
    this.when =when;
}

interface Ticket{
    fee: number;
    getFee : ()=>number;
}

function Ticket(this:Ticket, fee:number){
    this.fee = fee;

    this.getFee = ()=>{ 
        return this.fee;
    }
}


interface Bag {
    amount: number;
    invitation : Invitation;
    ticket: Ticket;
    hold: (ticket:Ticket)=>number;
    hasInvitation : ()=> boolean;
    hasTicket : ()=>boolean;
    setTicket: (ticket:Ticket)=>void;
    minusAmount : (amount:number)=>void;
    plusAmount: (amount:number)=>void;
}

function Bag(this:Bag, amount:number, invitation:Invitation,  ticket:Ticket){
    this.amount=amount;
    this.invitation=invitation;
    this.ticket=ticket;

    this.hold=(ticket:Ticket)=>{
        if(this.hasInvitation()){
            this.setTicket(ticket);
            return 0;
        }else{
            this.setTicket(ticket);
            this.minusAmount(ticket.getFee());
            return ticket.getFee();
        }
    }

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
    buy: (ticket:Ticket)=>number;
}

function Audience(this:Audience, bag:Bag){
    this.bag= bag;

    this.getBag = ()=> this.bag;
    this.buy =(ticket: Ticket)=> this.bag.hold(ticket);
}

interface TicketOffice{
    amount: number;
    tickets: Ticket[];
    getTicket: ()=>Ticket;
    minusAmount: (amount:number)=>void;
    plusAmount: (amount:number)=>void;
    sellTicketTo: (audience: Audience)=> void;
}


function TicketOffice(this:TicketOffice, amount:number, ...tickets:Ticket[]){
    this.amount = amount;
    this.tickets = [...tickets];

    this.getTicket=()=> tickets.shift()!;
    this.minusAmount=(amount:number)=>{
        this.amount -= amount;
    }
    this.plusAmount=(amount:number)=>{
        this.amount+=amount;
    }
    this.sellTicketTo=(audience: Audience)=>{
        this.plusAmount(audience.buy(this.getTicket()))
    }
}


interface TicketSeller {
    ticketOffice: TicketOffice;
    sellTo: (audience:Audience)=>void;
}

function TicketSeller(this:TicketSeller, ticketOffice : TicketOffice){
    this.ticketOffice= ticketOffice;

    this.sellTo=(audience:Audience)=>{
        ticketOffice.sellTicketTo(audience);
    }
}


interface Theater{
    ticketSeller: TicketSeller;
    enter: (audience: Audience)=>void;
}


function Theater(this:any, ticketSeller: TicketSeller){
    this.ticketSeller=ticketSeller;
    
    this.enter=(audience:Audience)=>{
        ticketSeller.sellTo(audience);
    }
}
