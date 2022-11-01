import {SEARCH_TYPE_TEXT, SEARCH_TYPE_TEXT_UNIT} from "../constants.js";

export default function SearchResult({$target, initialState}){
    this.state= initialState;

    this.$element = document.createElement('div');
    $target.appendChild(this.$element);

    this.setState=(nextState)=>{
        this.state= nextState;
        this.render();
    }

    this.render = ()=>{
        if(!this.state.pathSearchResult) {
            return;
        };

        const htmlString =`
            <h2>${SEARCH_TYPE_TEXT[this.state.searchType]} </h2>
            <div>경로 : ${this.state.pathSearchResult.route.join(">")}</div>
            <div style="display: flex;">
                <span>${SEARCH_TYPE_TEXT_UNIT[this.state.searchType]}</span>
                <div>${this.state.pathSearchResult.weight.join(",")}</div>
            </div>
        `;
        this.$element.innerHTML=htmlString;
    }

    this.render();
}
