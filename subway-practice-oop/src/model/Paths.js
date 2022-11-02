import {extractTotalValuesOfObjects} from "../utils/object.js";

export default function Paths(){
    this.init=(paths)=>{
        this.paths=paths;
    };

    this.setPaths=(paths)=>{
        this.paths=paths;
    }

    this.getPaths=()=>{
        return this.paths;
    }

    this.checkIsStationExistsInPaths=(stations)=>{
        const totalStation = extractTotalValuesOfObjects(this.getPaths(), ["departure", "arrival"]);
        return totalStation.includes(stations);
    }
}