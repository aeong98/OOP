
> 💡 객체지향에서 클래스를 재사용하는 전통적인 방법 **`상속`**에 대해 알아보고,
**`합성`** 과의 장단점에 대해 비교해보자!

# 1. 상속과 중복 코드

중복코드를 제거해야 할 이유는 아래와 같은 것들이 있다고 한다.

## DRY(Don’t Repeat Yourself) 원칙

- 중복코드가 가지는 가장 큰 문제는 코드가 수정하는 데 필요한 노력을 배로 증가시키는 것.
- 중복코드는 수정과 테스트에 드는 비용을 증가시킨다.
- 이때, 중복 여부를 판단하는 기준은 **변경이다**.
    - **요구사항이 변경됐을때 두 코드를 함께 수정해야 한다면 이 코드는 중복이다.**

## 중복과 변경

- **한달에 한번씩 가입자별로 전화 요금을 계산하는 애플리케이션**
    
    ### Call
    
    - 개별 통화 기간 저장
    
    ```java
    public class Call{
    	private LocalDateTime from;  // 통화 시작 시간
    	private LocalDateTiem to;    // 통화 종료 시간
    	
    	public Call(LocalDateTime from, LocalDateTime to){
    		this.from = from;
    		this.to = to;
    	}
    
    	public Duration getDuration(){
    		return Duration.between(from,to);
    	}
    
    	public LocalDateTime getFrom(){
    		return from;
    	}
    	
    }
    ```
    
    ### Phone
    
    - Call 의 목록 관리
    
    ```java
    public class Phone{
    	private Money amount;          // 단위 요금
    	private Duration seconds;      // 당위 시간
    	private List<Call> calls = new ArrayList<>();
    
    	public Phone(Money amount, Duration seconds){
    		this.amount= amount;
    		this.seconds = seconds;
    	}
    
    	public void call(Call call){
    		calls.add(call);
    	}
    
    	public List<Call> getCalls(){
    		return calls;
    	}
    
    	public Money getAmount(){
    		return amount;
    	}
    
    	public Duration getSeconds(){
    		return secounds;
    	}
    
    	public Money calculateFee(){
    		Money result = Moeny.ZERO;
    		
    		for(Call call : calls){
    			result = result.plus(amount.times(call.getDuration().getSeconds() / seconds.getSeconds());
    		}
    
    		return result;
    	}
    }
    ```
    
    > 만약에 여기서 **‘심야 시간 할인 요금제’라는 새로운 요금 방식을 추가해야된다면?**
    > 
    
    가장 쉬운 방법은 코드를 복사해서 NightlyDiscountPhone 이라는 새로운 클래스를 만든 후 수정하는 것이다. ㅋㅋㅋㅋ 복사 좋지~
    
    ```java
    
    public class NightlyDiscountPhone{
    	private static final int LATE_NIGHT_HOUR=22;
    	
    	private Money nightlyAmount;    // (새로 추가) 밤 10시 이후
    	private Money regularAmount;    // (새로 추가) 밤 10시 이전
    	private Duration seconds;
    	private List<Call> calls = new ArrayList<>();
    
    	public NightlyDiscountPhone(){
    		// 초기화
    	}
    
    	public Money calculateFee(){
    		Money result = Money.ZERO;
    
    		for(Call call : calls){
    			 // 요금계산 어쩌고
    		}
    
    		return result;
    	}
    }
    ```
    
    만약에 여기서 통화 요금에 부과할 세금을 계산하는 새로운 요구사항이 또 추가된다면? 
    
    ### 중복코드 수정하기
    
    1. Phone 수정
    
    ```java
    public class Phone{
    	...
    	private double taxRate   // 새로추가 
    
    	public Phone(Money amount, Duration seconds, double taxRate){
    		... 
    		this.taxRate =taxRate; // 새로추가 
    	}
    
    	.... 
    
    	public Money calculateFee(){
    		Money result = Moeny.ZERO;
    		
    		for(Call call : calls){
    			result = result.plus(amount.times(call.getDuration().getSeconds() / seconds.getSeconds());
    		}
    
    		return result.plus(result.times(taxRate));  // 수정 
    	}
    }
    ```
    
    1. NightlyDiscountPhone 수정
    
    ```java
    
    public class NightlyDiscountPhone{
    	... 
    	private double taxRate;	 // 새로추가 
    
    	public NightlyDiscountPhone(Money nightlyAmount, Money regularAmount, Duration seconds, double taxRate){
    		...
    		this.taxRate = taxRate; // 새로추가 
    	}
    
    	public Money calculateFee(){
    		Money result = Money.ZERO;
    
    		for(Call call : calls){
    			 // 요금계산 어쩌고
    		}
    
    		return result.minus(result.times(taxRate)); // 엇!! 버그발생 !!! 
    	}
    }
    ```
    
