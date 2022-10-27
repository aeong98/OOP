/**
 * DiscountCondition (할인 조건) -> SequenceCondition, PeriodCondition
 * - 인터페이스만 공유
 */
interface DiscountCondition{
    isSatisfiedBy: (screening: Screening)=>boolean;
}


interface SequenceCondition extends DiscountCondition{};

function SequenceCondition(sequence:number):SequenceCondition{
    let _sequence = sequence;

    const isSatisfiedBy=(screening: Screening)=>screening.isSequence(_sequence);

    return Object.freeze({
        isSatisfiedBy
    })
}

interface PeriodCondition extends DiscountCondition{
    isSatisfiedBy : (screening: Screening)=> boolean;
}

function PeriodCondition(dayOfWeek:number, startTime:Date, endTime:Date):PeriodCondition{
    let _dayOfWeek= dayOfWeek
    let _startTime= startTime;
    let _endTime = endTime;

    const isSatisfiedBy=(screening: Screening)=>{
        return screening.getStartTime().getDay() === _dayOfWeek &&
                _startTime.getTime() <=screening.getStartTime().getTime() &&
                _endTime.getTime() >= screening.getStartTime().getTime()
    }

    return Object.freeze({
        isSatisfiedBy
    })
}

/**
 * DiscountPolicy(할인 정책) -> AmoundDiscountPolicy, PercentDiscountPolicy
 * - 추상 클래스 (DiscountPolicy) 를 통해 다형성을 구현
 */
interface DiscountPolicy{
    getDiscountAmount: (screening: Screening)=>Money;
    calculateDiscountAmount: (screening: Screening)=>Money;
}

function DiscountPolicy(conditions:DiscountCondition[]):DiscountPolicy{
    let _conditions = [...conditions];
    
    const getDiscountAmount = (screening: Screening)=> screening.getMovieFee();

    const calculateDiscountAmount = (screening: Screening)=>{
        for(let discountCondition of _conditions){
            if(discountCondition.isSatisfiedBy(screening)){
                return getDiscountAmount(screening);
            }
        }
        return new (Money as any)(0);
    }  
    return Object.freeze({
        getDiscountAmount,
        calculateDiscountAmount
    })
}

interface AmountDiscountPolicy extends DiscountPolicy{}

function AmountDiscountPolicy(discountAmount:Money, ...conditions:DiscountCondition[]):AmountDiscountPolicy{
    // prototype 상속
    const getDiscountAmount = DiscountPolicy(conditions).getDiscountAmount;
    const calculateDiscountAmount=DiscountPolicy(conditions).calculateDiscountAmount;

    return Object.freeze({
        getDiscountAmount,
        calculateDiscountAmount
    })
}

interface PercentDiscountPolicy extends DiscountPolicy{
    
}

function PercentDiscountPolicy(percent:number, ...conditions:DiscountCondition[]):PercentDiscountPolicy{
    let _percent = percent;
    // prototype 상속
    const calculateDiscountAmount=DiscountPolicy(conditions).calculateDiscountAmount; 
    // 오버로딩
    const getDiscountAmount=(screening:Screening)=>{
        return screening.getMovieFee().times(percent);
    }

    return Object.freeze({
        calculateDiscountAmount,
        getDiscountAmount
    })
}

interface NoneDiscountPolicy extends DiscountPolicy{}

function NoneDiscountPolicy():DiscountPolicy{
    const calculateDiscountAmount = (screening: Screening)=> Money(0);
    const getDiscountAmount = (screening: Screening) => Money(0);

    return Object.freeze({
        calculateDiscountAmount,
        getDiscountAmount
    })
}


interface Movie {
 getFee: ()=>Money;
 calculateMovieFee : (screening: Screening)=> Money;
 changeDiscountPolicy : (discountPolicy :DiscountPolicy)=>void;
}

function Movie(fee:Money, runnigTime:number, title:string, discountPolicy:DiscountPolicy):Movie{
    let _fee=fee;
    let _runnigTime = runnigTime;
    let _title =title;
    let _discountPolicy = discountPolicy;

    const getFee=()=>_fee;
    const calculateMovieFee=(screening: Screening)=>_fee.minus(_discountPolicy.calculateDiscountAmount(screening));
    const changeDiscountPolicy=(discountPolicy:DiscountPolicy) =>{_discountPolicy=discountPolicy};

    return Object.freeze({
        getFee,
        calculateMovieFee,
        changeDiscountPolicy
    })
}

interface Customer{

}

function Customer(this:Customer){
    
}

interface Reservation{
    getCustomer: ()=>Customer;
    getScreening : ()=>Screening;
    getFee :()=>Money;
    getAudienceCount: ()=>number;
}

function Reservation(customer: Customer, screening: Screening, fee:Money, audienceCount:number):Reservation{
    let _customer=customer;
    let _screening=screening;
    let _fee=fee;
    let _audienceCount=audienceCount;

    const getCustomer = ()=>_customer;
    const getScreening = ()=>_screening;
    const getFee = ()=>_fee;
    const getAudienceCount = ()=>_audienceCount;

    return Object.freeze({
        getCustomer,
        getScreening,
        getFee,
        getAudienceCount
    })
}

interface Money{
    getAmount: ()=>number;
    plus : (amount:Money)=>Money;
    minus : (amount:Money)=>Money;
    times: (amount:number)=>Money;
    isLessThan : (other:Money)=>boolean;
    isGreaterThan : (other:Money)=> boolean;
}

function Money(amount:number):Money{
    let _amount= amount;

    const getAmount=()=>_amount;
    const plus =(amount: Money) => new (Money as any)(_amount+amount.getAmount());
    const minus =(amount: Money) => new (Money as any)(_amount-amount.getAmount());
    const times = (amount:number)=>new (Money as any)(_amount* amount);
    const isLessThan = (other: Money)=> _amount < other.getAmount();
    const isGreaterThan = (other:Money)=>_amount > other.getAmount();

    return Object.freeze({
        getAmount,
        plus,
        minus,
        times,
        isLessThan,
        isGreaterThan
    })
}


interface Screening{
    getStartTime : ()=>Date;
    isSequence : (sequence:number)=>boolean;
    getMovieFee: ()=> Money;
    reserve: (customer: Customer, audienceCount:number)=> Reservation;
}

function Screening(this: Screening, movie:Movie, sequence:number, whenScrened: Date):Screening{
    let _movie= movie;
    let _sequence=sequence;
    let _whenScreened=whenScrened;
    
    const calculateFee = (audienceCount:number)=> _movie.calculateMovieFee(this).times(audienceCount);

    const getStartTime =()=> _whenScreened;
    const isSequence = (sequence:number) => _sequence === sequence;
    const getMovieFee=()=> _movie.calculateMovieFee(this);
    const reserve = (customer: Customer, audienceCount:number)=> Reservation(customer, this, calculateFee(audienceCount), audienceCount); 

    return Object.freeze({
        getStartTime,
        isSequence,
        getMovieFee,
        reserve
    })
}

let avatar = Movie(
        Money(1000), 
        20, 
        "아바타", 
        AmountDiscountPolicy(Money(100), SequenceCondition(10))
)

/**할인 요금이 0원일 경우 */
let starWars = Movie(
    Money(1000),
    20,
    "스타워즈",
    NoneDiscountPolicy()
)

// 인스턴스 변수로 연결해두었기 떄문에, 실행 시점에 할인 정책을 간단하게 변경할 수 있게된다.
starWars.changeDiscountPolicy(AmountDiscountPolicy(Money(100), SequenceCondition(10)))



console.log(avatar.getFee().getAmount());