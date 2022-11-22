# 1. 개방-폐쇄 원칙 (OCP)


- 로머트 마틴
    - 소프트웨어 개체는 확장에 대해 열려 있어야 하고, 수정에 대해서는 닫혀 있어야 한다.

## 컴파일타임 의존성을 고정시키고, 런타임 의존성을 변경해라.

- **런타임 의존성**
    - 실행시에 협력에 참여하는 객체들 사이의 관계
- **컴파일타임 의존성**
    - 코드에서 드러나는 클래스 사이의 관계
- ex ) 영화예매 시스템
    - 컴파일타임 : Movie → DiscountPolicy
    - 런타임 : Movie → AmountDiscountPolicy, Movie → PercentDiscountPolicy
- 개방-폐쇄 원칙을 수용하는 코드는 컴파일타임 의존성을 수정하지 않고도, 런타임 의존성을 쉽게 변경할 수 있다.

## 추상화가 핵심이다.

- **`개방 - 폐쇄 원칙`**의 핵심은 추상화에 의존하는 것이다.
- **`추상화`**란
    - 핵심적인 부분만 남기고, 불필요한 부분은 생각함으로써 복잡성을 극복하는 기법
    - 변하지 않는 부분만 남게됨.
        - 다양한 상황에서의 공통점을 반영한 추상화의 결과물.
        - **수정할 필요가 없다. (수정에 대해 닫혀 있다.)**
    - 변하는 부분은 생략
        - **확장의 여지를 남긴다.**

# 2. 생성 사용 분리

```ruby
public class Movie{
	private DiscountPolicy discountPolicy;
	
	public Movie(String title, Duration runningTime, Money fee){
		...
		this.discountPolicy = new AmountDiscountPolicy(...);
	}

	public Money calculateMovieFee(Screening screnning){
		return fee.minus(discountPolicy.calculateDiscountAmount(screening));
	}
}
```

- 결합도가 높아질 수록 개방 -폐쇄 원칙을 따르는 구조를 설계하기 어려워진다.
- 객체의 타입과 생성자에 전달해야하는 인자에 대한 과도한 지식은 코드를 특정한 컨텍스트에 강하게 결합시킨다.
- 객체 생성은 피할 수 없다. **(생성하는 장소가 중요함.)**
- 유연하고 재사용 가능한 설계를 원한다면 객체와 관련된 두 가지 책임을 서로 다른 객체로 분리해야 한다.
- 객체애 대한 **생성과 사용을 분리 (seperating user from creation)**
- 사용으로부터 생성을 분리하는 데 사용되는 가장 보편적인 방법은 **객체를 생성할 책임을 클라이언트로 옮기는 것이다.**

```ruby
public class Client{
	public Money getAvartarFee(){
		Movie avartar = new Movie("아바타",
															Duration.ofMinutes(120),
															Money.wons(10000),
															new AmountDiscountPolicy(...));
		return avatar.getFee();
	}
}
```

## FACTORY  추가하기

- 위의 코드에서 Client 는 Movie 의 인스턴스를 생성하는 동시에 getFee 메시지도 함께 전송한다.
    - 생성과 사용의 책임을 함께 지니고 있는 것.
- 객체 생성과 관련된 책임만 전담하는 별도의 객체를 추가하고 Client 는 이 객체를 사용하도록 만들 수 있다.
- 이처러 생성과 사용을 분리하기 위해 **객체 생성에 특화된 객체를 FACTORY 라고 부른다.**

```ruby
public class Factory{
	public Movie createAvatarMovie(){
		return new Movie("아바타",
										Duration.ofMinutes(120),
										Money.wons(100000),
										new AmountDiscountPolicy('');
	}
}
```

## 순수한 가공물에게 책임 할당하기

- 표면적 분해 (representational decomposition)
    - 도메인에 존재하는 사물 또는 개념을 표현하는 객체들을 이용해 시스템을 분해하는 것.
- 행위적 분해 (behavioral decomposition)

# 3. 의존성 주입

- 의존성 주입
    - 생성자 주입 (constructor injection)
    - setter 주입 (setter injection)
    - 메서드 주입 (method injection)

## 숨겨진 의존성은 나쁘다

