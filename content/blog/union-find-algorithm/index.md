---
title: Union-Find Algorithm
date: 2020-12-05T00:00:00.000Z
description: 서로 다른 두 집합을 병합하는 방법. Union-Find에 대해 알아보자.
---

올해는 코로나로 인해 집콕을 장기간 하게 되면서, 알고리즘 문제를 푸는 건전한(?) 취미를 가지게 되었다. 그런데 알고리즘 문제를 풀고나서 정리를 하지 않다보니, 뭔가
남는게 없는 느낌이 강하게 들었다. 학생때도 공부하고, 회사다니면서 다시 보았던, 하지만 문제 풀 때마다 새롭게 느껴졌던...몇가지 알아두면 유용한 알고리즘을 정리해 보고자
한다. 그 첫번째로 소개할 알고리즘은 Union-Find 이다. 

그전에 먼저 이해를 돕기위해 Disjoint Set에 대해 알아보도록 하자. Disjoint Set이란 서로 중복되지 않는 부분 집합들로 
나눠진 원소들에 대해, 정보를 저장하고 조작할 수 있도록 고안된 자료구조이다. 예를 들면, S=[1, 2, 3, 4]라는 집합이 있을때 A=[1, 2] 와 B=[3, 4]는 Disjoint Set에 해당한다.
이 Disjoint Set은 데이터를 다루기 위해 제공하는 몇가지 연산이 존재하는데, 그 중 서로 다른 두개의 집합을 병합하는 연산인 Union, 원소가 어느 집합에 속해있는지 판단하는 연산인 Find가
있다. 여기서 주로 이용하는 Union과 Find 연산이 핵심이 되기 때문에 Union-Find라 많이 부른다.

이 알고리즘은 주로 "합집합"을 찾을때 사용하는데, 예를 들면 이렇다.

> A랑 B는 친구이고, B랑 C는 친구이다. 그렇다면 A랑 C는 간접 친구라 할 수 있는데, 이렇게 친구끼리 연결되어 있으면 하나의 그룹으로 묶을 수 있다고 정의하자.
그렇다면 N명의 사람이 존재할 때, 각각에 대하여 친구 정보가 주어진다면 총 몇개의 그룹으로 나눌 수 있을까?

이제 막연하게 어떤 느낌인지는 이해가 될 것이다. 앞서 말했듯이 Union-Find는 집합을 이용하는 알고리즘이다. 그렇다면 어떻게 집합을 표현하는지가 궁금할 텐데,
이제부터는 이해를 돕기 위해 예제를 보면서 찬찬히 들여다 보도록 하자.

4개의 노드가 존재하고, 각 노드의 Index를 [0, 1, 2, 3]이라 하자. 이를 표로 나타내면 다음과 같다.

| i | 0 | 1 | 2 | 3 |  
|:---:|---|---|---|---|

여기서 0번과 1번드 노드, 2번과 3번 노드가 서로 연결되어 있는 그룹이라고 하자.
```
0-1, 2-3
```
그렇다면 이 그룹을 어떻게 표현할 것인가? 핵심은 부모(Parent)의 표현이다. 각 노드의 고유 표현은 Index, 값은 부모의 Index를 나타낸다.
이를 표로 나타내면 다음과 같다.

| i | 0 | 1 | 2 | 3 |  
|:---:|---|---|---|---|
| Parent[i] | 0 | 0 | 2 | 2 |
0번 노드의 부모는 자기 자신, 1번 노드의 부모는 0이므로 0과 1이 하나의 그룹으로 묶여 있다는 것을 나타낸다. 2번과 3번 노드도 마찬가지 이다.
이를 배열로 표현하면 다음과 같다.
```javascript
parent = [0, 0, 2, 2]
```
배열을 사용하지만 자세히 보면 구현방식은 트리 구조이다. 자 이제 어떻게 표현하는지 알았으니, 아래 예제를 통해 Union-Find 알고리즘의 동작방식에 대해 알아보도록 하자. 아래와 같이 각 노드들의 정보가 주어졌을 때,
위에서 언급한 방법을 이용하여 표현할 수 있다.
```
0-1, 1-2, 3-4, 5 6
```
먼저 초기 데이터를 정의한다. 각각의 노드는 누가 어떤 노드와 연관되어 있는지 모르기 때문에, 자기 자신을 부모로 가진다. 이렇게 자기 자신을 부모로 가지게 초기화 하는
연산을 make-set이라 부른다. 이를 표로 나타내면 다음과 같다.

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|:---:|---|---|---|---|---|---|---|
| Parent[i] | 0 | 1 | 2 | 3 | 4 | 5 | 6 |

