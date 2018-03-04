# 前端白皮书

> 规范只是指导，学习时应遵从，运用时应反思，遭遇疑难时应调整。规范也是发展的，需要逐渐完善，以追寻适合当前项目团队的最佳实践。

## 目标

* 代码可扩展，可测试，便于持续开发
* 流程规范，风格统一，便于团队协作
* 易学高效，便于新人融入，提高开发效率，又好又快

## 设计原则

* 在有限时间内，首先保证满足产品需要
* 追随最佳实践，学习并成长
* 模块化，模块代码内聚
* html、css 语义化，提高代码可读性
* 添加模块和库的单元测试，提高代码健壮性，便于后续扩展

## 代码规范

### 文件目录

* build (编译配置文件)
* config (全局配置)
* src

  * assets (基础资源)
    * img
    * font
  * api (API 封装)
  * components (模块组件)

    * common (全站通用组件)

    * adi

      * common (adi 基础组件)

        * text
        * media
        * menu

      * mod (adi Mod, 细节见 adi 规范)

      * selector (editor 中包含的各类数据选择器)

  * lib (JS 库)
  * pages (路由页面)

    * editor (编辑器页面)
    * viewer (md 页面)

  * router (路由)

### js 规范

* JavaScript standard style
* eslint

### css 规范

### ADI 规范

* 基本概念

  * 一个网站定义了特定的 theme，可以全站使用
  * 一个网站可以定义多个 layout，并设定 default
  * 一个页面默认引用站点 theme 和 default layout，可以按需切换 layout
  * 一个页面由一组 mod 组成，按糖葫芦串形式排列
  * 一个 mod 由一组 basic component 组成，component 的位置和容器大小由 mod 样式决定
  * mod 样式以 cssinjs 的形式定义，根据 styleID 生成对应的 css
  * mod 中一组 style 可以共享一个 template，template 中可以添加 theme 中定义的样式

* common component

  > 基础组件，不可嵌套使用

  * component.vue

    * 组件代码, 提供 normal 和 edit 两种状态
    * 基础组件参数由 mod 组件传入

  * component.properties.js

    * 组件默认数据
    * Mod 组件的默认数据由基础组件拼接而成，方便数据重用

  * component.factory.js

    * 基础组件工厂方法，便于在 mod 组件直接使用，使用 jsx 语法

## 常用开发思路

* 新的单页应用？
  * 新建模块，划分页面组件，寻找可复用组件
  * 添加新组件的测试内容
  * 添加新路由
  * 添加新的 API 封装
  * 保证内聚
* 新的 library？
  * 逻辑封装
  * 添加测试
  * 交付使用，与团队成员协作集成
* 新的 ADI MOD？
  * 是否需要新增基础组件？ (创建新的基础组件)
  * 添加 mod 目录
  * mod 包含那几个基础组件? (基础 property 生成)
  * mod 包含那几种布局？ (template 文件生成)
  * mod 有哪几种样式？ (style 文档生成)
  * 添加 mod.vue, 添加基础 mixin
* 新的 bug issue？
  * 锁定页面
  * 锁定模块
  * 锁定组件
  * 检验逻辑或样式
  * 修复并判断是否需要补充新的测试
