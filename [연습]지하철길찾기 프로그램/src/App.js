import SubwayNavigation from "./service/SubwayNavigation.js";
import {DijkstraNavigation} from "./service/DijkstraNavigation.js";
import paths from './model/paths.js';
import ArrivalInput from "./components/ArrivalInput.js";
import DepartureInput from "./components/DepartureInput.js";
import SearchTypeRadioButton from "./components/SearchTypeRadioButton.js";
import SearchSubmitButton from "./components/SearchSubmitButton.js";
import SearchResult from "./components/SearchResult.js";
import SearchPathValidator from "./service/SearchPathValidator.js";
import {constructObject} from "./utils/constructObject.js";

export default function App({$target}){
    this.state={
        paths: paths,
        arrival: '',
        departure: '',
        searchType: 'shortest-long',
        searchResult:undefined,
    }

    this.setState= (nextState)=>{
        this.state= nextState;
    }

    const departureInput = new DepartureInput({
        $target,
        initialState: this.state.departure,
        onChange: (departure)=>{
            this.setState({
                ...this.state,
                departure: departure
            })
        }
    })

    const arrivalInput = new ArrivalInput({
        $target,
        initialState: this.state.arrival,
        onChange: (arrival)=>{
            this.setState({
                ...this.state,
                arrival: arrival,
            })
        }
    })

    const searchTypeRadioButton = new SearchTypeRadioButton({
        $target,
        initialState:this.state.searchType,
        onChange: (searchType)=>{
            this.setState({
                ...this.state,
                searchType: searchType
            })
        }
    })

    const searchSubmitButton = new SearchSubmitButton({
        $target,
        onClick: ()=>{
            try{
                validateInputs(this.state.paths, this.state.departure, this.state.arrival);
                switch (this.state.searchType){
                    case "shortest-long" : findShortestLongPath(); break;
                    case "shortest-time" : findShortestTimePath(); break;
                }
                searchResult.setState({
                    searchType: this.state.searchType,
                    searchResult: this.state.searchResult,
                })
            }catch(error){
                alert(error);
            }
        }
    });

    const validateInputs = (paths, departure, arrival)=>{
        const searchPathValidator = constructObject(SearchPathValidator,{
            $paths: paths,
            $departure: departure,
            $arrival: arrival,
        })
        searchPathValidator.validate();
    }

    const subwayNavigation = constructObject(SubwayNavigation,{
        $paths: this.state.paths,
        $Algorithm: DijkstraNavigation
    });

    const findShortestLongPath = ()=>{
        const result= subwayNavigation.findShortestLongPath(this.state.departure, this.state.arrival);
        this.setState({
            ...this.state,
            searchResult: result,
        })
    };

    const findShortestTimePath = ()=>{
        const result= subwayNavigation.findShortestTimePath(this.state.departure, this.state.arrival);
        this.setState({
            ...this.state,
            searchResult: result,
        })
    };

    const searchResult = new SearchResult({
        $target,
        initialState:{
            searchType: this.state.searchType,
            searchResult: this.state.searchResult,
        }
    });
}





