# Object-Study

## Contents

### 📚 책 스터디 진행 개요

오브젝트 : 코드로 이해하는 객체지향 설계 책을 읽으면서 정리한 내용입니다. [오브젝트 스터디 레포 링크](https://github.com/techeer-sv/Object-Study/tree/Seoyeon)

<image src="./image/object.png" width="300" />

<br />

### 예제 코드
> 각 챕터별로 예제코드는 Typescript + Factory Function 으로 작성해보았습니다. Factory Function 의 특징과, 장점은 아래와 같습니다.

#### Factory Function 이란?
##### 1. Factory Function 기본 사용 예제
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
##### 2. 캡슐화 (Encapsulation)
factory function 을 사용해 javascript class 의 `private class fields`를 사용하지 않고 캡슐화 `(Encapsulation)`를 구현할 수 있습니다.
```js
const todoModel = TodoModel('input');
console.log(todoModel.todos);       // undefined
console.log(todoModel.data)         // undefined
todoModel.add();                    // todoModel.add is not a function

```

##### 3. 불변성(Immutable)
정의된 함수를 변경할 수 없습니다.
```js
todoModel.add = function() {
  console.log('a new add');
}
todoModel.add();            // add
```

##### 4. 상속과 합성(Inheritance and Composition)
factory function 에서는 합성을 통해 코드를 재사용할 수 있습니다. (선별적으로 사용할 수 있습니다.) class 를 사용해서 구현하는 것과의 차이점은 아래와 같습니다. 상속과 합성이 모두 구현가능한 class 와 달리, factory function 에서는 합성으로 구현해야 합니다.
```js
/** 1. [class] 상속 **/
class Service {
  doSomething(){ console.log("doSomething"); }
}
class SpecialService extends Service {
  doSomethingElse(){ console.log("doSomethingElse"); }  
}
var specialService = new SpecialService();
specialService.doSomething();
specialService.doSomethingElse();

/** 2. [class] 합성 **/
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

/** 3. [factory function] 합성 **/
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
`this`는 nested function, callback 에서 컨텍스트 상실 문제가 발생할 수 있습니다. this 를 사용하지 않고 클로저 + 지역변수를 통해 OOP 를 구현할 수 있습니다. (arrow function 으로 해결가능하긴 합니답..)
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
`Òbject.freeze()` 를 통해 API 를 수정할 수 없게 막을 수 있습니다. 

<br/>

### 챕터 진행상황 

- [x] ~~1장 '객체, 설계'~~
- [x] ~~2장 '객체지향 프로그래밍'~~
- [x] ~~3장 '역할, 책임, 협력'~~
- [x] 4장 '설계 품질과 트레이드오프' 
- [x] **5장 '책임 할당하기' (발표)**
- [ ] 6장 '메세지와 인터페이스' 
- [ ] 7장 '객체 분해' 
- [ ] **8장 '의존성 관리하기' (발표)**
- [ ] 9장 '유연한 설계' 
- [ ] 10장 '상속과 코드 재사용'
- [ ] 11장 '합성과 유연한 설계' 
- [ ] 12장 '다형성' 
- [ ] 13장 '서브클래싱과 서브 타이핑' 
- [ ] 14장 '일관성 있는 협력'
- [ ] 15장 '디자인 패턴과 프레임워크' 
