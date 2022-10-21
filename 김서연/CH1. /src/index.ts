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
        if(!this.hasInvitation()){
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

    this.getTicket=()=> this.tickets[0];
    this.minusAmount=(amount:number)=>{
        this.amount -= amount;
    }
    this.plusAmount=(amount:number)=>{
        this.amount+=amount;
    }
    this.sellTicketTo=(audience: Audience)=>{
        this.plusAmount(audience.buy(this.getTicket()));
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

// TODO: 아니 함수 생성자 타입스크립트 안되는 거 실화? 대상에 구문 시그니처가 없는 'new' 식에는 암시적으로 'any' 형식이 포함됩니다.ts(7009) <- 이거 해결 어떻게
const invitation = new (Invitation as any)(new Date());
const ticket = new (Ticket as any)(2000);
const bag = new (Bag as any)(10000, invitation, ticket);
const audience = new(Audience as any)(bag);
 

const ticketOffice = new(TicketOffice as any)(20000,new (Ticket as any)(2000), new (Ticket as any)(2000));
const ticketSeller = new(TicketSeller as any)(ticketOffice);
const theater = new(Theater as any)(ticketSeller);

console.log(audience.bag.amount); // 10000
console.log(ticket.fee); // 2000
theater.enter(audience);  // 티켓사서 영화관 가기~
console.log(audience.bag.amount); // 8000