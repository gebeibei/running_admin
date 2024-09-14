# running_admin

关于 vue3 版本的管理后台项目脚手架；

### 关于缓存 useAlive

1. 保证当前的路由和要返回的路由在配置文件 breadcrumb.js 中存在关联关系；
   比如编辑页面（form）和列表页（table），在配置中编辑页面的 pathTrack 数组中为['table', 'form']，则表示是从 table 页面跳转 form 页面；

2. 在编辑页面点击提交时候，需调用 useAlive 中方法 setActivated，将当前页面前面的轨迹路由响应标识 needUpdate 更新为 true；

3. 在列表页，需调用 useAlive 中方法 onAlive 方法，其回调方法中可执行更新操作；

### 关于更新当前页面的面包屑显示 label

调用 useBreadcrumb 中 updateBreadcrumb 方法即可，例如 updateBreadcrumb({ index: -1, payload: { label: '编辑 1111' } })；

### 关于新增、编辑页面阻止返回

在 useBack 中将变量 needValid 设置为 false,在返回时，将不会验证用户是否输入数据；

### 关于unocss

1. 安装 UnoCss 插件；
2. 按照直觉来书写类名即可；一些常见的写法：宽度： w-10; 高度： h-10; 背景颜色： bg-#405ffe; 边框： b="1 solid #dcdfeb"; 圆角： rd-2; 居中： text-center; 等等；
3. 常见的伪类写法： class="hover:bg-#405ffe important:w-10 empty", (before、after、important、empty)；
4. 属性分组： 同一类属性可以写在一起，比如边框 class="b-1 b-solid b-#dcdfeb"可以简写为 b="1 solid #dcdfeb"；
5. class="w-10 h-10 bg-#405ffe b:(1 solid #dcdfeb) rd-2 fw-700 m-1 p-1 m-l-5 p-x-5 f-c-c f-14 z-10 op-90"
6. 交互式地址：https://unocss.dev/interactive/ ， 可输入css样式查看简写；