- 이렇게 중복코드는 항상 함께 수정돼야 하기 때문에 하나라도 빠트린다면 버그로 이어질 것이다.
- 또한, 중복코드를 서로 다르게 수정할 경우에는 더 큰 문제가 발생할 수 있다.
- 중복코드가 늘어날 수록 애플리케이션은 변경에 취약해지고 버그가 발생할 가능성이 높아진다.
- **타입 코드 사용하기**
    - 두 클래스 사이의 중복코드를 제거하는 한가지 방법은 클래스를 하나로 합치는 것이다.
    - 타입 코드를 추가하고, 타입 코드의 값에 따라 로직을 분기시켜 Phone 과 NightDiscountPhone 을 하나로 합칠수 있지만,,
    - 계속 강조했던 것처럼 타입 코드를 사용하는 클래스는 낮은 응집도와 높은 결합도라는 문제에 시달리게 된다.
- 객체 지향 프로그래밍에서는 **상속**을 통해 타입 코드를 사용하지 않고도 중복 코드를 관리할 수 있는 효과적인 방법을 제공한다.

## 상속을 이용해서 중복 코드 제거하기

- 이미 존재하는 클래스와 유사한 클래스가 필요하면 코드를 복사하지 않고, 상속을 이용해 코드를 재사용할 수 있다.
- **Phone 클래스 상속을 이용해 구현한 NightllyDiscountPhone 클래스 예제**
    
    ```java
    public class NightlyDiscountPhone extends Phone{
    	private static final inte LATE_NIGHT_HOUR=22;
    	
    	private Money nightlyAmount;
    
    	public NightlyDiscountPhone(Money nightlyAmount, Money regularAmount, Duration seconds){
    		super(regularAmount, seconds);
    		this.nightlyAmount= nightlyAmount;
    	}
    
    	@Override
    	public Money calculateFee(){
    		// 부모 클래스의 calcualteFee 호출
    		Money result= super.calculateFee();
    
    		Money nightlyFee = Money.ZERO;
    		
    		for(Call call: getCalls()){
    			// 10시 이후인 경우에만, NightlyDiscountPhone 에서 구현 
    			if(call.getFrom().getHour() >= LATE_NIGHT_HOUR){
    				nightlyFee = nightlyFee.plus(
    					getAmount().minus(nightlyAmount().times(
    						call.getDuration().getSeconds() / getSeconds().getSeconds()));
    					)
    				)
    			}
    		}
    
    		return result.minus(nightlyFee);
    		
    	}	
    }
    ```
    
- 근데 이해 잘 안됨.
- 이렇게 상속을 염두에 두고 설계되지 않은 클래스를 상속을 이용해 재사용하는 것은 생각처럼 쉽지 않다.

## **강하게 결합된** Phone 과 NightlyDiscountPhone

- NightDiscountPhone 은
    - 부모 클래스인 Phone 의 calculateFee 메서드를 오바라이딩한다.
    - super 참조를 통해 부모 클래스의 메소드를 호출한다.
