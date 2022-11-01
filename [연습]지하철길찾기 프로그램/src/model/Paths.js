export default function Paths(){
    this.init=($paths)=>{
        this.paths=$paths;
    };

    this.getPaths=()=> this.paths.map((path)=>(
        {
            departure: path.departure,
            arrival: path.arrival,
            weight: path.weight,
        })
    );
}