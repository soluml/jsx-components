https://github.com/mdn/web-components-examples/blob/main/life-cycle-callbacks/main.js
https://astexplorer.net/

export default class Wrapper extends HTMLElement {
static get observedAttributes() {
return ['c', 'l'];
}
constructor() {
super();

      const shadow = this.attachShadow({
        mode: 'open',
        delegatesFocus: false
      });

      const style = document.createElement('style');
      style.textContent = '';
      shadow.appendChild(style);
    }

}

const test = (
<Wrapper style="test">
<div>
<p>Hello World</p>
</div>
</Wrapper>
);
