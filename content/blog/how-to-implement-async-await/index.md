---
title: Async-await는 어떻게 구현하는가
date: 2018-10-07T14:56:07.725Z
description: 지난 포스트였던 Javascript Iterator에서 잠깐 언급했었던 async-await에 관해 이야기해 보도록 하자. 시작하기에 앞서 이 포스트에서는 async-await에 대한 문법을 다루지 않는다. async-wait가 어떤 배경을 가지고, 어떤 방법을 통해 구현이 되어있는지 그 근원에 대한 탐구를 할 생각이다. 
---
지난 포스트였던 Javascript Iterator에서 잠깐 언급했었던 async-await에 관해 이야기해 보도록 하자. 시작하기에 앞서 이 포스트에서는 async-await에 대한 문법을 다루지 않는다. async-wait가 어떤 배경을 가지고, 어떤 방법을 통해 구현이 되어있는지 그 근원에 대한 탐구를 할 생각이다. 따라서 iterator, promise, generator, async-wait, 그리고 Babel에 대한 사전 지식이 필요한 사람들은 아래 링크에 있는 글들을 먼저 읽어보길 바란다.
- [Javascript Iterator](https://medium.com/@la.place/javascript-iterator-b16ca3c51af2)
- [ES6의 제너레이터를 사용한 비동기 프로그래밍](https://meetup.toast.com/posts/73)
- [Async Function](https://developers.google.com/web/fundamentals/primers/async-functions?hl=ko)

## Async-await?
Async-await는 ECMA-262에서 초안으로 처음 등장했으며, ECMAScript 2017에서 표준으로 정의되었다. 비동기 프로그래밍을 동기 방식처럼 직관적으로 표현할 수 있어서, Callback을 많이 사용하는 프론트엔드 개발자들에게 많은 사랑을 받고 있다.

다른 언어를 공부해 본 사람은 어렴풋이 느끼겠지만, 사실 async-wait는 자바스크립트의 전유물이 아니다. 비동기 로직을 쉽게 작성하기 위한 방법은 자바스크립트 뿐만 아니라, 네트워크를 다루는 모든 언어에서 고민을 해왔다. 비동기가 들어간 비지니스 로직은 중첩될수록 그 복잡도가 기하 급수적으로 늘어나며, 이를 간결하게 한다는 것은 유지보수와 생산성의 향상으로 귀결되기 때문이다. 마찬가지로 TC-39에서도 같은 고민을 했을 것이고, 다른 언어에서 사용하는 솔루션을 많이 참고했을 것이다. 결과적으로 promise와 generator, 그리고 async-wait가 새로운 스펙으로 도입되었다. 그래서 다른 언어(예를들면 C#)에도 비슷한 문법이 존재하는데, 마찬가지로 비동기 로직을 제어하기 위해 주로 사용되며, 사용방법도 크게 다르지 않다. 그러나 자바스크립트에는 다른 언어와 다른 치명적인 단점이 존재하는데, 바로 하위 버전의 브라우저에서는 사용할 수 없다는 것이다.

이는 자바스크립트가 브라우저에 종속적이기 때문에 발생하는 태생적인 문제이다. 다행스럽게도 하위 브라우저에서도 사용할 수 있는 방법이 있었으니 바로 Babel같은 컴파일러(트랜스파일러라고도 부른다)를 이용하여 ES5 문법으로 바꿔주면 되기 때문이다. 여기서 한가지 의문이 든다. ES5로 바꿔준다는 것은, 다시 말하면 ES5로 구현이 가능하다는 것이다. 그렇다면 브라우저에서 구현과 별개로 어떻게 ES5 스펙만으로 이를 가능하게 하는 것일까? 여기에 이전 포스팅에서 다루었던 Generator, 그리고 Promise가 깊게 관여한다.

## Async-await와 Generator
이 포스트에서는 Babel을 통해 어떻게 async-await를 구현하는지 알아볼 것이다. 거두 절미하고 Babel에서 어떻게 컴파일 하는지 살펴보도록 하자.
```js
// ES7
async function foo() {
  await bar();
}

// ES5 complied
let foo = (() => {
  var _ref = _asyncToGenerator(function*() {
    yield bar();
  });

  return function foo() {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step("next", value);
            },
            function(err) {
              step("throw", err);
            }
          );
        }
      }
      return step("next");
    });
  };
}
```

간단한 비동기 함수 foo 와 bar 를 이용해서 컴파일 해 보았다. 컴파일 된 함수를 보면 크게 복잡하지 않은데, async keyword를 generator로 바꾸고 await keyword는 yield로 바꾸었다.

그렇다. Babel에서는 async-wait를 generator를 이용해서 구현을 한다. 이전 포스팅인 iterator에서도 설명을 했었지만, generator는 yield를 만날 때까지 실행되고, 이때 컨텍스트는 저장된 상태로 남아 있게 된다. 따라서, 비동기 로직이 종료되었을 때마다 적절하게next()를 호출해주기만 하면, aysnc-await 함수가 완성되는 것이다.

그러나 bar()함수의 작업이 종료되는 시점은 bar()함수밖에 모른다. 그렇다고next()를 bar()함수 내에서 직접 실행하게 된다면 의존성이 생기게 된다. 그렇다면 어떻게 의존성을 분리할 수 있을까? 이 문제를 해결하기 위해서 사용된 것이 바로 promise이다. Babel은 promise와 재귀함수를 이용하여 next()를 대신 호출해주는 함수를 만드는데, 그게 바로 _asyncToGenerator이다.

_asyncToGenerator 함수를 간략하게 살펴보도록 하자. fn.apply를 실행하여 인자로 넘어온 generator를 실행하여 iterator 객체를 클로저로 저장해둔다. 나머지는 클로저에 저장한 iterator를 실행시키고, 반환된 promise객체를 재귀함수(여기서는 step)를 통해 반복해서 실행시켜 주는 것이다(잘 이해가 되지 않는 사람은 [ES6의 제너레이터를 사용한 비동기 프로그래밍의 “제너레이터와 프라미스의 만남”](https://meetup.toast.com/posts/73) 부분을 다시 보도록 하자).

정리하자면 generator는 비동기적 패턴을 yield를 통해 동기적인 “모습"으로 바꾸어주고, promise는 generator로 만든 iterator를 반복해서 실행해주는 역할을 한다. await keyword에 사용하는 함수가 항상 promise를 반환해야하는 이유가 여기에 있다.

## ES5와 Generator

여기서 한가지 더 생각해 보자. generator 도 ES5 스펙이 아니지 않은가? 그렇다면 generator는 어떻게 ES5로 구현이 되는 것일까. Babel에 ES2015옵션을 주면 다음과 같이 컴파일 된다.
```js
// ES6
function* foo(){
  yield bar();
}

// ES5 Compiled
"use strict";

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(foo);

function foo() {
  return regeneratorRuntime.wrap(
    function foo$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.next = 2;
            return bar();

          case 2:
          case "end":
            return _context.stop();
        }
      }
    },
    _marked,
    this
  );
}
```

Iterator 포스팅에서 generator는 Iterable Protocol을 구현하는 객체였다. 그러나 실제로 컴파일 된 모습을 보면 프로토콜과 관련된 코드는 찾아 볼 수 없다. 대신에 regeneratorRuntime 이라는 객체가 눈에 띄는데 혹시 이녀석이 그 역할을 해주는게 아닐까?

결론부터 말하자면 Babel은 regenerator라는 라이브러리를 사용하여 generator를 구현한다. 그렇다면 이 라이브러리는 누가 만든 것인가. 코드의 역사를 따라가다 보면 [facebook/regenerator repository](https://github.com/facebook/regenerator)에 도달하게 된다. 이 라이브러리는 2013년 Node.js v0.11.2에서 generator syntax를 지원하기 위해 만들어 졌으며, Babel에서는 이 라이브러리를 사용하여 generator를 구현하고 있다. 실제 코드를 들여다보면 Symbol과 Iterator를 이용해서 Iterable Protocol을 구현하고 있다. 결국 좀 과장을 보태면 async-wait는 iterator 개념으로부터 시작되어 generator로 발전하였으며, promise와 콜라보레이션으로 이루어진 멋진 스펙인 것이다.

Generator에 대해 찾아보면서, 세부 구현은 꽤 오래전에 이미 완성되어있었다는 것을 깨닫고 놀랐으며, 글을 쓰다보니 스스로도 언어에 대한 철학과 그 원리에 대해 깊게 고민해보지 않았던 것을 깊게 반성했다. 또 비교적 어려운 내용이다보니 쉽게 풀어쓰려 노력했지만, 무거운 내용이 되어서 아쉽기도 하다. 마지막으로 promise의 구현에 대한 내용은 이 포스트에서 다루지 않았는데, 다음 기회에 깊게 알아보도록 하자. 처음 접한 사람은 이해하기 힘든 부분이 많을 것이라 생각되므로, 서론에 링크한 글은 다시 한번 꼭 읽어보길 바란다.