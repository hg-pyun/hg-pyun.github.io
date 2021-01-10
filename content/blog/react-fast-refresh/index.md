---
title: React Fast Refresh
date: 2021-01-10T00:00:00.000Z
description: React-Hot-Loader의 대안, React Fast Refresh에 대해 알아보자.
ogImage: './title.png'
---
![react](./title.png)

최근에 React 프로젝트르 세팅하다가 React-Hot-Loader 문서를 보니, React Fast Refresh라는 새로운 도구가 나온 것을 발견했다. 
React-Hot-Loader를 만든 페이스북 개발자 Dan Abramov는 기존 핫 로더에 한계가 있다고 평가하면서, 앞으로는 React Fast Refresh로 대체될 것이라 생각한다고 의견을 밝혔다. 기존의 핫 로더는, 대규모 앱에서 코드변경, exprot/import 문제, Typescript관련 문제 등 앱이 매우 느리게 동작하는 것이 문제였다. 그 대안으로 나온게 Fast Refresh이며, 2019년 React Native 0.61에 처음 도입 되었다.

그렇다면 React Fast Refresh가 하는 일은 무엇인가?

-   앱 전체를 다시 다운로드 하지 않고, React 구성 요소만 다시 렌더링 한다.
-   구문 오류 또는 런타임 오류가 발생했을 경우에, 자동으로 앱을 다시 실행시킨다.
-   구문 오류가 있는 모듈은 실행시키지 않는다. Fast Refresh가 동작하는 도중에 구문 오류가 발생할 경우, 오류가 발생한 파일을 수정하면 앱을 자동으로 다시 로드한다.
-   Hooks를 지원한다.

그렇다면 React Fast Refresh를 적용하려면 어떻게 하면 되는 것일까?

-   Create React App: \`FAST\_REFRESH=true\` [옵션](https://github.com/facebook/create-react-app/blob/master/docusaurus/docs/advanced-configuration.md)을 사용한다. development에서는 true값을 디폴트로 사용하고 있다.
-   Parcel 2: [React Refresh#3654](https://github.com/parcel-bundler/parcel/pull/3654)에 추가되었다.
-   Webpack: 아직 실험적인 버전이지만 [Webpack-Plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin/)이 존재한다.

나는 현재 최신 스펙인 Webpack5 + Typescript를 기반으로 설정을 진행해 보았다. 설치는 아래 명령어를 사용한다.

```sh
$  npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

타입 스크립트를 사용한다면 \`type-fest\`를 설치한다 (스펠링 주의!)

```sh
$ npm install -D type-fest

```

Webpack.config.js는 다음과 같이 구성한다.

```ts
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
};

```

하지만 자세히 보면 위 코드는, typescript의 ts-loader가 아닌 babel-loader을 사용하고 있다. 따라서 위 코드를 사용하려면 번거롭게 Babel-Typesscript를 구성해야 한다. 
Hot Module Replacement를 이용하기 위헤, Babel까지 추가 설치하는건 약간 부담이 되었다. 다른 방법은 없을까 찾아보는 도중, Issue에 타입스크립트 적용에 대한 토론이 남아 있는 것을 발견하였. 
[Add react-refresh-typescript #248](https://github.com/pmmmwh/react-refresh-webpack-plugin/pull/248)을 보고 webpack.config.js를 다음과 같이 구성 했다.

```sh
$ npm install -D react-refresh-typescript
```

```ts
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const ReactRefreshTypeScript = require('react-refresh-typescript').default;
const isDevelopment = process.env.NODE_ENV !== 'production';
module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: isDevelopment ? [ReactRefreshTypeScript()] : [],
              }),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
};

```
이제 React 앱을 동작한 후, 소스코드를 수정하면 HMR이 잘 동작하는 것을 볼 수 있다.

## 마치며
기존 React-Hot-Loader의 경우, 컴포넌트의 소스코드를 수정해야 하는 경우도 있었는데, webpack 설정만으로 HMR을 적용할 수 있어서 이전보다 굉장히 코드가 깔끔해졌다.
아직 실험적인 버전이지만, 도입해볼만 가치가 있다고 생각한다.