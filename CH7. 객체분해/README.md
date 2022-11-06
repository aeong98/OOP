# 7장. 객체분해
- 불필요한 정보를 제거하고 현재 문제 해결에 필요한 핵심만 남기는 작업을 **추상화**라고 부른다.
- 가장 일반적인 추상화 방법은 **한 번에 다뤄야 하는 문제의 크기를 줄이는 것이다.**
- 큰 문제를 해결 가능한 작은 문제로 나누는 작업을 **분해(decomposition)** 이라고 부른다.

# 1. 프로시저 추상화와 데이터 추상화

---

## 프로시저 추상화(proceducre abstraction)

- 소프트웨어가 **`무엇을 해야`** 하는지를 추상화한다.
- **기능 분해 (functional decomposition)**

## 데이터 추상화(data abstraction)

- 소프트웨어가 **`무엇을 알아야`** 하는지를 추상화한다.
- 데이터를 중심으로 **타입을 추상화 (type abstraction)**
    - 추상 데이터 타입 (Abstract Data Type)
- 데이터 중심으로 **프로시저를 추상화 (proceducre abstraction)**
    - **객체지향 (Object-Oriented)**

# 2.프로시저 추상화와 기능 분해

---

- 프로시저는 반복적으로 실행되거나, 거의 유사하게 실행되는 작업들을 하나의 장소에 모아놓음으로써 로직을 재사용하고 중복을 방지할 수 있는 추상화 방법이다.

### 급여관리 시스템

- 직원의 급여를 계산한다.
    - 사용자로부터 소득세율을 입력받는다.
        - “세율을 입력하세요” 라는 문장을 화면에 출력한다.
        - 키보드를 통해 세율을 입력받는다.
    - 직원의 급여를 계산한다.
        - 전역 변수에 저장된 직원의 기본급 정보를 얻는다.
        - 급여를 계산한다.
    - 양식에 맞게 결과를 출력한다.
        - “이름 : {직원명}, 급여 : {계산된 금액}” 형식에 따라 출력 문자열을 생성한다.
- 입력정보
    - 직원정보, 소득세율
- 출력
    - 계산된 급여 정보
- 기능 분해 방법에서는 기**능을 중심으로 필요한 데이터를 결정한다.**
- 기능 분해를 위한 하향식 접근법은 먼저 **`1)필요한 기능을 생각`**하고, 이 기능을 분해하고 정제하는 과정에서 **`2)필요한 데이터의 종류와 저장 방식을 식별`**한다.

### 급여 관리 시스템 구현

1. 직원의 급여를 계산한다.

```ruby
def main(name)
end
```

1. 절차 정의

```java
def main(name)
	taxRate = getTaxRate();
	pay = calculatePayFor(name, taxRate)
	puts(discribeResult(name, pay))
end
```

1. 각 절차 세부 내용 분해
- 사용자로부터 소득세율을 입력받는다.
    - “세율을 입력하세요” 라는 문장을 화면에 출력한다.
    - 키보드를 통해 세율을 입력받는다.

```ruby
def getTaxRate()
	print("세율을 입력하세요:")
	return gets().chomt().to_f();
end
```

- 직원의 급여를 계산한다.
    - 전역 변수에 저장된 직원의 기본급 정보를 얻는다.
    - 급여를 계산한다.

```ruby
$employees = ["직원A", "직원B", "직원C"];
$basePays =[400, 300, 250]

def calculatePayFor(name, taxRate)
	index = $employees.index(name)
	basePay = $basePays[index]
	return basPay - (basePay * taxRate)
end 
```

- 양식에 맞게 결과를 출력한다.
    - “이름 : {직원명}, 급여 : {계산된 금액}” 형식에 따라 출력 문자열을 생성한다.

```ruby
def describeResult(name, pay)
	return "이름: #{name}, 급여: #{pay}"
end
```

- 이처럼 하향식 기능분해는 시스템을 최상위의 가장 추상적인 메인 함수로 정의하고 메인함수를 구현 가능한 수준까지 세부적인 단계로 분해하는 방법이다.
- 시스템 **= `메인함수를 루트로 하는 트리(tree)`**
- 하나의 프로시저 **= `노드(node)`**

## 하향식 기능 분해의 문제점

### 1) 시스템은 하나의 메인 함수로 구성돼 있지 않다.

- 처음에는 메인함수로 여겨졌던 함수가, 기능이 추가되고 규모가 커짐에 따라 동등하게 중요한 여러 함수 중 하나로 전락하고 만다.
- 대부분의 시스템에서 하나의 메인 기능이란 개념은 존재하지 않는다.

