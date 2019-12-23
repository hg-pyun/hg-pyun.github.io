---
title: Higher-Order Function 이란 무엇인가
date: 2018-10-28T00:00:00.000Z
description: Higher-Order Function. 한국어로 고차함수라 부르는 이 개념은 함수형 프로그래밍을 을 할 때 많이 사용 한다. Higher-Order Function(이하 HOF)를 사용하면 보다 유연하고 반복을 줄일 수 있는 코드를 작성할 수 있다. 이번 기회에 간단한 개념 정리와 어떻게 써먹을 수 있을 지 정리해 보도록 하자.
---
Higher-Order Function. 한국어로 고차함수라 부르는 이 개념은 함수형 프로그래밍을 을 할 때 많이 사용 한다. Higher-Order Function(이하 HOF)를 사용하면 보다 유연하고 반복을 줄일 수 있는 코드를 작성할 수 있다. 이번 기회에 간단한 개념 정리와 어떻게 써먹을 수 있을 지 정리해 보도록 하자.
## HOF??  
컴퓨터 과학(Computer Science)에서 적어도 아래 중 하나 이상을 만족하면 HOF라 할 수 있다.

- 하나 이상의 함수를 인자로 받는다.
- 함수를 결과로 반환한다.

쉽게 말하면, 함수를 다루는 함수라고 말할 수 있겠다. 말로 설명하는 것보다 간단한 예제 코드를 보도록 하자. 

```js
const twice = function(f, v) {
  return f(f(v));
};

const plusOne = function(v) {
  return v + 1;
};

console.log(twice(plusOne, 1)); // 3
```

twice() 는 함수를 인자로 받아 2번 반복해주는 HOF이다. 이 함수는 단순히 2번 반복하는 것 뿐이지만, 인자로 받는 함수에 어떻게 반복할 것인가를 제어할 수 있다.
```js
const twice = function(f, v) {
  return f(f(v));
};

const square = function(v) {
  return v * v;
};

console.log(twice(square, 2)); // 16
```
같은 twice()함수지만 이번엔 제곱을 하는 함수를 인자로 전달했다. 인자로 넘기는 함수에 따라 사용자의 입맛대로 비지니스 로직을 제어할 수 있다.

## Abstracting Patterns of Control

HOF는 단순히 함수의 값을 전달하는 기존 관념을 넘어, 함수의 흐름을 제어하는 파라미터로써 수용한다. 이를 제어 패턴 추상화(Abstracting Patterns of Control)라고 부른다. HOF는 계산의 세부사항을 인자로 넘기는 함수 안에 캡슐화 하여 추상적으로 제공할 수 있도록 한다.

이 또한 말로 설명을 들으면 잘 이해가 되지 않는다. 마찬가지로 예제를 통해 이해해 보도록 하자. 여기서는 예제로 많이 사용하는 함수인 repeat를 구현해 보면서 설명하도록 하겠다.

repeat는 문자 그대로 반복이다. 일반적인 프로그래밍에서 반복을 위해 보통 반복문을 사용한다. 0부터 99까지 출력하라 라고 요구사항이 주어진다면 보통 아래와 같이 코드를 짤 것이다.
```js
// 0부터 99까지 출력
for (let i = 0; i < 100; i++) {
  console.log(i);
}
```

하지만 보통 요구사항은 자주 변경되기 마련이다… ㅠㅅㅠ 0부터 9999까지 출력하라 로 요구사항이 변경 되었다. 위 코드에서 단순히 i<10 을 i<10000 으로 수정해도 되지만 대부분의 경우 함수로 만들어 사용하는 것이 가독성에 좋고, 수정에 용이하며, 실수를 줄일 수 있다.
```js
function repeat(n) {
  for (let i = 0; i < n; i++) {
    console.log(i);
  }
}

repeat(10000);
```
이제 우리는 n값으로 몇번을 출력할지 쉽고 빠르게 제어할 수 있다. 그런데 이번엔 요구사항이 다음과 같이 바뀌었다. 0부터 9999까지 배열에 담아라

우리가 만든 repeat() 함수는 출력을 수행하는 일밖에 할 수 없다. 그 이유는 출력을 하는 비지니스 로직이 repeat() 함수와 강력하게 결합을 하고 있기 때문이다. 그렇다면 repeat 함수의 console.log(i) 부분을 list.push(i)와 같이 수정하면 배열에 담으라는 요구사항을 만족 할 수 있다.

하지만 단순하게 for문안의 로직을 변경한다고 해서 모든 요구사항에 유연하게 대처할 수 있는 것은 아니다. 출력과 배열을 동시에 하라면? 짝수만 골라 담으라고 한다면? 물론 몇줄밖에 되지않으니 for문안의 로직을 수정하는게 편하지 않겠냐는 생각도 들것이다. 하지만 예제와 달리, 일반적인 대부분의 함수는 복잡한 로직을 가지고 있을 것이며, 복잡한 코드를 수정 했을 때 다른 부분에 영향을 미치진 않을지 부작용(Side-Effect)에 대한 공포를 가지고 수정을 해야할 것이다.

그렇다면 어떻게 하면 좀더 유연한 구조를 만들 수 있을 것인가? 앞에서 설명한 HOF가 그 대안이 될 수 있다. 핵심 요구사항이고, 변경이 있을만한 부분인 for문안의 로직을 추상화하여 함수로 제공한다.

