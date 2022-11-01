import SubwayNavigation from "./service/SubwayNavigation.js";
import {DijkstraNavigation} from "./service/DijkstraNavigation.js";

import data from './data/data.js';
import ArrivalInput from "./components/ArrivalInput.js";
import DepartureInput from "./components/DepartureInput.js";
import SearchTypeRadioButton from "./components/SearchTypeRadioButton.js";
import SearchSubmitButton from "./components/SearchSubmitButton.js";
import SearchResult from "./components/SearchResult.js";
import {createObject} from "./utils/object.js";
import {SHORTEST_DISTANCE, SHORTEST_TIME} from "./constants.js";

export default function App({$target}){
    this.state={
        $paths: data,
        $arrival: '',
        $departure: '',
        $searchType: SHORTEST_DISTANCE,
    };

    this.setState= (nextState)=>{
        this.state= nextState;
    };

    const departureInput = new DepartureInput({
        $target,
        initialState: this.state.$departure,
        onChange: (departure)=>{
            this.setState({
                ...this.state,
                $departure: departure
            })
        }
    });

    const arrivalInput = new ArrivalInput({
        $target,
        initialState: this.state.$arrival,
        onChange: (arrival)=>{
            this.setState({
                ...this.state,
                $arrival: arrival,
            })
        }
    });

    const searchTypeRadioButton = new SearchTypeRadioButton({
        $target,
        initialState:this.state.$searchType,
        onChange: (searchType)=>{
            this.setState({
                ...this.state,
                $searchType: searchType
            })
        }
    });

    const searchSubmitButton = new SearchSubmitButton({
        $target,
        onClick: ()=>{
                const pathSearchResult= findPath();
                searchResult.setState({
                    ...this.state,
                    $pathSearchResult: pathSearchResult,
                })
        }
    });

    const searchResult = new SearchResult({
        $target,
        initialState:{
            $searchType: this.state.$searchType,
            $pathSearchResult: undefined,
        }
    });

    const findPath = () =>{
        const {$paths, $departure, $arrival, $searchType} = this.state;

        const subwayNavigation = createObject(SubwayNavigation,{
            paths: $paths,
            Algorithm: DijkstraNavigation,
        });

        switch ($searchType){
            case SHORTEST_DISTANCE :
                return subwayNavigation.findShortestDistancePath($departure, $arrival);
            case SHORTEST_TIME :
                return subwayNavigation.findShortestTimePath($departure, $arrival);
        };
    };
}





