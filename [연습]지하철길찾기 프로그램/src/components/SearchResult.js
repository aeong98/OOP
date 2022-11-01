const SEARCH_TYPE_TEXT=Object.freeze({
    'shortest-long' : '최단거리',
    'shortest-time': '최소시간',
});

const SEARCH_TYPE_TEXT_UNIT=Object.freeze({
    'shortest-long' : 'km',
    'shortest-time': '시간',
})

export default function SearchResult({$target, initialState}){
    this.state= initialState;

    this.$element = document.createElement('div');
    $target.appendChild(this.$element);

    this.setState=(nextState)=>{
        this.state= nextState;
        this.render();
    }

    this.render = ()=>{
        if(!this.state.searchResult) {
            return;
        };

        const htmlString =`
            <h2>${SEARCH_TYPE_TEXT[this.state.searchType]} </h2>
            <div>경로 : ${this.state.searchResult.route.join(">")}</div>
            <div style="display: flex;">
                <span>${SEARCH_TYPE_TEXT_UNIT[this.state.searchType]}</span>
                <div>${this.state.searchResult.weight.join(",")}</div>
            </div>
        `;
        this.$element.innerHTML=htmlString;
    }

    this.render();
}
