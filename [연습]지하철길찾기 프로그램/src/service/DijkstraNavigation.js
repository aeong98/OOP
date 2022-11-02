import Dijkstra from "../utils/Dijkstra.js";
import {hasTextsUnderSpecificLength} from "../utils/array.js";
import Paths from "../model/Paths.js";

export function DijkstraNavigation(){
    this.init=()=>{
        this.dijkStra=new Dijkstra();
        this.paths=new Paths();
    };

    this.setDeparture=(departure)=>{
        this.departure=departure;
    }

    this.setArrival=(arrival)=>{
        this.arrival=arrival;
    }

    this.setPaths=(paths)=>{
        this.paths.setPaths(paths);
        this.paths.getPaths().map((path)=>this.dijkStra.addEdge(path.departure, path.arrival, path.weight));
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
        if(!this.paths.checkIsStationExistsInPaths(this.departure)){
            throw Error('존재하지 않는 출발역입니다.');
        }
    };

    const checkIsExistsArrivalStation = ()=>{
        if(!this.paths.checkIsStationExistsInPaths(this.arrival)){
            throw Error('존재하지 않는 도착역입니다.');
        }
    };

    const checkIsSameStations=()=> {
        if(IsSameString(this.departure,this.arrival)){
            throw Error('출발역과, 도착역은 같을 수 없습니다.');
        }
    };

    const IsSameString = (a,b) => a===b;
}