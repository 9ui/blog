---
title: GitHub Action File
date: 2021-02-23 09:28:46
tags:
  - github
  - ci/cd
author: 左智文
img: https://img.90c.vip/other-cover/1554052_a370.jpg?x-oss-process=image/format,webp
summary: GitHub Action 是 GitHub 于 2018 年 10 月推出的一个 CI\CD 服务。
categories: GitHub Action
---


使用GitHub Actions在存储库中自动化，自定义和执行软件开发工作流程。您可以发现，创建和共享操作以执行所需的任何作业（包括CI / CD），并在完全定制的工作流程中组合操作。

## 前沿

> 本文章主要介绍如何使用github action 将自己的项目自定义和执行软件开发工作流程。

## 新建工作流文件

1. 在根目录下新建.github/workflows目录文件。
2. 新建需要执行的.yml工作流文件 （例如: develop.yml）
3. 自定义工作流

## 自定义工作流

```text

# 该workflow的名称，可以随意填写
name: Publish And Test

# workflow的触发事件，这里代表release分支的push事件触发
on:
  push:
    branches: [develop]
# 任务
jobs:
  build:
    # 运行所需要的环境
    runs-on: ubuntu-latest

    steps:
      # 切换分支
      - name: Checkout
        uses: actions/checkout@v2

      # 下载 git submodule
      - uses: srt32/git-actions@v0.0.3
        with:
          args: git submodule update --init --recursive
      # 使用 node:14
      - name: use Node.js 14
        uses: actions/setup-node@v1
        with:
          node-version: 14

      # 设置缓存路径
      - name: Get yarn cache directory path
        id: yarn-cache-dir-path
        run: echo "::set-output name=dir::$(yarn cache dir)"

      # yarn缓存
      - name: Cache yarn cache
        uses: actions/cache@v2
        id: cache-yarn-cache
        with:
          path: ${{ steps.yarn-cache-dir-path.outputs.dir }}
          key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-

      # 缓存依赖文件
      - name: Cache node_modules
        id: cache-node-modules
        uses: actions/cache@v2
        with:
          path: node_modules
          key: ${{ runner.os }}-${{ matrix.node-version }}-nodemodules-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-${{ matrix.node-version }}-nodemodules-

       # 下载依赖
      - run: yarn
        if: |
          steps.cache-yarn-cache.outputs.cache-hit != 'true' ||
          steps.cache-node-modules.outputs.cache-hit != 'true'

      # 构建
      - name: Build
        run: |
          yarn build
        env:
          CI: true

      # 生成压缩包
      - run: tar -zcvf release.tgz .nuxt  nuxt.config.ts package.json  pm2.config.json postbuild.ts config tsconfig.json yarn.lock src/static tailwind.config.js

      # 上传文件
      - name: Upload
        uses: easingthemes/ssh-deploy@v2.0.7
        env:
          SSH_PRIVATE_KEY: ${{ secrets.ACCESS_TOKEN }}
          ARGS: '-avz --delete'
          SOURCE: 'release.tgz'
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.TARGET }}

      # 部署
      - name: Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.ACCESS_TOKEN }}
          # 远程服务器端口号
          port: ${{ secrets.PORT }}
          # 命令超时配置 默认10m
          command_timeout: 20m
          # 运行在远程服务器的命令
          # 1. 进入项目目录
          # 2. 下载发布包
          # 3. 解压缩发布包
          # 4. 安装生产环境依赖
          # 5. pm2运行配置文件
          script: |
            cd /www/wwwroot/web.90c.vip
            tar zxvf release.tgz
            yarn install --production
            pm2 reload pm2.config.json

      # 微信通知
      - name: Wechat Notification
        if: github.event_name == 'push' && github.ref == 'refs/heads/develop'
        uses: chf007/action-wechat-work@master
        env:
          WECHAT_WORK_BOT_WEBHOOK: ${{ secrets.DEV_WECHAT_WEBHOOK }}
        with:
          msgtype: markdown
          content: "<font color=\"info\">来画平台</font>更新了，快来试试看吧～。\n
          > \n
          ##### 修改内容：\n
          > <font color=\"info\">${{ github.event.head_commit.message }}</font> \n
          ##### 修改分支:\n
          > <font color=\"info\">${{ github.event.ref }}</font> \n
          ##### 修改时间:\n
          > <font color=\"info\">${{ github.event.head_commit.timestamp }}</font> \n
          ##### 修改人:\n
          > <font color=\"info\">${{ github.event.head_commit.committer.name }}</font> \n
          > <font color=\"info\">[查看详情](https://web.90c.vip)</font>\n"
          mentioned_list: "['@all']"
```

