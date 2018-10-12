### Mod 定义

一个 mod 由一组 mod component 组成。
mod 基于栅格系统来组织这些 component。
暂时不支持 mod 嵌套和 component 嵌套，后续可以考虑支持。

栅格系统通过 row 和 col 的划分，使得所有 mod 内部的 component 呈树状结构

如下所示, 我们可以把 mod 抽象成一个树，并保证 mod 本身只有一个 row

```
- root
  - root-row
    - col1
      - child-row
        - col3
          - component1
        - col4
          - component2
    - col2
      - component3
```

### templates

对应的我们的 mod template 定义可以抽象为：

```
[
  {
    col1: [
      {col3: 'component1'},
      {col4: 'component2'}
    ]
  },
  {
    col2: 'component3'
  }
]
```

注：[] 意味着要加 row，{}意味着要加 col，二者总是配合着来，col 总是在 row 里

### components

由于 mod 总是包含一组 component，很多时候还会包含多个相同的 component，比如前例中的 component1 和 component3 可能是同一个 component。

对此，我们需要对每个 mod 定义它的 components 列表

```
const components = {
  component1: 'AdiCompA',
  component2: 'AdiCompB',
  component3: 'AdiCompA'
}
```

这样，在解析时，就会自动在 component1 处渲染 AdiCompA 了

### Style

我们提供一系列的 mod style，用户通过组合对应样式的 mod，就可以方便的构建自己的网站。
一个 style 只属于一组 template，一个 template 可以拥有多组 style

基于 mod 树，我们可以对应的为每一个元素添加样式，如下所示：

```
data: {
  root: {

  },
  rootRow: {

  },
  col1: {

  },
  col1Row: {

  },
  col2: {

  },
  col3: {

  },
  col4: {

  },
  component1: {

  },
  component2: {

  },
  component3: {

  }
}
```

在解析时，会从以下几个维度来设置样式：

1.  常规 css

我们使用 jss 语法来设置 css，基于前例，我们支持设置以下样式:

```
data: {
  root: {
    height: '100px'
  }
}
```

2.  theme

每个站点都可以设置全局 theme，mod 的某些样式可以从 theme 里面读取。由于全局 theme 样式是基于 jss 生成的一组样式类，因而，在 theme 设置里，需要做的是给对应元素添加 theme class。如：

```
theme: {
  root: ['font_0', 'color_1'] //添加了一组样式
}
```

3.  props

由于我们使用栅格系统，可以对对应的 row 设置 gutter 等值， 如下：

```
props: {
  rootRow: { gutter: 10 }
}
```

4.  options

对于 component 内部的一些设置，可以通过 options 来传入，可以绑定 theme，或者直接传入配置。

```
options: {
  theme: {
    menu: {
      menuBackground: 'bg_color_7',
      fontColor: 'color_0'
    }
  },
  config: {
    menu: {
      mode: 'horizontal',
      emptyLinkTarget: '_blank'
    }
  }
}
```

### 开发新 mod

1.  查看设计，是否可以通过已有的 component 构建
2.  如果缺 component，补之，可查看怎么新建 component
3.  添加 mod 目录，添加 index

```
import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base' // 使用默认的基础component，如果有特殊需求，可以添加新的component

const name = 'ModIFrame' // 添加mod名称

const components = {  // 添加子component列表
  iframe: 'AdiIFrame'
}

const templates = [[{ colIframe: 'iframe' }]] // 添加templates，如果template很多，请创建新文件，并在index中引入

const styles = [ // 添加样式，如果样式很多，请创建新文件，并在index中引入
  {
    theme: {
      root: [],
      rootRow: ['mod-full-width']
    },
    useImage: true,
    cover: require('@/../static/adi/IFrame.png')
  }
]

const properties = generateProperties(name, components) // 生成默认属性
properties.styleID = undefined // 调整一些默认属性

export default { mod, name, components, properties, styles, templates }
```

4.  在以下文件中添加相关引用

```
src/components/adi/mod/index.js // 注册mod
src/components/adi/mod/index.async.js // 注册mod
src/components/adi/mod/modslist.config.js // 注册mod到ui

src/lib/mod/parser/cmdHelper.js // 注册cmd
```

5.  在编辑器里调试
