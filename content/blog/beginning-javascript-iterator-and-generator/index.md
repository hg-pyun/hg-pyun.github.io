---
title: Beginning Javascript Iterator and Generator
date: 2019-01-12T00:00:00.000Z
description: 이전에 Javascaript의 Iterator에 대해서 몇가지 다뤄보았었는데, 도입된지 얼마 안된 스펙이다보니 자유 자재로 다루기가 아직 버겁다는 생각이 많이 들었다. 또한 최근 이터레이터와 제네레이터를 이용해 멋지게 구현한 코드들을 접하고 나서, 연습을 많이 해야겠다는 생각이들어 여기에 정리해 보고자 한다.
---
이전에 Javascaript의 **Iterator**에 대해서 몇가지 다뤄보았었는데, 도입된지 얼마 안된 스펙이다보니 자유 자재로 다루기가 아직 버겁다는 생각이 많이 들었다. 또한 최근 이터레이터와 제네레이터를 이용해 멋지게 구현한 코드들을 접하고 나서, 연습을 많이 해야겠다는 생각이들어 여기에 정리해 보고자 한다. 아래 함께보면 좋은 글들을 같이 링크하므로 관심있는 사람은 먼저 읽어보는 것도 좋겠다.

- [ES6의 심볼, 이터레이터, 제네레이터](http://hacks.mozilla.or.kr/2015/09/es6-in-depth-symbols/)
- [ES6의 제너레이터를 사용한 비동기 프로그래밍](https://meetup.toast.com/posts/73)
- [Async-await는 어떻게 구현하는가?](https://hg-pyun.github.io/how-to-implement-async-await/)

## Iterator를 사용하면 좋은 점?

아무리 좋은 기능이라도 적절하게 사용하지 않으면 독이 될 수 있다. 이번 기회에 Iterator를 사용했을 때 얻을 수 있는 이점과 언제 사용해야 하는지 고민해 보도록 하자. 이터레이터는 말그대로 반복하는 객체를 생성하는것이다. 그렇다면 for문, forEach로도 구현할 수 있지 않을까? Iterator의 필요성에 대해 가장 첫번째로 드는 의문이다. 결론부터 말하자면 이터레이터를 사용하면 일반적인 반복문들과 다르게 **느긋한 연산(Lazy Evaluation)**을 구현할 수 있다. 

그렇다면 느긋한 연산이란 무엇을까? 말 그대로 **계산의 결과값이 필요할 때까지 계산을 늦추는 기법**이다. 말로 설명하면 이해가 잘 안될수 있는 개념이니, 아래 코드를 보도록 하자.

```js
let arr = [];

for (let i = 0; i < 100; i++) {
  arr.push(i);
}
```
0부터 99까지 담긴 배열을 만든다고 하자. 일반적으로 우리는 위와 같은 방법으로 만드는 것에 익숙할 것이다. 그렇다면 아래 코드를 보도록 하자.

```js
let arr = {
  [Symbol.iterator]() {
    return this;
  },
  i: 0,
  next() {
    if (this.i < 100) return { value: this.i++, done: false };
    else return { done: true };
  }
};
```
위 코드는 0부터 99까지 반환하는 이터레이터를 구현한 것이다. 아직 실행을 하지 않았기에 배열은 생성되지 않았다. 때문에 딱히 메모리를 차지하지도 않는다. 이처럼 미리 추상화 시켜놓은 다음에 필요한 순간에 다음과 같이 실행하면 될 뿐이다. Iterator Protocol이 구현된 객체라면, for-of나 spread 연산자를 이용하여 아래와 같이 활용할 수 있다.
```js
[...arr];
```
이러한 구현 방법을 지연 계산법이라 부르는데, 하스켈 같은 함수형 프로그래밍 언어에서 주로 사용한다. 느긋한 연산을 사용하면 필요없는 계산을 하지 않으므로 실행을 더 빠르게 할 수도 있고, 무한을 표현할 수도 있을 뿐더러, 함수로 제어구조를 정의 할 수도 있다. 아래 코드는 무한이 0을 반환하는 이터레이터를 구현한 것이다. 이처럼 이터레이터를 이용하면 무한이라는 개념을 쉽게 표현할 수 있다.
```js

let infinityZero = {
  [Symbol.iterator]() {
    return this;
  },
  next() {
  return { value: 0, done: false };
  }
}

console.log(infinityZero.next().value); // 0
console.log(infinityZero.next().value); // 0
console.log(infinityZero.next().value); // 0
```

아래 코드는 최근에 만든 [iterize](https://github.com/hg-pyun/iterize)라는 이터레이터 라이브러리에서 가져왔다. range 이터레이터는 **첫번째, 두번째 인자로 범위** 값을, **세번째 인자로 스텝**을 입력 받아 범위에 속한 스퀀스를 순회한다(python의 range를 생각하면 쉽다). 주목할 부분은 세번째 인자인데, 함수를 통해 어떻게 스텝을 정의 하고 있다. 이 부분이 위에서 언급한 **함수로 제어구조를 정의** 한다는 개념이다.
```js
import {range} from 'iterize';
[...range(5)]; // [0, 1, 2, 3, 4]
[...range(0, 5)]; // [0, 1, 2, 3, 4]
[...range(5, 0)]; // [5, 4, 3, 2, 1]
[...range(1, 10, 1)]; // [1, 2, 3 ... 9]
[...range(1, 10, x => x + 1)]; // [1, 2, 3 ... 9], 1씩 증가
[...range(2, 64, x => x * x)]; // [2, 4, 16], 제곱으로 증가
```
자 이제 이터레이터의 특징과 장점에 대해 알았으니 어떻게 선언하는지 알아보도록 하자.

## Declaration Pattern

이터레이터는 **Iterable Protocol**과 **Iterator Protocol**을 구현하는 것이 핵심이다. Iterable Protocol은 쉽게 말해 \[Symbol.iterator\] 속성을 구현하는 것을 의미하고, Iterator Protocol은 value들의 시퀀스를 만드는 표준 방법을 정의하는것(next 함수)을 의미한다. 실용적으로 사용할 수 있는 정의 패턴은 크게 두가지이다. 먼저 위에서 한번 사용한 객체를 이용한 방법이다.
```js
let arr = {
  [Symbol.iterator]() { // for-of나 spread는 컬렉션에 있는 이 메소드 호출로 시작된다.
    return this;
  },
  i: 0,
  next() {
    if (this.i < 100) return { value: this.i++, done: false };
    else return { done: true }; // done이 ture일 경우 value는 생략할 수 있다.
  }
};

console.log(arr.next()); // {value: 0, done: false}
console.log(arr.next()); // {value: 1, done: false}
console.log(arr.next()); // {value: 2, done: false}
```
ES6에는 클래스라는 멋진 스펙도 존재한다. 이터레이터 객체를 클래스로 구현해 보자.
```js
class Arr {
  constructor() {
    this.i = 0;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.i < 100) return { value: this.i++, done: false };
    else return { done: true };
  }
}

let arr = new Arr();
console.log([...arr]);
```

클래스로 만들면 재활용하는데 있어서 이점이 있다. 그런데 다 좋은데 작성해야 할 코드가 너무 많은것 같은 느낌적인 느낌이다. 좀 더 쉽게 선언 할 수 없을까? 여기서 제네레이터가 등장한다.
```js
function* arr() {
  let i = 0;
  while (i < 100) {
    yield i++;
  }
}
console.log([...arr()]);
```
위 코드는 arr의 제네레이터 구현체이다. 코드가 한결 깔끔해지고, 로직도 간결해졌다.

## One more thing

한가지 주목할 점은 메모리를 효율적으로 사용할 수 있다는 것이다. 추상적으로 정의하다보니 계산되기 전까진 메모리를 낭비하지 않고, 클로저를 이용해서 동적으로 메모리 할당도 가능하다. 다이나익 프로그래밍(Dynamic Prgramming)문제에서 자주 응용되는 피보나치 수열을 제네레이터를 이용하면 아래와 같이 쉽게 구현할 수 있다.
```js
function* fibonacci() {
  let fn1 = 0;
  let fn2 = 1;
  while (true) {
    let current = fn1;
    fn1 = fn2;
    fn2 = current + fn1;
    let reset = yield current;
  }
}

let sequence = fibonacci();
console.log(sequence.next().value); // 0
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 2
console.log(sequence.next().value); // 3
console.log(sequence.next().value); // 5
console.log(sequence.next().value); // 8
```
또 제네레이터를 조합하여 사용도 가능하다.
```js
function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}

function* generator(i) {
  yield i;
  yield* anotherGenerator(i);
  yield i + 10;
}

let gen = generator(10);

console.log(gen.next().value); // 10
console.log(gen.next().value); // 11
console.log(gen.next().value); // 12
console.log(gen.next().value); // 13
console.log(gen.next().value); // 20
```
추가로 이터러블 객체를 이용하면 for-of나 spread와 조합해서 사용할 수 있는 매력도 있지만, 여러가지 유틸성 함수들도 뚝딱뚝딱 만들어 낼 수 있다. 아래 코드는 페이스북 개발 관련 그룹중 하나인 [함수형 자바스크립트](https://www.facebook.com/groups/539983619537858/)에서 [유인동](https://www.facebook.com/profile.php?id=100011413063178&fref=gs&__tn__=%2CdC-R-R&eid=ARCK4vCn8Se6LbyH3jyOfvTgAltiPbgNMb05NX01BS1_EPGOmRpIgQcBVpi3FWtjrIqBtWSe2VggLs8y&hc_ref=ARQ0VMdDMqIoClFzLTJK9zGnnOZsu60rI8h3gBVOQwG4XPPLmdEMR8r8RfdGSZF8p_4&dti=539983619537858&hc_location=group)님께서 작성하여 공유한 코드들을 소개해 본다.

[map + filter + reduce](https://gist.github.com/indongyoo/2bba6bc40d9894fd9374d68fbfb9759d?fbclid=IwAR1B2f9RnU3qasq8G_okoLQev9jYVh7AoEs7yeHe9uQZKmLNRJVO9WQyb-g)
```js
function reduce(f, acc, iter) {
  if (arguments.length == 2) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) acc = f(acc, a);
  return acc;
}

function* map(f, iter) {
  for (const a of iter) yield f(a);
}

function* filter(f, iter) {
  for (const a of iter) if (f(a)) yield a;
}

const add = (a, b) => a + b;
const list = [-1, 2, -3, 4];

reduce(add, map(Math.abs, list)); // 10
reduce(add, filter(a => a % 2, map(Math.abs, list))); // 4
```
[flat + deepFlat](https://gist.github.com/indongyoo/0104962e0b3340de5440f232e9d08f8a?fbclid=IwAR3btQ_YLEZcISHlOpPcj9h7up5r9NUPOj4jlvJG1JhV6pGl2HGKb05uEMk)
```js
const isIterable = a => !!(a && a[Symbol.iterator]);

function* flat(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* a;
    else yield a;
  }
}

function* deepFlat(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* deepFlat(a);
    else yield a;
  }
}

log([...flat([1, [2], [3, [4]], [[[5], 6]]])]);
// [1, 2, 3, [4], [[5], 6]];

log([...deepFlat([1, [2], [3, [4]], [[[5], 6]]])]);
// [1, 2, 3, 4, 5, 6];
```
 
## 마치며
이터레이터와 제네레이터는 잘만 사용하면 속도, 메모리, 간결한 로직 세마리 토끼를 모두 잡을 수 있는 스펙이다. 물론 자주 사용하지 않는 개념이어서 많은 노력과 경험이 필요해 보이지만, 자유자재로 사용할 수 있는 날이 온다면 한층 코드를 짜는 실력이 좋아지지 않을까 생각해본다.