- **SERVICE LOCATOR 패턴**
    - 서비스를 사용하는 코드로부터 서비스가 누구인지 (서비스를 구현한 구체 클래스의 타입이 무엇인지), 어디에 있는지 (클래스 인스턴스를 어떻게 얻을지)를 몰라도 되게 해준다.
    
    ```ruby
    public class ServiceLocator{
    	// 싱글톤..?
    	private static ServiceLocator soleInstance = new ServiceLocator();
    	private DiscountPolicy discountPolicy;
    
    	public static DiscountPolicy discountPolicy(){
    		return soleInstance.discountPolicy;
    	}
    
    	public static void provide(DiscountPolicy discountPolicy){
    		soleInstacne.discountPolicy = discountPolicy;
    	}
    
    	private ServiceLocator(){
    	}
    }
    ```
    
    - Movie 인스턴스가 AmountDiscountPolicy의 인스턴스에 의존하기를 원한다면 다음과 같이 ServiceLocator에 인스턴스를 등록한후, Movie 를 생성하면 된다.
    
    ```ruby
    ServiceLocator.provide(new AmountDiscountPolicy(...));
    
    **// 의존성을 감춤.**
    Movie avatar = new Movie("아바타",
    												 Duration.ofMinutes(120),
    												 Money.wons(10000));
    ```
    
    - **단점**
        - **의존성을 감춘다는것**
        - 의존성과 관련된 문제가 컴파일 타임이 아닌 런타임에 가서야 발견된다는 사실을 알 수 있다. 숨겨진 의존성이 이해하기 어렵고 디버깅하기 어려운 **이유는 문제점을 발견할 수 있는 시점을 코드 작성 시점이 아니라 실행 시점으로 미루기 때문이다.**

# 4. 의존성 역전 원칙


```ruby
public class Movie{
	private AmountDiscountPolicy discountPolicy;
}
```

- 이 설계가 변경에 취약한 이유 → 요금을 계산하는 상위 정책이 요금을 계산하는데 필요한 구체적인 방법에 의존하기 때문이다.
- 상위 수준 클래스인 Movie 가 하위 수준 클래스인 AmountDiscountPolicy 에 의존하는 것이다.
- 객체 사이의 협력이 존재할 때 그 협력의 본질을 담고 있는 것은 상위 수준의 정책이다.
- 하위 수준의 AmountDiscountPolicy를 PercentDiscountPolicy로 변경한다고 해서 상위 수준의 Movie 가 영향을 받아서는 안된다.
- 이런 경우에도 추상화를 통해 해결할 수 있다.
    - Movie 와 AmountDiscountPolicy 사이에 추상 클래스인 DiscountPolicy가 자리잡는 이유이다.

1. 상위 수준의 모듈은 하위 수준의 모듈에 의존해서는 안된다. 둘 모두 추상화에 의존해야 한다.
2. 추상화는 구체적인 사항에 의존해서는 안된다. 구체적인 사항은 추상화에 의존해야 한다.

**이를 의존성 역전 원칙(Dependency Inversion Principle)이라고 한다.**

## 의존성 역전 원칙과 패키지

- Movie를 정상적으로 컴파일하기 위해서는 DiscountPolicy클래스가 필요한다.
- 코드의 컴파일이 성공하기 위해 팜께 존재해야 하는 코드를 정의하는 것이 컴파일타임의존성이다.
- DiscountPolicy가 포함된 패키지 않의 어떤 클래스가 수정되더라도 패키지 전체가 재배포돼야 한다.
- 이로 인해 이 패키지에 의존하는 Movie 클래스가 포함된 패키지 역시 재컴파일돼야 한다.
- Movie 에 의존하는 또 다른 패키지가 있다면 컴파일은 의존성의 그래프를 타고 애플리케이션 코드 전체로 번져갈 것이다. 따라서 불필요한 클래스들을 같은 패키지에 두는 것은 전체적인 빌드 시간을 가파르게 상승시킨다.
- Movie의 재사용을 위해 필요한 것이 DiscountPolicy 뿐이라면 DiscountPolicy를 Movie 와 같은 패키지로 모으고, AmoundDiscountPolicy와 PercentDiscountPolicy를 별도의 패키지에 위치시켜 의존성 문제를 해결할 수 있다.
- **따라서 추상화를 별도의 독립적인 패키지가 아니라, 클라이언트가 속한 패키지에 포함시켜야 한다.**
- **이를 SPERATED INTERFACE 패턴 이라고도 부른다.**
- **따라서 의존성 역전 원칙에 따라 상위 수준의 협력흐름을 재사용하기 위해서는 추상화가 제공하는 인터페이스의 소유권 역시 역전시켜야 한다.**

# 5. 유연성에 대한 조언


- 유연하고 재사용 가능한 설계란
    - 런타임 의존성과, 컴파일타임 의존성의 차이를 인식하고
    - 동일한 컴파일타임 의존성으로부터 다양한 런타임 의존성을 만들 수 있는 코드 구조를 가지는 설계이다.
- 유연성은 항상 복잡성을 수반하다.
- 유연하지 않은 설계는 단순하고 명확하다.

## 협력과 책임이 중요하다.

- 설계를 유연하게 만들기 위해서는 협력에 참여햐는 객체가 다른 객체에게 어떤 메시지를 전송하는지가 중요하다.
- Movie 가 다양한 할인 정책과 협력할 수 있는 이유?
    - 모든 할인 정책이 Movie 가 전송하는 calculateDiscountAmount 메시지를 이해할 수 있기 떄문이다.