### 2) 메인 함수의 빈번한 재설계

- 새로운 기능을 추가할 떄마다 매번 메인 함수를 수정해야한다.
- 만약에 위의 경우에서, 모든 직원들의 기본급의 총합을 구하는 기능이 추가된다면?
    - main함수의 구현을 수정할 수 밖에 없다.

```ruby
def main(operation, args={})
	case(operation)
		when: pay then calculatePay(args[:name])
		when: basePays then sumOfBasePays()
		end 
end

# 기본급 총합구하기
main(:basePays)

# 직원 급여 계산
main(:pay, name:"직원A")

```

### 3) 비즈니스 로직과 사용자 인터페이스의 결합

- **코드안에 비즈니스 로직 + 사용자 인터페이스의 로직이 밀접하게 결합되어 있다.**
- 사용자 인터페이스 → 시스템 내에서 가장 자주 변경되는 부분
- 비즈니스 로직 → 사용자 인터페이스에 비해 변경이 적게 발생
- 하향식 접근법은 사용자 인터페이스 로직과 비즈니스 로직을 한데 섞기 때문에 사용자 인터페이스를 변경하는 경우 비즈니스 로직까지 변경에 영향을 받게 된다.
- 사용자 인터페이스의 관심사와 비즈니스 로직의 관심사를 동시에 고려하도록 강요하기 때문에 “관심사의 분리”라는 아키텍처 설계의 목적을 달성하기 어렵다.

### 4) 성급하게 결정된 실행 순서

- 하나의 함수를 더 작은 함수로 분해하고, 분해된 함수들의 실행순서를 결정하는 방법 → 무엇(what) 을 해야하는지가 아니라 어떻게 (how) 동작해야하는지에 집중하도록 만든다.
- 하향식 접근법은 처음부터 구현을 염두에 두기 때문에 함수들의 실행 순서를 정의하는 시간 제약(temporal constraint) 를 강조한다.
- 중앙집중 제어 스타일(centralized control style)
- **함수는 상위 함수가 강요하는 문맥에 강하게 결합된다. → 결합도 문제**

### 5) 데이터 변경으로 인한 파급효과

- 어떤 데이터를 어떤 함수가 사용하고 있는지를 추적하기 어렵다.
- 데이터 변경으로 인해 어떤 함수가 영향을 받을지 예상하기 어렵다.
- 데이터 변경으로 인한 영향을 최소화하려면 데이터와 함께 변경되는 부분과 그렇지 않은 부분을 명확하게 분리해야 한다.
- 데이터와 함께 변경되는 부분을 하나의 구현단위로 묶고, 외부에서는 제공되는 함수만 이용해 데이터에 접근해야한다.
- 즉, 잘 정의된 퍼블릭 인터페이스를 통해 데이터에 대한 접근을 통제해얄하는 것이다.

# 3. 모듈

---

## 모듈

- 다음과 같은 두가지를 감춰야한다.
    - 복잡성
        - 모듈이 너무 복잡한 경우 이해하고 사용하기 어렵다.
        - 모듈을 추상화할 수 있는 간단한 인터페이스를 제공해서 복잡도를 낮춘다.
    - 변경 가능성
        - 변경 가능한 설계 결정이 외부에 노출될 경우 실제로 변경이 발생했을 때 파급효과가 커진다.
        - 변경 발생 시 하나의 모듈하면 수정하면 되도록 변경 가능한 설계 결정을 모듈 내부로 감추고 외부에는 쉽게 변경되지 않을 인터페이스만 제공한다.

```ruby
module Employees
	어쩌고 저쩌고
end

def main(operation, args={})
	case (opration)
	when :pay then calculatePay(args[:name])
	when :basePays then sumOfBasePays()
	end
end

def calculatePay(name)
	taxRate = getTaxRate()
	pay = Employees.calculatePay(name, taxRate)
	puts(describeResult(name,pay))
end

def getTaxRate()
	print("세율을 입력하세요:")
	return gets().chomp().to_f()
end 

def describeResult(name,pay)
	return "이름: #{name}, 급여 : #{pay}"
end 

def sumOfBasePays()
	puts(Employees.sumOfBasePays())
end 
```

- 장점
    - 모듈 내부의 변수가 변경되더라도 모듈 내부에만 영향을 미친다.
    - 비즈니스 로직과 사용자 인터페이스에 대한 관심사를 분리한다.
    - 전역 변수와 전역 함수를 제거함으로써, 네임스페이스 오염을 방지한다.
