export default function ArrivalInput({$target, initialState, onChange}){
    this.state= initialState;

    this.$element = document.createElement('div');
    $target.appendChild(this.$element);

    this.setState=(nextState)=>{
        this.state= nextState;
        this.render();
    }

    this.render = ()=>{
        const htmlString =`
            <label for="arrival">도착지</label>
            <input id="arrival" name="arrival"/>
        `;

        this.$element.innerHTML=htmlString;
        const input = this.$element.querySelector('#arrival');
        input.value= this.state;
    }

    this.render();

    this.$element.addEventListener('keyup', (e)=>{
        const $input = e.target.closest('input[id="arrival"]');
        if(!$input){
            return;
        }
        const {value}= $input;
        onChange(value);

    })

}