자 이제 0-1이 연결되어 있다는 데이터를 이용하여 Union 함수를 호출한다. union(0, 1)을 해준 결과를 표로 나타내면 다음과 같다.

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|:---:|---|---|---|---|---|---|---|
| Parent[i] | 0 | <span style="color:red">0</span> | 2 | 3 | 4 | 5 | 6 |

자 이제 다음 데이터인 1-2를 이용하여, union(1, 2) 함수를 호출한다.

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|:---:|---|---|---|---|---|---|---|
| Parent[i] | 0 | 0 | <span style="color:red">1</span> | 3 | 4 | 5 | 6 |

라고 생각을 했을 것이다. 하지만 이렇게 나타낼 경우, 1번 노드와 2번 노드가 연결되어 있다는 것은 쉽게 알수 있지만, 0번노드와 2번노드가 서로 연관되어 있다는 것을
알기가 쉽지 않다. 따라서 이 경우엔 부모의 부모를 찾아가서, 마지막으로 도착하는 노드의 Index를 이용한다. 따라서 표로 나타내면 다음과 같다.

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|:---:|---|---|---|---|---|---|---|
| Parent[i] | 0 | 0 | <span style="color:red">0</span> | 3 | 4 | 5 | 6 |

이제 마지막으로 3-4 데이터를 이용하여, Union(3, 4)를 해주면 최종적으로 다음과 같은 표가 완성된다.

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|:---:|---|---|---|---|---|---|---|
| Parent[i] | 0 | 0 | 0 | 3 | <span style="color:red">3</span> | 5 | 6 |

이를 배열로 나타내면 다음과 같다.
```javascript
parent = [0, 0, 0, 3, 3, 5, 6]
```

자 이제 이 내용을 코드로 작성해보자. 앞서 언급했듯이 union과 Find 연산을 함수로 표현한다.
```javascript
const p = [];

// make-set
for (let i = 0; i < 7; i++) {
  p.push(i);
}

function find(x) {
  if (x === p[x]) {
    return x;
  } else {
    return find(p[x]);
  }
}

function union(x, y) {
  x = find(x);
  y = find(y);

  if (x < y) p[y] = x;
  else p[x] = y;
}

union(0, 1);
union(1, 2);
union(3, 4);

console.log(p); // [0, 0, 0, 3, 3, 5, 6]
```

이게 가장 기본적인 Union-Find의 동작 방식이다. 그런데 자세히 보면 문제점이 몇가지 있다. 다음과 같이 자료 선형적일 경우, Find 연산이 루트 함수를 찾아가는데
O(N)의 시간복잡도를 가지게 된다.
```
1
 \
  2
   \
    3
     \ 
      4
```
그렇다면 이 현상을 개선할 순 없을까? Find 함수를 약간 수정해서 최적화 할 수 있다. 루트노드를 찾을 때 마다, 해당하는 노드의 루트를 갱신하는 방법이다.
```javascript
function find(x) {
  if (x === p[x]) {
    return x;
  } else {
    return p[x] = find(p[x]);
  }
}
```
이밖에도 트리의 깊이가 깊어지지 않도록, 높이가 낮은 트리를 높이가 더 높은 트리 밑에 넣는 Union-By-Rank라는 최적화 기법도 있다.

이제 Union-Find 알고리즘에 대해 알아보았으니, 관련된 문제를 풀어가며 익혀 보도록 하자. 위 내용을 충분히 이해했다면 해결하는게 어렵지 않을 것이다.
- [LeetCode 547. Friend Circles](https://leetcode.com/problems/friend-circles/)
- [LeetCode 990. Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations/)
- [LeetCode 1319. Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/)