---
title: Data Structure For JavaScript
date: 2020-05-03T00:00:00.000Z
description: 자료구조를 자바스크립트로 구현해 보자.
---

재택근무 2달째, 코로나와 함께 일상이 변화하면서 일하는 패턴도 많이 변화했다.
일단 출퇴근 시간이 획기적으로 줄어들면서, 퇴근 전/후 개인적으로 가질 수 있는 시간이 굉장히 많아 졌으므로 새로운 무언가를 해보기로 했다.
일단 아침 잠이 많아 일어나자 마자 하는것은 불가능했므로, 저녁에 한시간 정도 투자할 수 있는 것을 고민 했고, 평소에 조금씩 공부 했지만 잘하지 못했던
알고리즘을 공부해 보기로 했다.

알고리즘은 [LeetCode](https://leetcode.com/)의 explore 문제를 따라가면서 풀거나, 30일 첼린지라는 하루에 한문제씩 알고리즘 문제를 제공해주는 프로그램을 따라 갔다.
지원하는 언어는 상당히 많이 있었는데, 일단 가장 익숙한 자바스크립트로 시작을 했다. 그러나 자바스크립트에는 C++과 Java와 다른점이 한가지 있는데, 바로 Built-In 자료구조가
많이 존재하지 않는다는 것이다. 그래서 보통 STL을 쓰면 쉽게 풀 수 있는 문제들도, 자바스크립트로 풀다보면 직접 구현해서 풀어야 하는 문제들을 종종 마주친다. 
따라서 이글에서는 알고리즘에서 쓸만한 심플한 자바스크립트 자료구조를 정리해 보고자 한다.

### Stack
일단 단순하면서도 많이 쓰는 스택부터 정리해 보자. 스택은 LIFO(Last In, First Out) 구조를 가진다. 당연히 자바스크립트에는 스택 구현체가 없으므로 직접 만들어야 하지만
다행히 Array에 스택과 비슷한 메서드들이 구현되어 있다. 기본적인 push/pop같은경우는 prototype에 정의된 메서드를 사용하고, peek은 적절하게 배열 접근으로 구현하면 좋다.
사실 push/pop만 있어도 웬만한 문제는 푸는데 지장이 없으므로, 이정도만 기억하도록 하자. 스택 같은 경우는 괄호 매칭이나 구간합을 구하는데 응용하면 편리하다.
```js
const stack = [];

stack.push(1);
stack.push(2);
stack.push(3);

stack[stack.length - 1]; // peek 3
stack.pop(); // 3
stack.pop(); // 2
stack.pop(); // 1
```

### Queue
큐는 FIFO(First In, First Out) 구조를 가진다. 큐 또한 구현체가 없으므로, Array를 이용하여 간단하게 구현하자. 큐의 핵심 메서드에는 enqueue와 dequeue가 있는데
enqueue는 큐에 삽입을 하는 메서드이고, 반대로 dequeue는 큐에서 제일 처음으로 들어간 값을 빼는 메서드이다. 적절하게 prototype 메서드를 이용하자.
큐는 BFS(Breadth-First Search)를 구현할 때 자주 이용하므로, 잘 기억해 두도록 하자.

```js
const queue = [];

queue.push(1); // enqueue 1
queue.push(2); // enqueue 2
queue.push(3); // enqueue 3

queue.shift(); // dequeue 1
queue.shift(); // dequeue 2
queue.shift(); // dequeue 3
```

### Linked List
C++에 익숙했던 나는 처음에 포인터 없이 연결 리스트를 어떻게 구현 해야 할까에 대해 오히려 고민을 많이 했었다. 하지만 객체를 참조하면 되기 때문에, 더 간단히 구현이 가능 하다.
```js
function Node(val) {
  this.val = val;
  this.next = null;
}

let head = new Node(0);
let node1 = new Node(1);
let node2 = new Node(2);

head.next = node1;
node1.next = node2;
```
물론, 이중 연결 리스트(Double Linked List)도 쉽게 구현이 가능하다. prev만 추가해서 양방향으로 참조하도록 구현하자.
```js
function Node(val) {
  this.val = val;
  this.next = null;
  this.prev = null;
}

let head = new Node(0);
let node1 = new Node(1);
let node2 = new Node(2);

head.next = node1;
node1.next = node2;
node1.prev = head;
node2.prev = node1;
```
리스트 같은 경우엔 다른 자료구조를 표현하는데 많이 사용된다. 또 이중 연결 리스트는 LRU Cache 같은 것을 구현할 때 사용이 되므로 알아 두면 좋다.

### Tree
트리는 보통 이진 트리(Binary Tree)를 많이 구현하므로, 여기서는 이진 트리를 어떻게 표현하는지 알아보도록 하자. 
구현 방법은 크게 두 가지가 있는데, 배열을 이용하는 방법과 연결 리스트를 이용하는 방법이다.
우선 배열을 이용하는 방법부터 알아 보도록 하자. 배열은.. 뭐없다. 그냥 트리 번호대로 배열에 집어넣으면 끝이다. 한가지 포인트는 index 0은 비워두는 것인데, root를 1부터 시작
하게 해서, 왼쪽 자식 노드는 index * 2, 오른쪽 자식 노드는 index * 2 + 1로 참조 하기 쉽게 약간의 트릭을 쓴다.
```js
/*       5
 *     /   \
 *    3      8
 *   / \   /  \
 *  1   4  7   9
 */
const tree = [null, 5, 3, 8, 1, 4, 7, 9];
```
연결 리스트를 이용한 구현 방법은 위에서 구현한 Node 구현체와 거의 비슷하다. left, right를 이용하여 자식 노드를 참조하도록 구현한다.
```js
function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

let root = new Node(5);
let left = new Node(3);
let right = new Node(8);
root.left = left;
root.right = right;
``` 

One more thing. 트리 문제에서 불가분의 관계를 가지고 있는게 순회(traversal)이다. 
연결 리스트를 이용해 트리를 구현했을 경우, 다음과 같이 재귀 함수를 이용하면 쉽게 트리를 순회할 수 있다.
```js
function traversal(node) {
  if (node === null) return;
  
  traversal(node.left);
  traversal(node.right);
}
```
트리의 순회 방법에는 루트 노드의 방문 순서에 따라 크게 세 가지로 나눌 수 있는데, preorder, inorder, postorder가 있다. 
핵심이 루트 노드 방문 순서이므로, 어느 시점에서 접근하냐에 따라 트리 순회방법을 표현할 수 있다. 참고로 이진 탐색 트리에서 inorder는 오름차순으로 정렬된다.
```js
function traversal(node) {
  if (node === null) return;
  
  console.log('preorder', node.val);
  traversal(node.left);
  console.log('inorder', node.val);
  traversal(node.right);
  console.log('postorder', node.val);
}
```

### Map
Map은 O(1)의 접근성을 가지는 매우 강력한 무기이다. ES5에서는 {}를 사용해서 구현하지만, ES6에는 Map 자료 구조가 추가 되었으므로 취향에 따라서 골라 사용하도록 하자.
Map은 시간복잡도를 줄이는데 결정적인 역할을 하는 경우가 많은데, 많은 문제를 풀어보면서 어떻게 활용하는지 알아두면 굉장히 좋다. 
시간 여유가 있는 사람은 [LeetCode 1번 문제 Two Sum](https://leetcode.com/problems/two-sum/)을 Map을 이용해서 풀어보도록 하자.
```js
const map = {};
map['p1'] = 1;
map['p2'] = 2;

map['p1']; // 1
map['p2']; // 2

// or 
const map = new Map();
map.set('p1', 1);
map.set('p2', 2);

map.get('p1'); // 1
map.get('p2'); // 2
```

### Set
Set은 Map과 비슷하지만, 중복된 값을 허용하지 않는다. 따라서, 중복이라는 키워드가 떠오른다면 Set을 적절하게 사용하자. 구현은 ES6 Set을 사용하는게 가장 편하다.
```js
const set = new Set();
set.add(1);
set.add(2);

set.has(1); // true
set.has(2); // true
set.has(3); // false
```

### Graph
그래프의 경우에는 딱히 왕도랄게 없다. 그냥 문제에 따라서 위에서 언급한 자료구조를 적절히 이용해서 표현한다. 
주로 [인접 행렬](https://ko.wikipedia.org/wiki/%EC%9D%B8%EC%A0%91%ED%96%89%EB%A0%AC)이나 연결 리스트를 이용한다.

## 마치며
> 천천히 흘러도 흘러가야 합니다.

학생때 한창 공부할때 풀었던 알고리즘 사이트 타이틀에 적혀있던 문구인데, 지금 와서 보니까 많은 의미를 담고 있었다는 생각이 든다.
처음엔 잘 몰랐지만 꾸준히 풀다보니 확실히 실력이 늘어가는게 느껴졌고, 루틴이 되다보니 뭔가 안풀면 빼먹은 듯 한 기분이 들기도 한다.
기술 포스트도 한동안 쓰지 않았는데 뭔가 반성이 되는 생각도 든다.

마지막으로 이렇게 막연하게 생각만 하던 것을 글로 써보니 당연한(?) 내용 같다.
하지만 인간은 망각의 동물이니 언젠가 다시 읽을 나에게 도움이 되길 바라며, 알고리즘 공부를 자바스크립트로
시작하는 누군가에게 조금이나마 도움이 되었으면 하는 마음을 여기에 담아 본다.