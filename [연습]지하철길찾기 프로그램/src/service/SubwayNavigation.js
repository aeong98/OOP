import {createObject} from "../utils/object.js";
import Paths from "../model/Paths.js";

export default function SubwayNavigation (){
    this.init=({paths, Algorithm})=>{
        this.paths=createObject(Paths,paths);
        this.Algorithm= createObject(Algorithm);
    };

    this.findShortestDistancePath = (departure, arrival) =>{
        return findPath(departure, arrival, this.paths.getPaths().map((path)=>(
            {
                departure: path.departure,
                arrival: path.arrival,
                weight: path.distance,
            })
        ));
    };

    this.findShortestTimePath = (departure, arrival) =>{
        return findPath(departure, arrival,this.paths.getPaths().map((path)=>(
            {
                departure: path.departure,
                arrival: path.arrival,
                weight: path.time,
            })
        ) );
    };

    const findPath = (departure, arrival, paths)=>{
        this.Algorithm.setDeparture(departure);
        this.Algorithm.setArrival(arrival);
        this.Algorithm.setPaths(paths);
        this.Algorithm.validate();
        return this.Algorithm.findShortestPath();
    }
}