- **만약에 여기서 또 새로운 요구사항이 추가되면**
    - **NightlyDiscountPhone 에도 새로운 요구사항에 대응하기 위해 새로운 중복 코드를 만들어야 된다.**
- **이처럼 상속 관계로 연결된 자식 클래스가 부모 클래스의 변경에 취약해지는 현상을 가리켜 취약한 기반 클래스 문제라고 부른다.**

# 2. 취약한 기반 클래스 문제


- 구현을 상속한 경우 파생 클래스는 기반 클래스에 강하게 결합되며, 둘 사이의 밀접한 연결은 바람직하지 않다.
- 겉으로 보기에는 안전한 방식으로 기반 클래스를 수정한 것처럼 보이더라도 이 새로운 행동이 파생 클래스에게 상속될 경우 파생 클래스의 잘못된 동작을 초래할 수 있기 때문에 기반 클래스는 “취약하다.”
- **상속 관계를 추가할수록 전체 시스템의 결합도가 높아진다.**
- 취약한 기반 클래스 문제는 캡슐화를 약화시키고 결합도를 높인다.
- 상속은 자식 클래스가 **부모 클래스의 구현 세부사항에 의존하도록 만들기 때문에 캡슐화를 약화시킨다.**
- 객체를 사용하는 이유는 구현과 관련된 세부사항을 퍼블릭 인터페이스 뒤로 캡슐화할 수 있기 때문인데, **안타깝게도 상속을 사용하면 부모 클래스의 퍼블릭 인터페이스가 아닌 구현을 변경하더라도 자식 클래스가 영향을 받기 쉬워진다.**

## A. 불필요한 인터페이스 상속 문제

- java.utils.Stack, Vector
    
    ```java
    Stack<String> stack = new Stack<>();
    	
    stack.push("1st");
    stack.push("2nd");
    
    stack.add(0, "4th");   // 잉??
    assertEquals("4th", stack.pop()); // 에러 
    ```
    
    - 이는 Stack 이 끝에서만 push, pop 할 수 있다는 규칙을 무너뜨릴 여지가 있는 위험한 Vector 의 퍼블릭 인터페이스까지도 함께 상속받았기 때문이다.
- java.util.Properties
    - key-value 쌍을 보관한다는 점에서는 Map 과 유사하지만,
    - key-value 값의 타입으로 오직 String만 가질 수 있다.
    - 하지만, 제네릭(generic)이 도입되기 이전에 만들어졌기 때문에 컴파일러가 key-value 의 타입이 String 인지 여부를 체크할 수 있는 방법이 없었다.
    - 그래서 다른 타입도 저장할 수 있음..
    
    ```java
    Properties properties = new Properties();
    
    properties.put("Dennis Ritchie", 67);
    
    assertEquals("C", properties.getProperty("Dennis Ritchie"); // 에러 (null 반환됨)
    ```
    


> 🚨 **경고2)** 상속받은 부모 클래스의 메서드가 **자식 클래스의 내부 구조에 대한 규칙을 깨트릴 수 있다.**


## B. 메서드 오버라이딩 오작용 문제

```java
public class InstrumentHashSet<E> extends HashSet<E>{
	private int addCount = 0;
		
	@Override
	public boolean add(E e){
		addCount ++ ;
		return super.add(e);
	}

	@Override
	public boolean addAll(Collection<? extends E> c){
		addCount += c.size();
		return super.addAll(c); 
	}
}

InstrumentedHashSet<String> languages = new InstrumentedHashSet<>();
languages.addAll(Arrays.asList("Java", "Ruby", "Scala"));

// 결과 6!! 
```

