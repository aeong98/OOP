import Paths from "../model/Paths.js";
import {createObject} from "../utils/object.js";

export default function SubwayNavigation (){
    this.init=({paths, Algorithm})=>{
        this.Paths= createObject(Paths, paths);
        this.Algorithm= createObject(Algorithm);
    };

    this.findShortestDistancePath = (departure, arrival) =>
        findPath(departure, arrival,this.Paths.getPathsWithDistanceWeight());

    this.findShortestTimePath = (departure, arrival)=>
        findPath(departure, arrival,this.Paths.getPathsWithTimeWeight());

    const findPath = (departure, arrival, path)=>{
        this.Algorithm.setDepartureArrival(departure, arrival);
        this.Algorithm.setPaths(path);
        this.Algorithm.validate();
        return this.Algorithm.findShortestPath();
    }
}