## 工作流文件说明

> `name`: Publish And Test  该workflow的名称，可以随意填写
  `on`: 通过什么方式来触发该工作流
  `push`  : 通过提交代码触发该流程
  `branches: [develop]`: 通过提交哪个分支的代码触发该流程
  `jobs`: 执行任务
  `build`：开始构建
  `runs-on`: ubuntu-latest  运行所需要的环境
  `steps` 工作流步骤节点
  `name`: 节点名称
  `uses`: 使用第三方插件
  `with`: 参数设置
  `env`:环境设置
  `run` 需要运行脚本的语句/文件

## 工作流步骤说明

1. 检出代码
2. 设置git环境
3. 设置node环境
4. 设置(yarn/npm)缓存
5. 缓存文件
6. 下载依赖
7. 构建打包
8. 生成压缩包
9. 上传文件到服务器
10. 项目部署
11. 部署成功通知(企业微信/钉钉/邮箱 等)

### 检出代码
  
[查看详情](https://github.com/actions/checkout)

### 设置git环境

[查看详情](https://github.com/srt32/git-actions)

### 设置node环境

[查看详情](https://github.com/actions/setup-node)

### 设置(yarn/npm)缓存

[查看详情](https://github.com/actions/cache)

### 缓存文件

[查看详情](https://dev.to/mpocock1/how-to-cache-nodemodules-in-github-actions-with-yarn-24eh)

### 下载依赖

yarn install / npm instll

### 构建打包

yarn build/npm run build

### 生成压缩包

运行脚本  - run: tar -zcvf release.tgz ...

### 上传文件到服务器

需要借助第三方插件easingthemes/ssh-deploy@v2.0.7去完成

```text
 SSH_PRIVATE_KEY: ${{ secrets.ACCESS_TOKEN }}
    ARGS: '-avz --delete'
    SOURCE: 'release.tgz'
    REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
    REMOTE_USER: ${{ secrets.REMOTE_USER }}
    TARGET: ${{ secrets.TARGET }}
```

- `SSH_PRIVATE_KEY`: 免密登陆服务器的秘钥 (.ssh/id_rsa)
- `ARGS`: 部署之前删除原有文件
- `SOURCE`：需要上传的打包文件
- `REMOTE_HOST`：服务器的主机ip地址（例如：236.23.56.36）
- `REMOTE_USER`： 服务器的用户名
- `TARGET`： 需要上传到服务器位置 （例如: /wwww/dist/web）

### 项目部署

需要借助第三方插件appleboy/ssh-action@master去完成

```text
    host: ${{ secrets.REMOTE_HOST }}
    username: ${{ secrets.REMOTE_USER }}
    key: ${{ secrets.ACCESS_TOKEN }}
    # 远程服务器端口号
    port: ${{ secrets.PORT }}
    # 命令超时配置 默认10m
    command_timeout: 20m
    # 运行在远程服务器的命令
    # 1. 进入项目目录
    # 2. 下载发布包
    # 3. 解压缩发布包
    # 4. 安装生产环境依赖
    # 5. pm2运行配置文件
    script: |
      cd /www/wwwroot/web.90c.vip
      tar zxvf release.tgz
      yarn install --production
      pm2 reload pm2.config.json
```

- `host`: 服务器的地址（例如：236.23.56.36）
- `username`: 服务器用户名
- `key`：免密登陆服务器的秘钥
- `port`：远程服务器端口号
- `command_timeout`： 命令超时配置 默认10m
- `script`： 需要执行的脚本语句

### 部署成功通知(企业微信/钉钉/邮箱 等)

[查看详情](https://github.com/chf007/action-wechat-work)
