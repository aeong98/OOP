import Dijkstra from "../utils/Dijkstra.js";
import {hasTextsUnderSpecificLength} from "../utils/array.js";
import {extractTotalValuesOfObjects} from "../utils/object.js";

export function DijkstraNavigation(){
    this.init=()=>{
        this.dijkStra=new Dijkstra();
    };

    this.setDepartureArrival=(departure, arrival)=>{
        this.departure=departure;
        this.arrival=arrival;
    };

    this.setPaths=(paths)=>{
        this.paths=paths;
        paths.map((path)=>this.dijkStra.addEdge(path.departure, path.arrival, path.weight));
    }

    this.findShortestPath = ()=> {
        const result = this.dijkStra.findShortestPath(this.departure, this.arrival);
        if(!result){
            throw Error('출발역과 도착역이 연결되어있지 않습니다.');
        }
        return result;
    };

    this.validate = ()=>{
        checkIsStationTextsOverTwoCharacters();
        checkIsExistsDepartureStation();
        checkIsExistsArrivalStation();
        checkIsSameStations();
    };

    const checkIsStationTextsOverTwoCharacters=()=>{
        if(hasTextsUnderSpecificLength(2, this.departure, this.arrival)){
            throw Error("출발역과 도착역은 2글자 이상이어야 합니다.");
        }
    };

    const checkIsExistsDepartureStation = ()=>{
        if(!getTotalStation().includes(this.departure)){
            throw Error('존재하지 않는 출발역입니다.');
        }
    };

    const checkIsExistsArrivalStation = ()=>{
        if(!getTotalStation().includes(this.arrival)){
            throw Error('존재하지 않는 도착역입니다.');
        }
    };

    const checkIsSameStations=()=> {
        if(IsSameString(this.departure,this.arrival)){
            throw Error('출발역과, 도착역은 같을 수 없습니다.');
        }
    };

    const getTotalStation = () => extractTotalValuesOfObjects(this.paths, ["departure", "arrival"]);
    const IsSameString = (a,b) => a===b;
}