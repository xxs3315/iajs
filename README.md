<!--suppress HtmlDeprecatedAttribute -->
<div align="center">

<h2>iajs: 一个基于fabricjs，框架无关的图片注记前端库</h2>

</div>

----

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**内容列表**

- [主要特性](#主要特性)
- [运行环境](#运行环境)
- [文档](#文档)
- [关于packages和apps](#关于packages和apps)
- [其他](#其他)
  - [示例应用](#示例应用)
  - [许可证](#许可证)
  - [致谢](#致谢)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 主要特性

- 基于`Typescript`使用`monorepo`搭建了项目
- 组件库与前端框架无关，可以选择多种前端框架进行应用开发，同时也提供了`vue`/`react`/`html`示例供参考
- 实现了插件`plugin`机制，可以自行扩展功能，同时也提供了`plugin`开发示例
- 适配了`pc`端和`mobile`端
- 还有更多...

## 运行环境

- `pnpm v9.14.2`
- `node v20.18.1`

推荐使用`pnpm`, 运行速度快，还可以避免`hoisting`引发的依赖问题(可参考 https://github.com/NiGhTTraX/ts-monorepo/commit/d93139166b25fab15e9538df58a7d06270b846c9 示例)

```sh
# Install pnpm with your preferred method: https://pnpm.io/installation.
npm i -g pnpm

# Install all dependencies.
pnpm i
```

## 文档

- `W.I.P`

## 关于packages和apps

- `apps` 指可以运行的应用，如`vue`/`react`/`html`应用
- `packages` 核心及插件

## 其他

### 示例应用

**apps**

- [vue3](apps/iajs-vue3)
- [react](apps/iajs-react)
- [responsive html](apps/iajs-responsive-html)

**packages**
- [core](packages/iajs)
- [mobile gesture support](packages/iajs-plugin-mobile-gesture)
- [responsive ui](packages/iajs-plugin-mobile-ui)
- [crop plugin](packages/iajs-plugin-crop) `W.I.P`

### 许可证

- `MIT`

### 致谢

- [ts-monorepo](https://github.com/NiGhTTraX/ts-monorepo)
- [fabric.js](https://github.com/fabricjs/fabric.js)
- 还有更多，请联系我添加到这里


