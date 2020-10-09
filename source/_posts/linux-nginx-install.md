---
title: Linux服务器安装Nginx
date: 2019-05-29 23:16:41
tags:
  - Linux
  - Nginx
author: 左智文
img: https://img.90c.vip/linux/1_AUcJqY1Yh4KPZ_xEmS3AUQ.png?x-oss-process=image/format,webp
# password: cf6332a8a73916763aad4c668cf637467a3d554fb2f1bbd50ffc0b17f55129bc
summary: 本章节，将简单的介绍如何在Linux服务器上部署nodejs。
categories: Linux
---

系统平台：CentOS release 6.6 (Final) 64 位。

## 安装编译工具及库文件

```js
yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel
```

## 安装 PCRE

1.PCRE 作用是让 Nginx 支持 Rewrite 功能。

```js
[root@zzw2020 src]# cd /usr/local/src/
[root@zzw2020 src]# wget http://downloads.sourceforge.net/project/pcre/pcre/8.35/pcre-8.35.tar.gz
```

2.解压安装包:

```js
[root@zzw2020 src]# tar zxvf pcre-8.35.tar.gz
```

3.进入安装包目录

```js
[root@zzw2020 src]# cd pcre-8.35
```

4.编译安装

```js
[root@zzw2020 pcre-8.35]# ./configure
[root@zzw2020 pcre-8.35]# make && make install
```

5.查看 pcre 版本

```js
[root@zzw2020 pcre-8.35]# pcre-config --version
```

## 安装 Nginx

```js
[root@zzw2020 src]# cd /usr/local/src/
[root@zzw2020 src]# wget http://nginx.org/download/nginx-1.6.2.tar.gz
```

2.解压安装包

```js
[root@zzw2020 src]# tar zxvf nginx-1.6.2.tar.gz
```

3.进入安装包目录

```js
[root@zzw2020 src]# cd nginx-1.6.2
```

4.编译安装

```js
[root@zzw2020 nginx-1.6.2]# ./configure --prefix=/usr/local/webserver/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre=/usr/local/src/pcre-8.35
[root@zzw2020 nginx-1.6.2]# make
[root@zzw2020 nginx-1.6.2]# make install
```

5.查看 nginx 版本

```js
[root@zzw2020 nginx-1.6.2]# /usr/local/webserver/nginx/sbin/nginx -v
```

## Nginx 配置

创建 Nginx 运行使用的用户 www：

```js
[root@zzw2020 conf]# /usr/sbin/groupadd www
[root@zzw2020 conf]# /usr/sbin/useradd -g www www
```

配置 nginx.conf ，将/usr/local/webserver/nginx/conf/nginx.conf 替换为以下内容

```js
user www www;
worker_processes 2; #设置值和CPU核心数一致
error_log /usr/local/webserver/nginx/logs/nginx_error.log crit; #日志位置和日志级别
pid /usr/local/webserver/nginx/nginx.pid;
#Specifies the value for maximum file descriptors that can be opened by this process.
worker_rlimit_nofile 65535;
events
{
  use epoll;
  worker_connections 65535;
}
http
{
  include mime.types;
  default_type application/octet-stream;
  log_format main  '$remote_addr - $remote_user [$time_local] "$request" '
               '$status $body_bytes_sent "$http_referer" '
               '"$http_user_agent" $http_x_forwarded_for';

#charset gb2312;

  server_names_hash_bucket_size 128;
  client_header_buffer_size 32k;
  large_client_header_buffers 4 32k;
  client_max_body_size 8m;

  sendfile on;
  tcp_nopush on;
  keepalive_timeout 60;
  tcp_nodelay on;
  fastcgi_connect_timeout 300;
  fastcgi_send_timeout 300;
  fastcgi_read_timeout 300;
  fastcgi_buffer_size 64k;
  fastcgi_buffers 4 64k;
  fastcgi_busy_buffers_size 128k;
  fastcgi_temp_file_write_size 128k;
  gzip on;
  gzip_min_length 1k;
  gzip_buffers 4 16k;
  gzip_http_version 1.0;
  gzip_comp_level 2;
  gzip_types text/plain application/x-javascript text/css application/xml;
  gzip_vary on;

  #limit_zone crawler $binary_remote_addr 10m;
 #下面是server虚拟主机的配置
 server
  {
    listen 80;#监听端口
    server_name localhost;#域名
    index index.html index.htm index.php;
    root /usr/local/webserver/nginx/html;#站点目录
      location ~ .*\.(php|php5)?$
    {
      #fastcgi_pass unix:/tmp/php-cgi.sock;
      fastcgi_pass 127.0.0.1:9000;
      fastcgi_index index.php;
      include fastcgi.conf;
    }
    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|ico)$
    {
      expires 30d;
  # access_log off;
    }
    location ~ .*\.(js|css)?$
    {
      expires 15d;
   # access_log off;
    }
    access_log off;
  }

}
```

检查配置文件 nginx.conf 的正确性命令：

```js
[root@zzw2020 conf]# /usr/local/webserver/nginx/sbin/nginx -t
```

## 启动 Nginx

Nginx 启动命令如下：

```js
[root@zzw2020 conf]# /usr/local/webserver/nginx/sbin/nginx
```

## 访问站点

从浏览器访问我们配置的站点 ip:

![图1](https://img.90c.vip/linux/nginx7.png?x-oss-process=image/format,webp)

## Nginx 其他命令

以下包含了 Nginx 常用的几个命令：

```js
/usr/local/webserver/nginx/sbin/nginx -s reload            # 重新载入配置文件
/usr/local/webserver/nginx/sbin/nginx -s reopen            # 重启 Nginx
/usr/local/webserver/nginx/sbin/nginx -s stop              # 停止 Nginx
```