```js
function repeat(n, fn) {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}

// 0부터 9999까지 출력하기
repeat(10000, console.log);

// 0부터 9999까지 배열에 담기
const list = [];
repeat(10000, (i) => {list.push(i)});
```
수행해야할 비지니스 로직을 fn(i) 으로 추상화 하였다. 또 fn 을 인자로 받아 수행함으로써 해당 로직을 캡슐화하여 제공한다. 이 과정을 통해 repeat() 함수의 비지니스 로직은 추상화되어 결합도가 낮아진다. 처음보다 다양한 요구사항에 대응할 수 있을 뿐만 아니라, 로직을 캡슐화 함으로써 재사용성을 높히고, 부작용에서도 어느정도 해방된 것을 볼 수 있다. 물론 반복되는 횟수(Pattern of Control)도 추상화(Abstract)하여 더 유연한 구조를 만들 수 있다.
```js
function repeat(n, fn, interval) {
  for (let i = 0; i < n; i = interval(i)) {
    fn(i);
  }
}

repeat(100, console.log, i => i === 0 ? ++i : i+i); // 0 1 2 4 8 16 32
```
# 함수를 반환하는 함수
여기서 끝이 아니다. 지금까지는 HOF의 조건 중 하나 이상의 함수를 인자로 받는다를 살펴봤는데, 조건은 한가지가 더 있다.

> 함수를 결과로 반환한다.

이번에는 함수를 반환하는 함수에 대해 알아보도록 하자. 아래의 fillArray(n, fn) 함수는 반복 횟수와 배열에 넣을 인자를 리턴 하는 함수를 넘겨받아 완성된 Array를 반환한다.
```js
function fillArray(n, fn) {
  let array = [];
  for (let i = 0; i < n; i++) {
    array.push(fn(i));
  }
  return array;
}

const array = fillArray(7, (i) => `item${i}`);

console.log(array); // [ 'item0', 'item1', 'item2', 'item3', 'item4', 'item5', 'item6' ]
```

함수를 반환하는 함수가 보이는가? 잘 안보인다면 다음과 같이 바꿔보도록 하자.
```js
function fillArray(n, fn) {
  let array = [];
  for (let i = 0; i < n; i++) {
    array.push(fn(i));
  }
  return array;
}

function makeItem(i) {
  return (i) => `item${i}`;
}

const array = fillArray(7, makeItem);

console.log(array); // [ 'item0', 'item1', 'item2', 'item3', 'item4', 'item5', 'item6' ]
```
makeItem() 함수가 바로 함수를 반환하는 함수이다. 이 HOF 또한 i를 인자로 넘겨받아 item0, item1 ... item6 뿐만 아니라 item0, item2, ...item12 와 같이 다양한 형태로 응용할 수가 있다. 또 함수를 리턴 함으로써 item${i} 은 클로저(Closure)로 메모리에 계속 남아있게 되므로 다른곳에서 사용할 수 있다.

# Use Case

그렇다면 HOF가 사용되는 예는 무엇이 있을까? 다들 많이 사용하는 Filter, Map, Reduce 이 함수들이 바로 HOF이다.
```js
const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

const result = words.filter(word => word.length > 6);

console.log(result);
// expected output: Array ["exuberant", "destruction", "present"]
```
Fitler 함수를 잘 들여다 보면 필터링 하는 조건을 함수를 통해 제어하는 것을 볼 수 있다. Map과 Reduce 함수도 마찬가지다. 함수를 인자로 받아 제어 패턴을 추상화 했다. 함수형 라이브러리인 lodash 많은 함수도 HOF로 만들어져 있다.  
다른 라이브러리에서 찾아보면 특히 React에서 이 HOF의 개념을 적극적으로 활용하고 있다. 나아가 개념을 함수 뿐만이 아니라 컴포넌트의 영역까지 확장시킨것이 바로 **HOC(Higher-Order Component)**이다.
```js
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```
HOF의 강력한 매력은 함수를 이용해서 새로운 함수를 합성할 수 있다는 것이다. 이 개념을 적극 활용한 라이브러리가 Ramda이다. Ramda의 함수들은 HOF로 만들어져 있으므로 이를 활용하면 쉽게 적절한 합성함수들을 만들어 낼 수 있다.
여담으로 Ramda는 Curry까지 사용하여 함수의 재사용에 있어서 더욱 강력한방법들을 제공한다.
```js
/* 배열에서 특정 인덱스의 값들을 뽑아 새로운 배열을 만드는 함수 */

// pure script
const pickIndexes = function (indexArray, array) {
  let result = [];

  for(let i=0; i<indexArray.length; i++){
    result.push(array[indexArray[i]]);
  }

  return result;
};

pickIndexes([0, 2], ['a', 'b', 'c']); // => ['a', 'c']

// Ramda
let pickIndexes = R.compose(R.values, R.pickAll);
pickIndexes([0, 2], ['a', 'b', 'c']); // => ['a', 'c']
```

## 마치며
HOF는 람다대수와 일급 객체(First-Class Citizens)라는 개념에 그 근간을 두고 있다. 또 Pure Function, Immutability같은 Functional Programming에 대한 개념의 이해가 선행되어야 자유자재로 사용하는데 무리가 없을 것이다. 이 포스트에서는 다루지 않았지만 흥미가 있는 사람은 꼭 FP의 매력을 공부해보길 바란다. 필자도 HOF를 코드에 잘 녹여낼 수 있는 그날을 상상하며 이곳에 정리해 본다.