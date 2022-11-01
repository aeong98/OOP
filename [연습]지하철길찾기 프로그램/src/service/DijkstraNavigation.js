import Dijkstra from "../utils/Dijkstra.js";

export function DijkstraNavigation(){
    this.init = (paths)=>{
        this.dijkStra=new Dijkstra();
        paths.map((path)=>this.dijkStra.addEdge(path.departure, path.arrival, path.weight));
    }

    this.findShortestPath = (departure, arrival)=> {
        const result = this.dijkStra.findShortestPath(departure, arrival);
        if(!result){
            throw Error('출발역과 도착역이 연결되어있지 않습니다.');
        }
        return result;
    }
}