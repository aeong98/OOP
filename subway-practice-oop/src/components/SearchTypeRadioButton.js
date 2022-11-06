import {SEARCH_TYPE_TEXT, SHORTEST_DISTANCE, SHORTEST_TIME} from "../constants.js";

export default function SearchTypeRadioButton({$target, initialState, onChange}){
    this.state= initialState;

    this.$element = document.createElement('div');
    $target.appendChild(this.$element);

    this.setState=(nextState)=>{
        this.state= nextState;
        this.render();
    }

    this.render = ()=>{
        const htmlString =`
          <div style="display: flex;">
            ${
                [SHORTEST_DISTANCE, SHORTEST_TIME].map(name=> `
                     <div>
                      <input type="radio" name="search-type" id=${name} value=${name}>
                      <label for=${name}>${SEARCH_TYPE_TEXT[name]}</label>
                    </div>
                `).join('')
            }
           </div>
        `;

        this.$element.innerHTML=htmlString;
        this.$element.querySelector(`#${this.state}`).checked=true;
    }

    this.render();

    this.$element.addEventListener('click', (e)=>{
        const $radio = e.target.closest("input[type='radio']");
        if(!$radio){
            return;
        }
        const {checked}= $radio;
        if(checked){
            onChange($radio.id);
        }
    })

}