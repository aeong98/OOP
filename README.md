# Object-Study

## Contents

### π μ± μ€ν°λ μ§ν κ°μ

μ€λΈμ νΈ : μ½λλ‘ μ΄ν΄νλ κ°μ²΄μ§ν₯ μ€κ³ μ±μ μ½μΌλ©΄μ μ λ¦¬ν λ΄μ©μλλ€. [μ€λΈμ νΈ μ€ν°λ λ ν¬ λ§ν¬](https://github.com/techeer-sv/Object-Study/tree/Seoyeon)

<image src="./image/object.png" width="300" />

<br />

### μμ  μ½λ
> κ° μ±ν°λ³λ‘ μμ μ½λλ Typescript + Factory Function μΌλ‘ μμ±ν΄λ³΄μμ΅λλ€. Factory Function μ νΉμ§κ³Ό, μ₯μ μ μλμ κ°μ΅λλ€.

#### Factory Function μ΄λ?
##### 1. Factory Function κΈ°λ³Έ μ¬μ© μμ 
````js 
function TodoModel(data){
  const todos = [];

  function addData() {
    console.log(`${data} addData`);
  }

  function add() { console.log('add'); }

  return Object.freeze({
    addData,
  });
}

const todoModel = TodoModel('input');
todoModel.addData();        // input addData

````
##### 2. μΊ‘μν (Encapsulation)
factory function μ μ¬μ©ν΄ javascript class μ `private class fields`λ₯Ό μ¬μ©νμ§ μκ³  μΊ‘μν `(Encapsulation)`λ₯Ό κ΅¬νν  μ μμ΅λλ€.
```js
const todoModel = TodoModel('input');
console.log(todoModel.todos);       // undefined
console.log(todoModel.data)         // undefined
todoModel.add();                    // todoModel.add is not a function

```

##### 3. λΆλ³μ±(Immutable)
μ μλ ν¨μλ₯Ό λ³κ²½ν  μ μμ΅λλ€.
```js
todoModel.add = function() {
  console.log('a new add');
}
todoModel.add();            // add
```

##### 4. μμκ³Ό ν©μ±(Inheritance and Composition)
factory function μμλ ν©μ±μ ν΅ν΄ μ½λλ₯Ό μ¬μ¬μ©ν  μ μμ΅λλ€. (μ λ³μ μΌλ‘ μ¬μ©ν  μ μμ΅λλ€.) class λ₯Ό μ¬μ©ν΄μ κ΅¬ννλ κ²κ³Όμ μ°¨μ΄μ μ μλμ κ°μ΅λλ€. μμκ³Ό ν©μ±μ΄ λͺ¨λ κ΅¬νκ°λ₯ν class μ λ¬λ¦¬, factory function μμλ ν©μ±μΌλ‘ κ΅¬νν΄μΌ ν©λλ€.
```js
/** 1. [class] μμ **/
class Service {
  doSomething(){ console.log("doSomething"); }
}
class SpecialService extends Service {
  doSomethingElse(){ console.log("doSomethingElse"); }  
}
var specialService = new SpecialService();
specialService.doSomething();
specialService.doSomethingElse();

/** 2. [class] ν©μ± **/
class Service {
  doSomething(){ console.log("doSomething"); }
}
class SpecialService{
  constructor(args){
    this.service = args.service;
  }
  doSomething() { this.service.doSomething(); } 
  
  doSomethingElse(){ console.log("doSomethingElse"); }
}
var specialService = new SpecialService({
   service : new Service()
});
specialService.doSomething();
specialService.doSomethingElse();

/** 3. [factory function] ν©μ± **/
function Service() {
  function doSomething(){ console.log("doSomething"); }
  return Object.freeze({
    doSomething
  });
}
function SpecialService(args){
  var service = args.service;
  function doSomethingElse(){ console.log("doSomethingElse"); }
  return Object.freeze({
    doSomething : service.doSomething,
    doSomethingElse
  });
}
var specialService = SpecialService({
   service : Service()
});
specialService.doSomething();
specialService.doSomethingElse();

```

##### 5. this
`this`λ nested function, callback μμ μ»¨νμ€νΈ μμ€ λ¬Έμ κ° λ°μν  μ μμ΅λλ€. this λ₯Ό μ¬μ©νμ§ μκ³  ν΄λ‘μ  + μ§μ­λ³μλ₯Ό ν΅ν΄ OOP λ₯Ό κ΅¬νν  μ μμ΅λλ€. (arrow function μΌλ‘ ν΄κ²°κ°λ₯νκΈ΄ ν©λλ΅..)
```js
function TodoModel(){
    var todos = [];
        
    function reload(){ 
        setTimeout(function log() { 
           console.log(todos);        //[]
       }, 0);
    }
}
todoModel.reload();                   //[]
$("#btn").click(todoModel.reload);    //[]
```

##### 6. Immutable API
`Γbject.freeze()` λ₯Ό ν΅ν΄ API λ₯Ό μμ ν  μ μκ² λ§μ μ μμ΅λλ€. 

<br/>

### μ±ν° μ§νμν© 

- [x] ~~1μ₯ 'κ°μ²΄, μ€κ³'~~
- [x] ~~2μ₯ 'κ°μ²΄μ§ν₯ νλ‘κ·Έλλ°'~~
- [x] ~~3μ₯ 'μ­ν , μ±μ, νλ ₯'~~
- [x] ~~4μ₯ 'μ€κ³ νμ§κ³Ό νΈλ μ΄λμ€ν'~~
- [x] ~~**5μ₯ 'μ±μ ν λΉνκΈ°' (λ°ν)**~~
- [x] ~~6μ₯ 'λ©μΈμ§μ μΈν°νμ΄μ€'~~
- [x] ~~7μ₯ 'κ°μ²΄ λΆν΄'~~
- [x] ~~**8μ₯ 'μμ‘΄μ± κ΄λ¦¬νκΈ°' (λ°ν)**~~
- [x] ~~9μ₯ 'μ μ°ν μ€κ³'~~
- [x] ~~10μ₯ 'μμκ³Ό μ½λ μ¬μ¬μ©'~~
- [ ] 11μ₯ 'ν©μ±κ³Ό μ μ°ν μ€κ³' 
- [ ] 12μ₯ 'λ€νμ±' 
- [ ] 13μ₯ 'μλΈν΄λμ±κ³Ό μλΈ νμ΄ν' 
- [ ] 14μ₯ 'μΌκ΄μ± μλ νλ ₯'
- [ ] 15μ₯ 'λμμΈ ν¨ν΄κ³Ό νλ μμν¬' 
