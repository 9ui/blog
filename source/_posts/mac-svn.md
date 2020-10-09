---
title: mac终端下svn常用命令
date: 2019-05-13 21:54:43
tags:
  - 工具
author: 左智文
img: https://img.90c.vip/other-cover/1322170_cdc9_3.jpg?x-oss-process=image/format,webp
summary: 本章节，简单的介绍了mac终端下svn常用命名，方便查询使用。
categories: 项目管理
---

#### 1、将文件checkout到本地目录

```text
1 svn checkout path（path是服务器上的目录）
2 例如：svn checkout svn://192.168.1.1/pro/domain
3 简写：svn co
```

#### 2、往版本库中添加新的文件

```text
1 svn add file
2 例如：svn add test.php(添加test.php)
3 svn add *.php(添加当前目录下所有的php文件)
```

#### 3、将改动的文件提交到版本库

```text
1 svn commit -m “LogMessage“ [-N] [--no-unlock] PATH　　　　　　　　(如果选择了保持锁，就使用–no-unlock开关)
2 例如：svn commit -m “add test file for my test“ test.php
3 简写：svn ci
```

#### 4、加锁/解锁

```text
1 svn lock -m “LockMessage“ [--force] PATH
2 例如：svn lock -m “lock test file“ test.php
3 svn unlock PATH
```

##### 5、更新到某个版本

```text
1 svn update -r m path
2 例如：
3 svn update如果后面没有目录，默认将当前目录以及子目录下的所有文件都更新到最新版本。
4 svn update -r 200 test.php(将版本库中的文件test.php还原到版本200)
5 svn update test.php(更新，于版本库同步。如果在提交的时候提示过期的话，是因为冲突，需要先update，修改文件，然后清除svn resolved，最后再提交commit)
6 简写：svn up
```

#### 6、查看文件或者目录状态

```text
1 1）svn status path（目录下的文件和子目录的状态，正常状态不显示）
2 【?：不在svn的控制中；M：内容被修改；C：发生冲突；A：预定加入到版本库；K：被锁定】
3 2）svn status -v path(显示文件和子目录状态)
4 第一列保持相同，第二列显示工作版本号，第三和第四列显示最后一次修改的版本号和修改人。
5 注：svn status、svn diff和 svn revert这三条命令在没有网络的情况下也可以执行的，原因是svn在本地的.svn中保留了本地版本的原始拷贝。
6 简写：svn st
```

#### 7、删除文件

```text
1 svn delete path -m “delete test fle“
2 例如：svn delete svn://192.168.1.1/pro/domain/test.php -m “delete test file”
3 或者直接svn delete test.php 然后再svn ci -m ‘delete test file‘，推荐使用这种
4 简写：svn (del, remove, rm)
```

#### 8、查看日志

```text
1 svn log path
2 例如：svn log test.php 显示这个文件的所有修改记录，及其版本号的变化
```

#### 9、查看文件详细信息

```text
1 svn info path
2 例如：svn info test.php
```

#### 10、比较差异

```text
1 svn diff path(将修改的文件与基础版本比较)
2 例如：svn diff test.php
3 svn diff -r m:n path(对版本m和版本n比较差异)
4 例如：svn diff -r 200:201 test.php
5 简写：svn di
```

#### 11、将两个版本之间的差异合并到当前文件

```text
1 svn merge -r m:n path
2 例如：svn merge -r 200:205 test.php（将版本200与205之间的差异合并到当前文件，但是一般都会产生冲突，需要处理一下）
```

#### 12、SVN 帮助

```text
1 svn help
2 svn help ci
```

#### 13、版本库下的文件和目录列表

```text
1 svn list path
2 显示path目录下的所有属于版本库的文件和目录
3 简写：svn ls
```

#### 14、创建纳入版本控制下的新目录

```text
1 svn mkdir: 创建纳入版本控制下的新目录。
2 用法: 1、mkdir PATH…
3 2、mkdir URL…
4 创建版本控制的目录。
5 1、每一个以工作副本 PATH 指定的目录，都会创建在本地端，并且加入新增
6 调度，以待下一次的提交。
7 2、每个以URL指定的目录，都会透过立即提交于仓库中创建。
8 在这两个情况下，所有的中间目录都必须事先存在
```

#### 15、恢复本地修改

```text
1 svn revert: 恢复原始未改变的工作副本文件 (恢复大部份的本地修改)。revert:
2 用法: revert PATH…
3 注意: 本子命令不会存取网络，并且会解除冲突的状况。但是它不会恢复
4 被删除的目录
```

#### 16、代码库URL变更

```text
 1 svn switch (sw): 更新工作副本至不同的URL。
 2 用法: 1、switch URL [PATH]
 3 2、switch –relocate FROM TO [PATH...]
 5 1、更新你的工作副本，映射到一个新的URL，其行为跟“svn update”很像，也会将
 6 服务器上文件与本地文件合并。这是将工作副本对应到同一仓库中某个分支或者标记的
 7 方法。
 8 2、改写工作副本的URL元数据，以反映单纯的URL上的改变。当仓库的根URL变动
 9 (比如方案名或是主机名称变动)，但是工作副本仍旧对映到同一仓库的同一目录时使用
10 这个命令更新工作副本与仓库的对应关系。
```

#### 17、解决冲突

```text
1 svn resolved: 移除工作副本的目录或文件的“冲突”状态。
2 用法: resolved PATH…
3 注意: 本子命令不会依语法来解决冲突或是移除冲突标记；它只是移除冲突的
4 相关文件，然后让 PATH 可以再次提交。
```

## 最后

我希望你发现这篇文章有用！你可以关注我的博客。请在下面的评论中留下任何问题。我很乐意帮忙！