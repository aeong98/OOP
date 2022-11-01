export default function SubwayNavigation (){
    this.init=({$paths, $Algorithm})=>{
        this.paths=$paths;
        this.Algorithm=$Algorithm;
    }

    this.findShortestLongPath = (departure, arrival)=> {
        const algorithm = new this.Algorithm();
        algorithm.init(this.paths.map((path)=>(
                {
                    departure: path.departure,
                    arrival: path.arrival,
                    weight: path.long
                }
            )
        ));
        return algorithm.findShortestPath(departure, arrival);
    }

    this.findShortestTimePath = (departure, arrival)=> {
        const algorithm = new this.Algorithm();
        algorithm.init(this.paths.map((path)=>(
                {
                    departure: path.departure,
                    arrival: path.arrival,
                    weight: path.time
                }
            )
        ));
        return algorithm.findShortestPath(departure, arrival);
    }
}

