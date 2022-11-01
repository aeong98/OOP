export default function Paths(){
    this.init=($paths)=>{
        this.paths=$paths;
    }

    this.getPathsWithDistanceWeight=()=>this.paths.map((path)=>(
        {
            departure: path.departure,
            arrival: path.arrival,
            weight: path.distance,
        })
    );

    this.getPathsWithTimeWeight=()=>this.paths.map((path)=>(
        {
            departure: path.departure,
            arrival: path.arrival,
            weight: path.time,
        })
    );
}