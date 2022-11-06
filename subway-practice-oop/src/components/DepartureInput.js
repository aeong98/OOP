export default function DepartureInput({$target, initialState, onChange}){
    this.state= initialState;

    this.$element = document.createElement('div');
    $target.appendChild(this.$element);

    this.setState=(nextState)=>{
        this.state= nextState;
        this.render();
    }

    this.render = ()=>{
        const htmlString =`
             <label for="departure">출발지</label>
             <input id="departure" name="departure"/>
        `;

        this.$element.innerHTML=htmlString;
        const input = this.$element.querySelector('#departure');
        input.value= this.state;
    }

    this.render();

    this.$element.addEventListener('keyup', (e)=>{
        const $input = e.target.closest('input[id="departure"]');
        if(!$input){
            return;
        }

        const {value}= $input;
        onChange(value);
    })

}