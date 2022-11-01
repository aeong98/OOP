import {createObject} from "../utils/object.js";

export default function SubwayNavigation (){
    this.init=({$paths, $Algorithm, $departure, $arrival})=>{
        this.paths=$paths;
        this.Algorithm= createObject($Algorithm, {
            $departure: $departure,
            $arrival: $arrival,
        });
    };

    this.findShortestLongPath = ()=> {
        console.log(this.paths);
        this.Algorithm.setPaths(this.paths.map((path)=>(
            {
                departure: path.departure,
                arrival: path.arrival,
                weight: path.long
            })
        ));
        this.Algorithm.validate();
        return this.Algorithm.findShortestPath();
    };

    this.findShortestTimePath = ()=> {
        this.Algorithm.setPaths(this.paths.map((path)=>(
            {
                departure: path.departure,
                arrival: path.arrival,
                weight: path.time
            })
        ));
        this.Algorithm.validate();
        return this.Algorithm.findShortestPath();
    };
}

