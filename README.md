# spreadsheet组件

## node version
8.16.0

## npm version
6.4.1

## Install demo

```bash
git clone https://github.com/yuanshi78/spreadsheet-vue.git
cd spreadsheet-vue
npm i
```
demo布局数据文件: tests/layout.js

## Run demo

```bash
npm run serve
```

# 组件API
## 属性
### layout

layout是表格布局数据，是二维数组
最外面的数组里的每个数组对应表格的每一行。
最里面的数组里的每个对象对应那一行里的每个单元格
```javascript
[
    [ 
        { row: '1:1', col: '1:1', value: 'row 1 cell 1' },
        { row: '1:1', col: '2:2', value: 'row 1 cell 2' },
        { row: '1:1', col: '3:3', value: 'row 1 cell 3' },
        ...
    ]
]
```
### 单元格对象的属性
#### row
row描写这个单元格是属于第几行的
##### 格式　
number:number，第一个number是start行，第二个number是end行
##### 例子
要是这是第二行的单元格，而且只占一行
```javascript   
{ row: '2:2', ... }
```
要是这是第三行的单元格，而且占两行 (就是它的rowspan是2)
```javascript   
{ row: '3:4', ... }
```

#### col
col描写这个单元格是属于第几列的
##### 格式　
number:number，第一个number是start列，第二个number是end列
##### 例子
要是这是第五列的单元格，而且只占一列
```javascript   
{ col: '5:5', ... }
```
要是这是第六列的单元格，而且占两行  (就是它的colspan是2)
```javascript   
{ col: '6:7', ... }
```
要是单元格占第一行的第二和第三列
```javascript   
{ row: '1:1', col: '2:3', ... }
```
##### value
单元格里显示的值

##### editable
true - 单元格里的值是可编辑的
false - 单元格里的值是不可编辑的

##### width
为必填的
单元格的宽度，比如 120px

##### height
为必填的
单元格的高度，比如 20px

##### style
为必填的
设置单元格样式的对象，参考layout.js

##### type
为必填的
单元格值的类型
值：number或text (暂时只支持这两个)

#### 用法
##### 选择可编辑的单元格
点击单元格

##### 移动选择
用上下左右箭头键移动选择

##### 编辑单元格里的值
第一个方式：双击单元格，修改值，按Enter键
第二个方式：要是已经选择了单元格，按Enter键, 修改值, 按Enter键

##### 取消可编辑的模式
第一个方式：点击另外个单元格
第二个方式：按Enter键