- 모듈에 있어서의 핵심은 데이터이다.
- 한계
    - 가장 큰 단점은 **인스턴스의 개념을 제공하지 않는다는 점이다.**
    - 좀 더 높은 수준의 추상화를 위해서는 직원 전체가 아니라, 개별 직원을 독립적인 단위로 다룰 수 있어야 한다.

# 4. 데이터 추상화와 추상 데이터 타입

## 추상데이터 타입

- 타입(type) 이란 변수에 저장할 수 있는 내용물의 종류와, 변수에 적용될 수 있는 연산의 가짓수를 의미한다.
    - 타입은 저장된 값에 대해 수행될 수 있는 연산의 집합을 결정하기 떄문에 변수의 값이 어떻게 행동할 것이라는 것을 예측할 수 있게 된다.
- 추상 데이터 타입 전제
    - 타입 정의 선언
    - 타입의 인스턴스를 다루기 위해 사용할 수 있는 오퍼레이션의 집합을 정의
    - 제공된 오퍼레이션을 통해서만 조작할 수 있도록 데이터를 외부로부터 보호
    - 타입에 대해 여러 개의 인스턴스를 생성할 수 있어야 함.

```ruby
Employee = Struct.new(:name, :basePay, :hourly, :timeCard)do
	def calculatePay(taxRate)
		if(hourly) then
			return calculateHourlyPay(taxRate)
		end
			return calculateSalariedPay(taxRate)

private
	def calculateHourlyPay(taxRate) 
	..어쩌구저쩌구
	end

private
	def calculateSalariedPay(taxRate) 
	..어쩌구저쩌구
	end
	
```

```ruby
$employees=[
	Employee.new("직원A", 400, false, 0),
	Employee.new("직원B", 300, false. 0),
	...
]
```

> **클래스는 추상 데이터 타입인가..?**
>

# 5. 클래스

### 클래스는 추상 데이터 타입인가?

- 공통점
    - 모두 외부에서는 객체 내부 속성에 직접 접근할 수 없으며, 오직 퍼블릭 인터페이스를 통해서만 외부와 의사소통할 수 있다.
- 차이
    - 클래스는 상속과 다형성을 지원하는데 비해, 추상 데이터 타입은 지원하지 못한다는 점이다.
- **위의 경우에서, Employee 는 정규 직원과 아르바이트 직원이라는 두 개의 타입이 공존한다.**
- 설계의 관점에서 Employee 타입은 직원 타입을 외부에 캡슐화하고 있는 것이다.
- 추상 데이터는 **`오퍼레이션을 기준`으로 `타입을 묶는 방법`이라면,**
- 객체 지향은 **`타입을 기`준으로 오`퍼레이션을 묶는다.`**

### 추상 데이터 타입에서 클래스로 변경하기

```ruby
class Employee
	attr_reader :name, :basePay

	def initialize(name, basePay)
		@name= name
		@basePay=basePay
	end 

	def calculatePay(taxRate)
		raise NotImplementedError
	end

	def montlyBasePay()
		raise NotImplementedError
	end 
end 

class SalariedEmployee < Employee
	def initialize(name, basePay)
		super(name, basePay)
	end

	def calculatePay(taxRate)
		return basePay - (basePay + taxRate)
	end 

	def montlyBasePay()
		return basePay
	end
end 

class HourlyEmployee < Employee
	attr_reader : timeCard 
	def initialize(name, basePay, timeCard)
		super(name, basePay)
		@timeCard = timeCard

	def calculatePay(taxRate)
		return 어쩌구 저쩌구
	
	def montlyBasePay()
		return 0
	end

end 
```

### 변경을 기준으로 선택해라

- 타입을 기준으로 절차를 추상화하지 않았다면, 그것은 객체지향 분해가 아니다.
- **클래스가 추상 데이터의 타입의 개념을 따르는지를 확인할 수 있는 가장 간단한 방법은 클래스 내부에 인스턴스 타입을 표현하는 변수가 있는지를 살펴보는것이다.**
- 이처럼 인스턴스 변수에 저장된 값을 기반으로 메서드 내에서 타입을 명시적으로 구분하는 방식을 객체지향을 위반하는 것으로 간주된다.
- **객체지향에서는 타입변수를 이용한 조건문을 다형성으로 대체한다.**
- 개방 - 폐쇄 원칙 (Open-Closed Principle, OCP)
    - 기존 코드에 아무런 영향도 미치지 않고 새로운 객체 유형과 행위를 추가할 수 있는 객체지향의 특성