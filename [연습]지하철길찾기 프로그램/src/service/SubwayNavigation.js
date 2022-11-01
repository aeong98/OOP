import Paths from "../model/Paths.js";
import {createObject} from "../utils/object.js";

export default function SubwayNavigation (){
    this.init=({paths, Algorithm})=>{
        this.paths=paths;
        this.Algorithm= Algorithm;
    };

    this.findShortestDistancePath = (departure, arrival) =>{
        return findPath(departure, arrival, this.paths.map((path)=>(
            {
                departure: path.departure,
                arrival: path.arrival,
                weight: path.distance,
            })
        ));
    };

    this.findShortestTimePath = (departure, arrival) =>{
        return findPath(departure, arrival,this.paths.map((path)=>(
            {
                departure: path.departure,
                arrival: path.arrival,
                weight: path.time,
            })
        ) );
    };

    const findPath = (departure, arrival, paths)=>{
        const _Algorithm = createObject(this.Algorithm, {
            departure: departure,
            arrival: arrival
        });
        const _Paths= createObject(Paths, paths)
        _Algorithm.setPaths(_Paths);
        _Algorithm.validate();
        return _Algorithm.findShortestPath();
    }
}

