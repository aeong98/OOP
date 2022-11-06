# 5. 책임 할당하기
# 낮은 결합도, 높은 응집도

---

### 객체간의 결합도를 느슨하게 유지할 수 있는 방법

- 메시지를 기반으로 협력을 구성하면 객체간의 결합도를 느슨하게 유지할 수 있음.
- 상대방 객체의 구현을 고려하지 않고, 전송할 메시지를 먼저 결정하면 캡슐화정도를 높일 수 있음.
- **이렇게, 결합도를 낮춘다는 것 = 다른 객체에 수정을 가하더라도, 메시지를 보내는 쪽에 영향을 최소화 시키는 것**

## Screening (영화예매)

### 책임

- 영화를 예매할 책임 **(예매하라 메시지에 응답)**
    - 1) 가격 계산 **(movie 와 협력)**
    - 2) 가격 반환
- **Reservation 인스턴스 생성**

```java
public class Screening{
	private Movie movie;
	private int sequece;
	private LocalDateTime whenScreend;

	public Reservation reserve(Customer customer, int audienceCount){
		return new Reservation(customer, this, calculateFee(audienceCount), audienceCount);
	}

	private Money calculateFee(int audienceCount){
		return movie.calculateMovieFee(this).times(audienceCount);
	}

	public LocalDateTime getWhenScreened(){
		return whenScreened;	
	}
	
	public int getSequence(){
		return sequence;
	}
}
```

## Movie(영화)

### 책임

- 영화요금을 계산할 책임 **(요금을 계산해라 메시지에 응답)**
    - 1) 할인 정책 판단 **(discountCounditions 객체와 협력)**
    - 2) 할인 정책에 따른 영화 요금 계산
    - 3) 영화 요금 반환

```java
public enum MovieType{
	AMOUNT_DISCOUNT,  // 금액 할인 정책 
	PERCENT_DISCOUNT, // 비율 할인 정책 
	NONE_DISCOUNT     // 미적용
}

public class Movie{
	private String title;
	private Duration runningTime;
	private Money fee;
	private List<DiscountCondition> discountConditions;

	private MovieType movieType;
	private Money discountAmount;
	private double discountPercent;

	public Money calculateMovieFee(Screening screening){
		if(isDiscountable(screening)){
			return fee.minus(calculateDiscountAmount())
		}
	}
	
	private boolean isDiscountable(Screening screening){
		return discountConditions.stream()
					.anyMatch(condition -> condition.isSatisfiedBy(screening));
	}

	private Money calculateDiscountAmount(){
		switch(movieType){
			case AMOUNT_DISCOUNT:
				return calculateAmountDiscountAmount();
			case PERCENT_DISCOUNT:
				return calculatePercentDiscountAmount();
			case NONE_DISCOUNT:
				return calculateNoneDiscountAmount();
		}

		throw new IllegalStateException();
	}

	private Money calculateAmountDiscountAmount(){
		return discountAmount;
	}
		
	private Money calculatePercentDiscountAMount(){
		return fee.times(discountPercent);
	}

	private Money calculateNoneDiscountAmount(){
		return Money.ZERO;
	}
}
```

## DiscountCondition (할인 정책)

### 책임

- 할인 여부를 판단 (할인 여부를 판단하라는 메시지에 응답)
    - 1) 할인 조건의 종류(type) 판단
    - 2) 기간(period) 에 따라 판단
    - 3) 순번(sequence)에 따라 판단
    - 3) 할인 여부 응답

```java
public enum DiscountConditionType {
	SEQUENCE, // 순번조건
	PERIOD
}

pubic class DiscountCondition{
	private DiscountConditionType type;
	private int sequence;
	private DayOfWeek dayOfWeek;
	private LocalTime startTime;
	private LocalTime endTime;

	public boolean isSatisfiedBy(Screening screening){
		if(type === DiscountConditionType.PERIOD){
			return isSatisfiedByPeriod(screening):
		}

		return isSatisfiendBySequence(screening);
	} 

	private boolean isSatisfiedByPeriod(Screening screening){
		return dayOfWeek.equals(screening.getWhenScreened().)
			... 머어쩌고 저쩌고 period 조건으로 판단하는 로직 
	}
	return boolean isSatisfiendBySequcne(Screening screening){
			... 머어쩌고 저쩌고 sequnce 조건으로 판단하는 로직 
	}
}
```

# DiscountCondition 개선하기

---

## 문제점

- **변경에 취약한 클래스란 코드를 수정해야 하는 이유를 하나 이상 가지는 클래스다.**
- DiscountCondition 은 다음과 같이 서로 다른 세가지 이유로 변경 될 수 있다.

  ### 새로운 할인 조건 추가

    - 새로운 할인 조건 추가되면 isSatisfiedBy 메서드 안의 if~else 구문을 수정해야 한다.
    - 할인 조건이 새로운 데이터를 요구하면 속성도 추가해야한다.

  ### 순번 조건을 판단하는 로직 변경

    - isSatisfiendBySequcne 메서드의 내부 구현을 수정해야한다.
    - 데이터가 변경되면 sequence 속성 역시 변경해야한다.

  ### 기간 조건을 판단하는 로직 변경

    - isSatisfiedByPeriod 메서드의 내부 구현을 수정해야한다.
    - 데이터가 변경되면 dayOfweek, startTime, endTime 속성 역시 변경해야한다.

