# 项目生成
* 步凑 1 : 

```bash
npm install -g yo //安装yeoman 
npm install -g generator-aliak //安装项目生成器
```

* 步凑 2: 

```bash
mkdir yourProjectName //创建一个目录
cd yourProjectName//定位到目录下
yo aliak//安装sdk
tnpm i rn-packager@~0.2.5 -g//安装本地服务器
npm install keymirror --save
rnpackager start//启动本地服务器
```

* 下载开发包
    - ios 
    
    http://mtl3.alibaba-inc.com/project/project_build_config.htm?spm=0.0.0.0.Ds2ibg&projectId=19577&buildConfigId=155910
    - android
    
    http://mtl3.alibaba-inc.com/project/project_build_config.htm?spm=0.0.0.0.PXdi7X&projectId=19573&buildConfigId=168016
* 扫码打开本地服务

android

```
react://rn/test.html?rctUrl=http://30.9.133.209:8081/index.bundle&platform=android&dev=true&framework=true

```

iOS 

```
react://rn/demo?rctUrl=http://30.9.128.123:8081/index.bundle&platform=ios&dev=true&framework=true

```

![Image](http://gtms04.alicdn.com/tps/i4/TB1hNR2MFXXXXbgXXXX1mFY0FXX-321-589.gif)
