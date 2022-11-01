export default function SearchPathValidator(){
    this.init= ({$paths, $departure, $arrival})=>{
        this.paths=$paths;
        this.departure=$departure;
        this.arrival=$arrival;
    };

    this.validate = ()=>{
        checkIsStationTextsOverTwoCharacters();
        checkIsExistsDepartureStation();
        checkIsExistsArrivalStation();
        checkIsSameStations();
    };

    const hasTextsUnderTwoCharacters=(...texts)=>{
        return [...texts].some((check)=>check.length<2);
    };

    const checkIsStationTextsOverTwoCharacters=()=>{
        if(hasTextsUnderTwoCharacters(this.departure, this.arrival)){
            throw Error("출발역과 도착역은 2글자 이상이어야 합니다.");
        }
    };

    const IsExistsStation = (station)=> this.paths
        .reduce((cur, path)=>[...cur, path.departure, path.arrival],[])
        .includes(station);

    const checkIsExistsDepartureStation = ()=>{
        if(!IsExistsStation(this.departure)){
            throw Error('존재하지 않는 출발역입니다.');
        }
    };

    const checkIsExistsArrivalStation = ()=>{
        if(!IsExistsStation(this.arrival)){
            throw Error('존재하지 않는 도착역입니다.');
        }
    };

    const IsSameString = (a,b) => a===b;

    const checkIsSameStations=()=> {
        if(IsSameString(this.departure,this.arrival)){
            throw Error('출발역과, 도착역은 같을 수 없습니다.');
        }
    };
}