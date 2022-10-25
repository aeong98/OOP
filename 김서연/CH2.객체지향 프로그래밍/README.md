# 1. 영화 예매 시스템
- 영화, 상영
- 할인 정책, 할인 조건 -> 할인
- 예매 정보 (제목, 상영정보, 인원, 정가, 결제금액)


# 2. 객체 지향 프로그래밍을 향해
## 협력, 객체, 클래스
- 1. 어떤 클래스가 필요한지를 고민하기 전에, 어떤 객체들이 필요한지 고민해라. 어떤 객체들이 어떤 상태와 행동을 가지는지를 먼저 결정해야 한다.
- 2. 객체를 독립적인 존재가 아니라 기능을 구현하기 위해 협력하는 공동체의 일원으로 봐야 한다. 

## 도메인의 구조를 따르는 프로그램 구조
- **도메인** : 문제를 해결하기 위해 사용자가 프로그램을 사용하는 분야
- 요구사항과 프로그램을 객체라는 동일한 관점에서 바라볼 수 있기 떄문에, 도메인을 구성하는 개념들이 프로그램의 객체와 클래스로 매끄럽게 연결될 수 있다.
- 일반적으로 클래스의 이름은 대응되는 도메인 개념의 이름과 동일하거나, 적어도 유사하게 지어야 한다.
- 영화 `Movie` 상영 `Screening` 
- 할인정책 `DiscountPolicy` 금액할인정책 `AmountDiscountPolicy`, 비율할인정책 `PercentDiscountPolicy`
- 할인 조건 `DiscountCondition` 순번 조건 `SequenceCondition`, 기간 조건 `PeriodCondition` 
- 예매 `Reservation`

## 클래스 구현하기
### Screening 클래스만들기
  - 인스턴스 변수의 가시성은 private, 메서드의 가시성은 public
  - 클래스를 구현하거나, 다른 개발자에 의해 개발된 클래스를 사용할 때 가장 중요한 것은 클래스의 경계를 구분 짓는 것.
  - 외부에서는 객체의 속성에 직접 접근할 수 없도록 막고, 적절한 public 메서드를 통해서만 내부 상태를 변경할수 있게 해야 한다.
  - 이렇게 내부와 외부를 구분하는 이유? -> `객체의 자율성을 보장하기 때문` 

### 자율적인 객체
- 객체는 상태(state) 와 행동(behavior)를 함께 가지는 복합적인 존재이다.
- 객체는 스스로 판단하고 행동하는 자율적인 존재이다.
- 데이터와 기능을 객체 내부로 함께 묶는 것을 `캡슐화` 라고 한다.
- 대부분의 객체지향 프로그래밍 언어는 외부에서의 접근을 통제할 수 있는 `접근제어(access control)` 메커니즘도 함께 제공한다.
- 많은 프로그래밍 언어들은 접근 제어를 위해 public, protected, private 과 같은 `접근 수정자(access modifier)`를 제공한다.

### 인터페이스와 구현의 분리(seperation of interface and implementation)
- 외부에서 접근 가능한 부분 -> `퍼블릭 인터페이스(public interface)`
- 오직 내부에서만 접근 가능한 부분 -> `구현(implementation)`

### 프로그래머의 자유
- 프로그래머의 역할을 클래스 작성자(class creator) 와 클라이언트 프로그래머(client programmer)로 구분하는 것이 유용하다. 
- 클래스 작성자 : 새로운 데이터 타입을 프로그램에 추가
- 클라이언트 프로그래머 : 클래스 작성자가 추가한 데이터 타입을 사용
- 클래스 작성자는 클라이언트 프로그래머에 대한 영향을 걱정하지 않고도 내부 구현을 마은대로 변경할 수 있어야 한다 -> `구현은닉(implementation hiding)`

## 협력하는 객체들의 공동체
- 객체는 다른 객체의 인터페이스에 공개된 행동을 수행하도록 `요청(request)` 할 수 있다.
- 요청을 받은 객체는 자율적인 방법에 따라 요청을 처리한 후 `응답(response)` 한다.
- 이 처럼 수신된 메시지를 처리하기 위한 자신만의 방법을 `메서드(method)`라고 한다.
- 메시지와 메서드를 구분하는 것은 매우 중요하다. ->  `다형성(polymorphism) `.

# 3. 할인 요금 구하기
## 할인 요금 계산을 위한 협력 시작하기
```
this.calculateMovieFee=(screening: Screening)=>_fee.minus(_discountPolicy.calculateDiscountAmount(screening));
```
- 위 코드에는 어떤 할인 정책을 사용할 것인지 결정하는 코드가 어디에도 존재하지 않는다. -> 단지 discountPolicy에게 메시지를 전달할 뿐이다.
- DiscountPolicy 는 할인 여부와 요금 계산에 필요한 전체적인 흐름은 정의하지만 실제로 요금을 계산하는 부분은 추상 메서드에게 위임한다.
- 이렇게, 부모 클래스에게 기본적인 알고리즘의 흐름을 구현하고 중간에 필요한 처리를 자식 클래스에게 위임하는 디자인 패턴을 [Template Moethod] 라고 부른다.
- 오버라이딩 (overriding) : 부모 클래서으세어 정의된 이름, 같은 파라미터 목록을 가진 메서드를 다시 정의
- 오버 로딩 (overloading) : 메서드의 이름은 같지만 파라ㄷ터 목록이 다른 경우

