/**
 * DiscountCondition (할인 조건)
 */
interface DiscountCondition{
    isSatisfiedBy: (screening: Screening)=>boolean;
}


interface SequenceCondition extends DiscountCondition{};

function SequenceCondition(this:SequenceCondition, sequence:number){
    let _sequence = sequence;

    this.isSatisfiedBy=(screening: Screening)=>screening.isSequence(_sequence);
}

interface PeriodCondition extends DiscountCondition{
    dayOfWeek: number;
    startTime : Date;
    endTime: Date;
}

function PeriodCondition(this:PeriodCondition, dayOfWeek:number, startTime:Date, endTime:Date){
    let _dayOfWeek= dayOfWeek
    let _startTime= startTime;
    let _endTime = endTime;

    this.isSatisfiedBy=(screening: Screening)=>{
        return screening.getStartTime().getDay() === _dayOfWeek &&
                _startTime.getTime() <=screening.getStartTime().getTime() &&
                _endTime.getTime() >= screening.getStartTime().getTime()
    }
}

/**
 * DiscountPolicy(할인 정책)
 */
interface DiscountPolicy{
    conditions: DiscountCondition[];
    getDiscountAmount: (screening: Screening)=>Money;
    calculateDiscountAmount: (screening: Screening)=>Money;
}

function DiscountPolicy(this:DiscountPolicy, conditions:DiscountCondition[]){
    this.conditions = [...conditions];
    
    this.getDiscountAmount = (screening: Screening)=> screening.getMovieFee();

    this.calculateDiscountAmount = (screening: Screening)=>{
        for(let discountCondition of this.conditions){
            if(discountCondition.isSatisfiedBy(screening)){
                return this.getDiscountAmount(screening);
            }
        }
        return new (Money as any)(0);
    }   
}

interface AmountDiscountPolicy extends DiscountPolicy{
    discountAmount: Money;
}

function AmountDiscountPolicy(this:AmountDiscountPolicy, discountAmount:Money, ...conditions:DiscountCondition[]){
    let _discountAmount = discountAmount;
    DiscountPolicy.prototype.conditions=[...conditions];

    // prototype 상속
    this.getDiscountAmount = DiscountPolicy.prototype.getDiscountAmount;
    this.calculateDiscountAmount=DiscountPolicy.prototype.calculateDiscountAmount;
}

interface PercentDiscountPolicy extends DiscountPolicy{
    percent: number;
}

function PercentDiscountPolicy(this:PercentDiscountPolicy, percent:number, ...conditions:DiscountCondition[]){
    let _percent = percent;
    DiscountPolicy.prototype.conditions=[...conditions];

    // prototype 상속
    this.getDiscountAmount= DiscountPolicy.prototype.getDiscountAmount;
    this.calculateDiscountAmount=DiscountPolicy.prototype.calculateDiscountAmount; 
    // 오버로딩
    this.getDiscountAmount=(screening:Screening)=>{
        return screening.getMovieFee().times(percent);
    }
}


interface Movie {
 title: string;
 runnigTime: number;
 fee: Money;
 discountPolicy: DiscountPolicy;
 getFee: ()=>Money;
 calculateMovieFee : (screening: Screening)=> Money;
}

function Movie(this: Movie, fee:Money, runnigTime:number, title:string, discountPolicy:DiscountPolicy){
    let _fee=fee;
    let _runnigTime = runnigTime;
    let _title =title;
    let _discountPolicy = discountPolicy;

    this.getFee=()=>_fee;
    this.calculateMovieFee=(screening: Screening)=>_fee.minus(_discountPolicy.calculateDiscountAmount(screening));
}

interface Customer{

}

function Customer(this:Customer){
    
}

interface Reservation{
    customer: Customer;
    screening: Screening;
    fee: Money;
    audienceCount: number;
}

function Reservation(this:Reservation, customer: Customer, screening: Screening, fee:Money, audienceCount:number){
    let _customer=customer;
    let _screening=screening;
    let _fee=fee;
    let _audienceCount=audienceCount;

}

interface Money{
    amount: number;
    getAmount: ()=>number;
    plus : (amount:Money)=>Money;
    minus : (amount:Money)=>Money;
    times: (amount:number)=>Money;
    isLessThan : (other:Money)=>boolean;
    isGreaterThan : (other:Money)=> boolean;
}

function Money(this:Money, amount:number){
    let _amount= amount;

    this.getAmount=()=>_amount;
    this.plus =(amount: Money) => new (Money as any)(_amount+amount.amount);
    this.minus =(amount: Money) => new (Money as any)(_amount-amount.amount);
    this.times = (amount:number)=>new (Money as any)(_amount* amount);
    this.isLessThan = (other: Money)=> _amount < other.amount;
    this.isGreaterThan = (other:Money)=>_amount > other.amount;
}


interface Screening{
    movie: Movie;
    sequence: number;
    whenScreened: Date;
    getStartTime : ()=>Date;
    isSequence : (sequence:number)=>boolean;
    getMovieFee: ()=> Money;
    reserve: (customer: Customer, audienceCount:number)=> Reservation;
}

function Screening(this:Screening, movie:Movie, sequence:number, whenScrened: Date){
    let _movie= movie;
    let _sequence=sequence;
    let _whenScreened=whenScrened;
    
    const calculateFee = (audienceCount:number)=> _movie.calculateMovieFee(this).times(audienceCount);

    this.getStartTime =()=> _whenScreened;
    this.isSequence = (sequence:number) => _sequence === sequence;
    this.getMovieFee=()=> _movie.calculateMovieFee(this);
    this.reserve = (customer: Customer, audienceCount:number)=> new (Reservation as any)(customer, this, calculateFee(audienceCount), audienceCount); 

}

let avatar = new (Movie as any)(
        new (Money as any)(1000), 
        20, 
        "아바타", 
        new (AmountDiscountPolicy as any)( new (Money as any)(100), [])
)

console.log(avatar.getFee().getAmount());