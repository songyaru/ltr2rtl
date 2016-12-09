# rtl

自动转换 css 文件以适应从右到左的语言布局

## 通过npm安装:

```shell
npm install rtl -g
```

## git仓库地址:

[https://github.com/songyaru/ltr2rtl](https://github.com/songyaru/ltr2rtl)

## 使用方法

### 在命令行中输入

```shell
rtl
```

在命令行当前目录及其子目录下搜寻包含 ltr 或者 rtl 目录的 css 文件

如:将 ltr 语言类型的 css 文件转换成 rtl 文件,搜寻```./somedir/ltr/otherdir/``` 这一类目录下的所有 css 文件，转换后生成到```./somedir/rtl/otherdir/```目录下

### 命令参数

```shell
rtl -r
```
-r(reverse) 搜索```./somedir/rtl/otherdir/``` 这一类目录下的所有css文件，转换后生成到```./somedir/ltr/otherdir/```目录下

将 rtl 语言类型的 css 文件转换成 ltr。方便调试修改后写回到 ltr 文件

```shell
rtl -f
```
-f(suffix) 搜寻或生成 rtl 语言类型的 css 文件都会自动加上 -rtl 的后缀
如:```./*/ltr/*/*-rtl.css```

## 其他说明

待转换的 css 中,如果有 rtl 特有的样式，可以写在以``` /*rtl rtl*/ ``` 包裹的注释里面，生成 rtl 的时候会自动把这部分注释打开。以达到只维护一份 css 文件的目的。