# 4. 상속과 다형성
- Movie는 DiscountPolicy 와 연결돼 있으며, AmountDiscountPolicy 와 PercentDiscountPolicy 는 추상 클래스인 DiscountPolicy를 상속받는다.
- 이처럼 어떤 클래스가 다른 클래스에 접근할 수 있는 경로를 가지거나, 해당 클래스의 객체의 메서드를 호춣할 경우 두 클래스 사이에 의존성이 존재한다고 말한다.
- 문제는 영화 요금을 계산하기 위해서는 AmountDiscountPolicy, PercentDiscountPolicy 가 필요하다는 것이다. (하지만 코드 수준에서 이 두 클래스 중 어떤 것에도 의존하지 않는다.)
- 그러면,실행시점에 협력 가능한 이유는..?
- Movie 의 생성자엣 DiscountPolicy 타입의 객체를 받았었다. -> 실행시에 Movie 인스턴스는 AmountDiscountPolicy 클래스의 인스턴스에 의존하게 될 것이다. 
```
let avatar = new (Movie as any)(
        new (Money as any)(1000), 
        20, 
        "아바타", 
        new (AmountDiscountPolicy as any)( new (Money as any)(100), [])
)
```
- 클래스 사이의 의존성과 객체 사이의 의존성은 동일하지 않을 수 있다.
- 코드의 의존성과 실행 시점의 의존성이 다를 수록 코드를 이해하기 어려워 진다.
- 하지만, 코드의 의존성과 실행 시점의 의존성이 다를 수록 코드는 유연해지고 확장 가능해진다.

### 차이에 의한 프로그래밍
- 상속은 객체지향에서 코드를 재사용하기위해 가장 널리 사용되는 방법이다.
- 상속을 이용하면 클래스 사이에 관계를 설정하는 것만으로 기존 클랫가 가지고 있는 모든 속성과 행동을 새로운 클래스에 포함시킬 수 있다.
- 부모 클래스와 다른 부분만을 추가해서 새로운 클래스를 쉽고 바르게 만드는 방법을 `차이에 의한 프로그래밍` 이라고 부른다.

### 상속과 인터페이스
- 상속을 통해 자식 클래스는 부모 클래스가 수신할 수 있는 모든 메시지를 수신할 수 있다.
```
    this.calculateMovieFee=(screening: Screening)=>_fee.minus(_discountPolicy.calculateDiscountAmount(screening));

```
- 위에처럼 calculateDiscountAmount 메시지를 수신할 수 있다면, Movie 와 협력할 수 있다.
- 자식 클래스는 부모 클래스의 인터페이스를 물려받기 때문에, 부모 클래스 대신 사용될 수 있다. (업캐스팅(upcasting))

### 다형성
- 메시지와 메서드는 다른 개념이다.
- 각 자식 클래스에서 오버라이딩한 메서드가 실행될 것이다.
- 동일한 메시지를 전송하지만, 실제로 어떤 메서드가 실행될 것인지는 메시지를 수신하는 객체의 클래스가 무엇이냐에 따라 달라진다. -> 다형성
- 다형성은 컴파일 시간 의존성과, 실행 시간 의존성을 다르게 만들수 있는 객체지향의 특성을 이용해 서로 다른 메서드를 실행할 수 있게 한다.
- 다형성이란 동일한 메시지를 수신했을 때 객체의 타입에 따라 달게 응답할 수 있는 능력을 의미한다.
- 따라서 협력에 참여 하는 객체들은 모두 같은 메시지를 이해할 수 있어야 한다. -> 다시말해 인터페이스가 동일해야 한다는 것이.
- 메시지와, 메서드를 실행시점에 바인딩하는 것을 지연 바인딩(lazy binding), 동적 바인딩(dynamic binding) 이라고 부른다. 