- 부모 클래스인 HashSet의 addAll 메서드 안에서 내부적으로 add 메서드를 호출하기 때문.
- 이를 해결하는 방법은 addAll 메서드를 제거하는 것이다.
- 이면 컬렉션을 파라미터로 전달하는 경우에는 자동으로 HashSet의 addAll 메서드가 호출되어 예상했던 결과가 나오게 될 것이다.
- 하지만, 이또한 나중에 HashSet의 addAll 메서드가 add 메시지를 전송하지 않도록 수정된다면, addAll 메서드를 이용해 추가되는 요소들에 대한 카운트가 누랄 될 것이다.
- 이는, InstrumentedHashSet의 addAll 메서드를 오버라이딩하고, 추가되는 각 요소에 대해 한 번씩 add 메시지를 호출하는 것이다.

```java
public class InstrumentHashSet<E> extends HashSet<E>{
	private int addCount = 0;
		
	@Override
	public boolean add(E e){
		addCount ++ ;
		return super.add(e);
	}

	@Override
	public boolean addAll(Collection<? extends E> c){
		boolean modified = false;
		for (E e : c)
			if (add(e))
				modified = true;
		return modified;	
	}
}
```

- 하지만 이 방법도, 미래에 발생할지 모르는 위험을 방지하기 위해 코드를 중복시킨 것이기 때문에 문제가 있을 수 있다.
- 상속은 코드 재사용을 위해 캡슐화를 희생한다.


> 🚨 **경고3)** 자식 클래스가 부모 클래스의 메서드를 **오버라이딩할 경우, 부모 클래스가 자신의 메서드를 사용하는 방법에 자식 클래스가 결합될 수 있다.**


## C. 부모 클래스와 자식 클래스의 동시 수정 문제

- 자식 클래스가 부모 클래스의 메서드를 오버라이딩하거나, 불필요한 인터페이스를 상속받지 않았음에도 부모 클래스를 수정할 때, 자식 클래스를 함께 수정해야할 수도 있다는 사실을 잘 보여준다.
- 상속을 사용하면 자식 클래스가 부모 클래스의 구현에 강하게 결합되기 때문에, 이 문제를 피하기 어렵다.
- 결합도란 다른 대상에 대해 알고 있는 지식의 양인데, 상속은 기본적으로 부모 클래스의 구현을 재사용한다는 기본 전제를 따르기 때문에 자식 클래스가 부모 클래스의 내부에 대해 속속들이알도록 강요한다.
- 코드 재사용을 위한 상속은 부모 클래스와 자식 클래스를 강하게 결합시키기 때문에, 합께 수정해야 하는 상황 역시 빈번하게 발생할 수 밖 에없다.


> 🚨 **경고4)** 클래스를 상속하면, 결합도로 인해 자식 클래스와 부모 클래스의 구현을 영원히 변경하지 않거나, 자식 클래스와 부모 클래스를 동시에 변경하거나 둘 중 하나를 선택할 수 밖에 없다.


# 3. Phone 다시 살펴보기

---

- 추상화에 의존함으로써, 취약한 기반 클래스 문제를 어느 정도까지 완화할 수 있다.

### 추상화에 의존하자

- 가장 일반적인 방법은 자식 클래스가 부모 클래스의 구현이 아닌, 추상화에 의존하도록 만드는 것이다.
- 정확하게 말하면 부모 클래스와 자식 클래스 모두 추상화에 의존하도록 수정해야 한다.

## 차이를 메서드로 추출해라

- 중복 코드안에서의 차이점을 별도의 메서드로 분리하는 것이다.
- 변하는 것으로부터 변하지 않는 것을 분리해라
- 변하는 부분을 찾고 이를 캡슐화해라

```java
public class Phone{
	...
	public Money calculateFee(){
		Money result = Money.ZERO;

		for (Call call : calls{
			result = result.plus(calculateCallFee(call));
		}
		return result;
	}

	private Money calculateCallFee(Call call){
		 .. 어쩌고 저쩌고 
	}

}
```

```java
public class NightlyDiscountPhone{
	...
	public Money calculateFee(){
		Money result = Money.ZERO;

		for (Call call : calls{
			result = result.plus(calculateCallFee(call));
		}

		return result;
	}

	private Money calculateCallFee(Call call){
		 .. 어쩌고 저쩌고 
	}

}
```

