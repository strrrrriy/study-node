# 1. npm bower
https://cloud.tencent.com/developer/article/1343652

npm 在windows 普通的bush 安装很慢应该在 git下安装才会很快的

注：bower下载安装依赖库实际上是使用git进行下载。对于linux系统，由于默认都有安装git，所以一般没问题。但是windows系统一般没有git。在windows系统下需要确定安装了git客户端，建议使用同捆的git bash命令行来执行bower install命令。或者把git目录加入windows的环境变量中，再在命令行中执行bower install命令。
1. 用npm包管理工具下载并全局安装bower: `npm install -g bower`
2. 可以查看Bower的帮助信息:`bower help`
3. 初始化当前工程的bower，此操作会在当前目录下生成bower.json文件: `bower init`


# 2. bower的使用
1. 使用了bower的项目都会在目录下有一个bower.json文件。在该文件同级目录下，使用如下命令即可安装相关依赖库: `bower install`

2. 使用bower安装某个特定类库，例如jquery: `bower install jquery`

3. 使用bower更新某个特定类库，例如jquery: `bower update jquery`

4. 删除包,例如jquery (如果包已经被依赖，则不能删除): `bower uninstall jquery`

5. 试着在项目文件夹下，下载jquery 和 underscore: `bower install jquery underscore`
然后就可以看到项目文件夹下多了bower_components（默认目录）,再就是两个插件包了![](https://ask.qcloudimg.com/http-save/yehe-2442861/sr12ten0dx.png?imageView2%2F2%2Fw%2F1620)



bower_components

初步这样也就行了，但是/bower_components这个目录有点让人不习惯，我想把东西下载到我习惯的目录里。需要加一个.bowerrc文件。注意，不需要名字什么的，只要新增一个.bowerrc就行了。

提示：用cmd命令创建文件如下


cmd创建文件


.bowerrrc

里面可以定义下载目录：

 {

 "directory": "app/vendor"
 }
 


.bowerrc 配置

 关于.bowerrc更多配置，请参考
https://github.com/bower/spec/blob/master/config.md

 

同样的cmd命令再执行一遍，这次可以看到文件下载到app/vendor中了。


下载到指定目录

由于在实际安装过程中，没有运行命令 >bower init 现在重新运行该命令 生成bower.json

遇到了问题


bower init 失败

解决办法：在 windows cmd 里面使用 bower init,而不是在 git bash 里面使用 bower init.


init 设置

 使用bower install jquery --save才会把jquery依赖记入到bower.json。
 要安装某个版本使用#，如安装juqery1.9.1，可以使用bower install jquery#1.9.1。
 除了用包名安装，也可以指定git地址，进行安装，如bower install https://github.com/jquery/jquery。

 

bower install --save handlebars 后就会看到handlebar 在bower.json的dependencies里，如果不加--save就不会有。


handlebars

接下来删了app/vendor下的所有内容，然后bower install，他会把bower.json中的dependencies重新下载。