### 구현 상속과 인터페이스 상속
- 구현 상속 (implementation inheritance, 서브클래싱 (subclassing) : 코드 재사용
- 인터페이스 상속 (interface inheritance, 서브타이핑(subtyping)) : 다형적인 협력 
- 상속은 인터페이스 상속을 위해 사용해야 한다. 

### 인터페이스와 다형성
- 종종 구현은 공유할 필요가 없고, 순수하게 인터페이스만 공유하고 싶을 때가 있다. 
- C#과 자바에서는 인터페이스라는 프로그래밍 요소를 제공한다.
 - 추상 클래스를 이용해 다형성을 구현했던 할인 정책과 달리 할인 조건은 구현을 공유할 필ㅎ가 없기 때문에, 인터페이스를 이용해 타입계층을 구현한다.

# 5. 추상화와 유연성
### 추상화의 힘
- 같은 계층에 속하는 클래스들이 공통으로 가질 수 있는 인터페이스를 정의하며, 구현의 일부 또는 전부를 자식 클래스가 결정할 수 있도록 결정권을 위임한다.
- 추상화를 사용하면 **세부적인 내용을 무시한채 상위 정책을 쉽고 간단하게 표현할 수 있다.**
- 할인 정책이나, 할인 조건의 새로운 자식 클래스들은 추상화를 이용해서 정의한 상위의 협력 흐름을 그대로 따르게 된다.
- 이는, 재사용 가능한 설계의 기본을 이루는 **디자인 패턴(design patter)** 이나 **프레임워크(framework)** 의 근간을 이룬다.
- 추상화를 이용해, 상위 정책을 표현하면 기존 구조를 수정하지 않고도 새로운 기능을 쉽게 추가하고 확장할 수 있다.

### 유연한 설계
- **책임의 위치를 결정하기 위해 조건문을 사용하는 것은 협력의 설계 측면에서 대부분 좋지 않은 경우이다**
- 할인요금이 0원일때를 에외처리하기 위해 -> 이 할인 요금을 계산할 책임을 그대로 DiscountPolicy 계층에 유지시키는 것이다. `NoneDiscountPolicy` 클래스를 추가하자.

```
interface NoneDiscountPolicy extends DiscountPolicy{}

function NoneDiscountPolicy():DiscountPolicy{
    const calculateDiscountAmount = (screening: Screening)=> Money(0);
    const getDiscountAmount = (screening: Screening) => Money(0);

    return Object.freeze({
        calculateDiscountAmount,
        getDiscountAmount
    })
}

/**할인 요금이 0원일 경우 */
let starWars = Movie(
    Money(1000),
    20,
    "스타워즈",
    NoneDiscountPolicy()
)

```
- 이 때 중요한 것은 기존의 Movie, DiscountPolicy 는 수정하지 않고, NoneDiscountPolicy라는 새로운 클래스를 추가하는 것만으로 애플리케이션의 기능을 확장했다는것이다.
- 추상화를 중심으로 코드의 구조를 설계하면, 유연하고 확장 가능한 설계를 만들 수 있다. 

### 코드 재사용
- 코드 재사용을 위해서는 상속보다는 합성(composition)이 더 좋은 방법일 수 도 있다. 
- 합성은 다른 객체의 인스턴스를 자신의 인스턴스 변수로 포함해서 재사용하는 방법을 말한다. 
- Movie 가 DiscountPolicy의 코드를 재사용하는 방법을 Movie 를 직접 상속받아 AmountDiscountMovie 와 PecentDiscountMovie 라는 두개의 클래스를 추가하면 합성을 사용한 기존 방법과 동일하다. 

## 그럼에도, 상속 대신 합성을 선호하는 이유는?
### 상속
- 두가지 관점에서 설계에 안 좋은 영향을 미친다.
- 1. 캡슐화를 위반한다는 것
  - 상속을 이용하기 위해서는 부모 클래스의 내부 구조를 잘 알고 있어야 한다.
  - 자식클래스가 부모 클래스에 강하게 결합되도록 만들기 때문에, 부모 클래스를 변경할 때 자식 클래스도 함께 변경될 확률을 높인다.
- 2. 설계를 유연하지 못하게 만든다는 것
  - 상속은 부모 클래스와 자식 클래스 사이의 관계를 컴파일 시점에 결정한다. 따라서, 실행 시점에 객체의 종류를 변경하는 것이 불가능하다.
  - 반면, 인스턴스 변수로 연결한 기존 방법을 사용하면 실행 시점에 할인 정책을 간단하게 변경할 수 있다.
  ```
      const changeDiscountPolicy=(discountPolicy:DiscountPolicy) =>{_discountPolicy=discountPolicy};

      // 인스턴스 변수로 연결해두었기 떄문에, 실행 시점에 할인 정책을 간단하게 변경할 수 있게된다.
      starWars.changeDiscountPolicy(AmountDiscountPolicy(Money(100), SequenceCondition(10)))
  ```

### 합성
- Movie는 요금을 계산하기 위해 DiscountPolicy의 코드를 재사용한다.
- Movie 가ㅇDiscountPolicy의 인터페이스를 통해 약하게 결합된다는 것이다. 실제로는 Movie 는 DiscountPolicy가 외부에 calculateDiscountAmount 메서드를 제공한다는 사실만 알고, 내부 구현에 대해서는 전혀 알지 못한다.
- 이처럼 인스페이스에 정의된 메시지를 통해서만 코드를 재사용하는 방법을 `합성` 이라고 한다.

## 정리
- 이번 2장 예제코드에서 Movie 와 Discount는 합성관계로 연결돼있고
- DiscountPolicy 와 AmountDiscoutPolicy, PercentDiscoutPolicy 는 상속 관계로 연결돼있다.
- 이처럼 코드를 재사용하는 경우에는, 상속보다 합성을 선호하는 것이 옳지만 다형성을 위해 인터페이스를 재사용하는 경우에는 상속과 합성을 함께 조합해서 사용할 수 밖에 없다.
