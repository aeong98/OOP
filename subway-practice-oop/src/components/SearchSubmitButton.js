export default function SearchSubmitButton({$target, onClick}){
    this.$element = document.createElement('div');
    $target.appendChild(this.$element);

    this.render = ()=>{
        const htmlString =`
            <button type="submit">길찾기</button>
        `;

        this.$element.innerHTML=htmlString;
    }

    this.render();

    this.$element.addEventListener('click', (e)=>{
        const $button = e.target.closest('button');
        if(!$button){
            return;
        }
        onClick();
    })

}