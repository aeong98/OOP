interface Invitation{
    getWhen : ()=>Date;
}

function Invitation(when: Date):Invitation{
    const _when= when;
    const getWhen = ()=> _when;

    return Object.freeze({
        getWhen
    })
}

interface Ticket{
    getFee : ()=>number;
}

function Ticket(fee:number):Ticket{
    const _fee = fee;

    const getFee = ()=>{ 
        return _fee;
    }
    return Object.freeze({
        getFee
    })
}

interface Bag {
    getAmount: ()=>number;
    hold: (ticket:Ticket)=>number;
    hasInvitation : ()=> boolean;
    hasTicket : ()=>boolean;
    setTicket: (ticket:Ticket)=>void;
    minusAmount : (amount:number)=>void;
    plusAmount: (amount:number)=>void;
}

function Bag(amount:number, invitation:Invitation,  ticket:Ticket):Bag{
    let _amount=amount;
    let _invitation=invitation;
    let _ticket=ticket;

    const getAmount = ()=> _amount;

    const hold=(ticket:Ticket)=>{
        if(!hasInvitation()){
            setTicket(ticket);
            return 0;
        }else{
            setTicket(ticket);
            minusAmount(ticket.getFee());
            return ticket.getFee();
        }
    }

    const hasInvitation = () => _invitation!==null;
    const hasTicket = ()=> _ticket!==null;
    const setTicket = (ticket: Ticket)=>{
        _ticket=ticket;
    }
    const minusAmount = (amount:number)=>{
        _amount -= amount;
    }
    const plusAmount = (amount:number)=>{
        _amount +=amount;
    }

    return Object.freeze({
        getAmount,
        hold,
        hasInvitation,
        hasTicket,
        setTicket,
        minusAmount,
        plusAmount
    });
}

interface Audience{
    getBag: ()=>Bag;
    buy: (ticket:Ticket)=>number;
}

function Audience(bag:Bag):Audience{
    const _bag= bag;

    const getBag = ()=> _bag;
    const buy =(ticket: Ticket)=> _bag.hold(ticket);

    return Object.freeze({
        getBag,
        buy
    })
}

interface TicketOffice{
    getTicket: ()=>Ticket;
    minusAmount: (amount:number)=>void;
    plusAmount: (amount:number)=>void;
    sellTicketTo: (audience: Audience)=> void;
}

function TicketOffice(amount:number, ...tickets:Ticket[]):TicketOffice{
    let _amount = amount;
    let _tickets = [...tickets];

    const getTicket=()=> _tickets[0];
    const minusAmount=(amount:number)=>{
        _amount -= amount;
    }
    const plusAmount=(amount:number)=>{
        _amount+=amount;
    }
     const sellTicketTo=(audience: Audience)=>{
        plusAmount(audience.buy(getTicket()));
    }

    return Object.freeze({
        getTicket,
        minusAmount,
        plusAmount,
        sellTicketTo
    })
}

interface TicketSeller {
    sellTo: (audience:Audience)=>void;
}

function TicketSeller(ticketOffice : TicketOffice):TicketSeller{
    let _ticketOffice= ticketOffice;

    const sellTo=(audience:Audience)=>{
        _ticketOffice.sellTicketTo(audience);
    }
    return Object.freeze({
        sellTo,
    })
}

interface Theater{
    enter: (audience: Audience)=>void;
}


function Theater(ticketSeller: TicketSeller):Theater{
    let _ticketSeller=ticketSeller;
    
    const enter=(audience:Audience)=>{
        _ticketSeller.sellTo(audience);
    }

    return Object.freeze({
        enter
    })
}

// TODO: ?????? ?????? ????????? ?????????????????? ????????? ??? ??????? ????????? ?????? ??????????????? ?????? 'new' ????????? ??????????????? 'any' ????????? ???????????????.ts(7009) <- ?????? ?????? ?????????
const invitation = Invitation(new Date());
const ticket = Ticket(2000);
const bag = Bag(10000, invitation, ticket);
const audience = Audience(bag);
 

const ticketOffice = TicketOffice(20000, Ticket(2000), Ticket(2000));
const ticketSeller = TicketSeller(ticketOffice);
const theater = Theater(ticketSeller);

console.log(audience.getBag().getAmount()); // 10000
console.log(ticket.getFee()); // 2000
theater.enter(audience);  // ???????????? ????????? ??????~
console.log(audience.getBag().getAmount()); // 8000