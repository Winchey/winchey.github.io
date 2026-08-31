---
title: 基于Hexo框架和NexT主题的个人博客搭建
date: 2021-09-13 15:08:04
tags:
  - Hexo
  - NexT
  - Blog
---

# 工具

框架：Hexo

主题：NexT

托管：Github Pages

<!-- more -->

# 参考

[Hexo官方文档](https://hexo.io/zh-cn/docs/)

[NexT官方文档](https://theme-next.js.org/docs/)

[GIthub Pages Documentation](https://docs.github.com/en/pages)

[知乎专栏 - MyBlog](https://www.zhihu.com/column/c_1201860091307458560)

# 问题

## DNS劫持

### 问题

给Github Pages配置custom domain后，打开custom domain却指向未知页面

### 解决

- windows下使用cmd，`ping yourname.github.io`后得到ipv4地址
- 先在仓库的Settings页面配置好custom domain
- 再去DNS 提供商解析域名

> Make sure you add your custom domain to your GitHub Pages site before configuring your custom domain with your DNS provider. Configuring your custom domain with your DNS provider without adding your custom domain to GitHub could result in someone else being able to host a site on one of your subdomains.

## YAML格式错误

### 问题

`FATAL YAMLException: bad indentation of a mapping entry`

![1](/images/2021-09-13-基于Hexo框架和NexT主题的个人博客搭建/1.png)

### 解决

line6 中 `title: 'LiWanqing's Blog'` 中引号中的引号需要转义，好在title后的字符串并不一定需要引号括起来，把引号删去即可。

```yaml
title: LiWanqing's Blog
```

## 图片存储位置

### ./${filename}

根目录下的`_config.yml`中，设置`post_asset_folder: true`，使得在`hexo new title`时，同时在`title.md`的父级文件夹中新建一个名为title的文件夹，用以存放images等文件。并且在typora的偏好设置 - 图像 - 插入图片时，选择'复制到指定路径'，并手动输入`./${filename}`。

```yaml
new_post_name: :title.md
post_asset_folder: true
```

![image-20210913195355484](/images/2021-09-13-基于Hexo框架和NexT主题的个人博客搭建/image-20210913195355484.png)

![image-20210913195411878](/images/2021-09-13-基于Hexo框架和NexT主题的个人博客搭建/image-20210913195411878.png)

***Attention :***

这种方法在开发时，文件和图片不在同一个文件夹，即`source/_posts/title.md`和 `source/_posts/title/picture`不在同一个文件夹内。

而部署至生产时，因为根目录下的`_config.yml`中配置了永久链接 `permalink: :year/:month/:day/:title/`，文件和图片却又在同一个文件夹，即`public/year/month/day/title/index.html` 和 `public/year/month/day/title/picture`在同一个文件夹。

```
permalink: :year/:month/:day/:title/
```

这样就导致，`title.md` 及依赖 `title.md` 生成的 `index.html` 引用图片时，相对路径写的不是同一个文件夹，引用不到图片，从而无法显示。

### ../../source/images/${filename}

根目录下的_config.yml中，设置post_asset_folder: false。而是在typora的偏好设置 - 图像 - 插入图片时，选择'复制到指定路径'，并手动输入../../source/images/${filename}。

```yaml
new_post_name: :title.md
post_asset_folder: false
```

![image-20210913165928205](/images/2021-09-13-基于Hexo框架和NexT主题的个人博客搭建/image-20210913165928205.png)

![image-20210913170404886](/images/2021-09-13-基于Hexo框架和NexT主题的个人博客搭建/image-20210913170404886.png)