- 이렇게 하나 이상의 변경 이유를 가지기 때문에 응집도가 낮다고 볼 수 있다.
- 응집도가 낮다는 것 = 하나이상의 변경 이유를 가진다는 것 = 서로 연관성이 없는 기능이나 데이터가 하나의 클래스안에 뭉쳐져 있다는 것을 의미
- **변경의 이유에 따라 클래스를 분리해야한다.**

## 1) 타입 분리하기

- **문제)** DiscountCondition 의 가장 큰 문제는 두 개의 독립적인 타입이 하나의 클래스 안에 공존하고 있다는 것.

```java
public class PeriodCondition{
	private DayOfWeek dayOfWeek;
	private LocalTime startTime;
	private LocalTime endTime;

	private boolean isSatisfiedByPeriod(Screening screening){
		return dayOfWeek.equals(screening.getWhenScreened().)
			... 머어쩌고 저쩌고 period 조건으로 판단하는 로직 
	}
}

public class SequenceCondition{
	private int sequence;

	private boolean isSatisfiedBySequence(Screening screening){
		return .. 어쩌고 저쩌고 sequnce 조건으로 판단하는 로직
	}
}
```

- **해결)** **두 타입을 SequenceCondition, PeriodCondition 이라는 두 개의 클래스로 분리하는것.**

## 2) 협력하는 클래스와의 결합도 낮추기

- **문제1)** 위와 같이 분리하게 될 경우,의 문제점은 Movie 클래스가 PeriodCondition, SequenceCondition 클래스 양쪽 모두에게 결합됐다는 것.
- **문제2)** 수정 후에 새로운 할인 조건을 추가하기 더 어려워졌다는 것.
- **해결 ) 다형성을 통해 분리하기**
    - 두 클래스가 할인 여부를 판단하기 위해 사용하는 방법이 다르다는 사실은 Movie 입장에서는 그다지 중요하지 않다. (할인 가능 여부만 반환해주면됨)
    - **이때 역할 의 개념이 무대 위로 등장한다.**
    - 자바에서는 일반적으로 역할을 구현하기 위해 추상 클래스나 인터페이스를 사용한다.
    - **역할을 대체할 클래스들 사이에서 `구현을 공유`해야할 필요가 있다면 `추상 클래스`를 사용하면 된다.**
    - **구현을 공유할 필요없이 역할을 대체하는 객체들의 `책임만 정의`하고 싶다면 `인터페이스`를 사용하면된다.**

```java
public interface DiscountCondition{
	boolean isSatisfiedBy(Screening screening);
}

public class PeriodCondition implements DiscountCondition{...}

public class SequenceCondition implements DiscountCondition{...}
```

# Movie 클래스 개선하기

---

- 문제) 금액할인 정책 영화 / 비율 할인 정책 영화라는 두가지 타입을 하나의 클래스 안에 구현하고 있어, 하나 이상의 이유로 변경될 수 있다. = 응집도가 낮다.
- **해결) 역할의 개념을 도입해서 협력을 다형적으로 만들면된다.**
- DiscountCondition 의 경우에는 역할을 수행할 클래스들 사이에 구현을 공유할 필요가 없었기 때문에 `인터페이스`를 이용해 구현했다.
- **Movie 의 경우에는 구현을 공유할 필요가 있다. 따라서 `추상클래스` 를 이용해 역할을 구현했다.**

```java
public abstract class Movie{
		.. 어쩌고 저쩌고 구현
}

public class AmountDiscountMovie extends Movie{
	
	@Override
	protected Money calculateDiscountAmount(){
		return discountAmount;
	}
}

public class PercentDiscountMovie extends Movie{

	@Overrids
	protected Money calculateDiscountAmount(){
		return getFee().times(percent);
	}
}

public class NoneDiscountMovie extends Movie{

	@Overrids
	protected Money calculateDiscountAmount(){
		return Money.ZERO;
	}
}
```

# 합성을 통해 유연성 높이기

---

- 위의 설계에서 할인 정책을 구현하기 위해 `상속` 을 이용하고 있기 떄문에, 실행 중에 영화의 할인정책을 변경하기 위해서는 **새로운 인스턴스를 생성한 후 필요한 정보를 복사해야한다.**
- 새로운 할인 정책이 추가될 때마다 인스턴스를 생성하고, 상태를 복사하고, 식별자를 관리하는 코드를 추가하는 일은 번거롭다.
- **해결 방법 ) 상속대신 합성을 사용하는 것.**
    - Movie 의 상속 계층 안에 구현된 할인 정책을 독립적인 DiscountPolicy 로 분리한 후 Movie 에 합성시키면 유연한 설계가 완성된다.

    ```java
    Movie movie = new Movie("타이타닉",
    												Duration.ofMinutes(120),
    												Money.wons(1000),
    												new AmountDiscountPolicy(...)); // 합성 
    
    movie.changeDiscountPolicy(new PercentDiscountPolicy(...)); // 합성
    ```

- 위의 예제에서처럼, 새로운 할인 정책이 추가되더라도 할인 정책을 변경하는데 필요한 추가적인 코드를 작성할 필요가 없다.
- 새로운 클래스를 추가하고 클래스의 인스턴스를 Movie 의 changeDiscountPolicy 메서드에 전달하면 되기 떄문…!