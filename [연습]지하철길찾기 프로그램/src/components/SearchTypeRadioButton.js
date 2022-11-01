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
            <div>
              <input type="radio" id="shortest-long" name="search-type" value="shortest-long">
              <label for="shortest-long">최단거리</label>
            </div>
            <div>
              <input type="radio" id="shortest-time" name="search-type" value="shortest-time">
              <label for="shortest-time">최소시간</label>
            </div>
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