- 두 클래스의 calcualteFee 메서드는 완전히 동일해졌고, 추출한 calculateCallFee 메서드 안에 서로 다른 부분을 격리시켜 놓았다.

## 중복 코드를 부모 클래스로 올려라

- **추상 부모 클래스**를 추가하자.

```java
public abstract class AbstractPhone{

	private List<Call> calls = new ArrayList<>();
	
	// 중복 코드 위로 올리기 
	public Money calculateFee(){
		Money result = Money.ZERO;

		for (Call call : calls{
			result = result.plus(calculateCallFee(call));
		}

		return result;
	}

	// 시그니처만 부모 클래스로 이동시키자.
  // 추상 메서드로 선언하고 자식 클래스에서 오버라이딩할 수 있도록 protected로 선언.
	abstract protected Money calculateCallFee(Call call);
}

public class Phone extends AbstractPhone{...}

public class NightlyDiscountPhone extends Abstractphone{...}
```

## 추상화가 핵심이다.

- 공통 코드를 이동시킨 후에 각 클래스는 **서로 다른 변경의 이유를 가지게된다.**
- Abstract Phone
    - 전체 통화 목록을 계산하는 방법이 바뀔 경우에만
- Phone
    - 일반 요금제의 통화 한건을 계산하는 방식이 바뀔 경우에만
- NightlyDiscountPhone
    - 심야 할인 요금제의 통화 한건을 계산하는 방식이 바뀔 경우에만
- 세클래스는 각각 하나의 변경이유만을 가진다. = **단일 책임 원칙을 준수하기 때문에 응집도가 높다고 말할 수 있다.**
- 새로운 요금제가 필요한 경우에도, AbstractPhone 을 상속받는 새로운 클래스를 추가한 후 calculateCallFee 메서드만 오버라이딩하면 된다. 다른 클래스를 수정할 필요 없다. **= 설계가 확장에는 열려있고, 수정에는 닫혀 있기 때문에 개방-폐쇄 원칙 역시 준수한다.**

## 의도를 드러내는 이름 선택하기

```java
public abstract class Phone {...}

public class RegularPhone extends Phone {...}

public class NightlyDiscountPhone extends Phone {...}
```

## 하지만 taxRate 인스턴스 변수가 추가된다면..?

- Phone 에 인스턴스 변수인 taxRate가 추가되면 자식 클래스인 RegularPhone 과 NightlyDiscountPhone 의 생성자 역시 taxRate 를 초기화하기 위해 수정해야 한다.
- 이처럼 클래스 사이의 상속은 자식 클래스가 부모 클래스가 구현한 행동뿐만 아니라 인스턴스 변수에 대해서도 결합되게 만든다.
- 결과적으로 책임을 아무리 잘 분리하더라도, 인스턴스 변수의 추가는 종종 상속 계층 전반에 걸친 변경을 유발한다.
- **하지만 인스턴스 초기화 로직을 변경하는 것이 두 클래스에 동일한 세금 계산 코드를 중복시키는 것보다는 현명한 선택이다.**

# 4. 차이에 의한 프로그래밍

- 기존 코드와 다른 부분만을 추가함으로써, 애플리케이션의 기능을 확장하는 방법을 차이에 의한 프로그래밍이라고 부른다.
- 중복을 제거하기 위해서는
    - 코드를 재사용 가능한 단위로 분해하고 재구성해야한다.
- 코드를 재사용하기 위해서는
    - 중복 코드를 제거해서 하나의 모듈로 모아야한다.
    

근데.. 상속의 오용과 남용은 애플리케이션을 이해하고 확장하기 어렵게 만든다. 

상속의 단점을 피하면서 코드를 재사용할 수 있는 더 좋은 방법이 있는데,,

그건 바로 **합성이라고 한다.^^**
