# Git 一键同时推送 GitHub \+ GitCode 双远程仓库完整方案

# Git 一键同时推送 GitHub \+ GitCode 双远程仓库完整方案

## 方案一：配置两个 remote（推荐，一次 `git push` 同步两边）

### 1\. 查看现有远程仓库

```bash
git remote -v
```

默认一般只有 `origin` 指向 GitHub。

### 2\. 新增 GitCode 远程仓库（两种方式任选）

#### 方式 A：给 GitCode 单独起别名 `gitcode`

```bash
# 添加GitCode远程地址
git remote add gitcode https://gitcode.com/你的用户名/仓库名.git

# 查看确认双远程
git remote -v
```

此时会看到：

```Plain Text
origin    https://github.com/xxx/xxx.git (fetch)
origin    https://github.com/xxx/xxx.git (push)
gitcode   https://gitcode.com/xxx/xxx.git (fetch)
gitcode   https://gitcode.com/xxx/xxx.git (push)
```

推送命令：

```bash
# 推GitHub
git push origin main
# 推GitCode
git push gitcode main
```

#### 方式 B：origin 绑定多个推送地址（一条 push 同时推两边，最省事）

1. 先确认 origin 已绑定 GitHub

```bash
git remote set-url origin https://github.com/你的用户名/仓库名.git
```

2. **追加第二个 push 地址（fetch 只用 GitHub，push 同时发两个平台）**

```bash
git remote set-url --add origin https://gitcode.com/你的用户名/仓库名.git
```

3. 校验配置

```bash
git remote -v
```

输出示例：

```Plain Text
origin  https://github.com/xxx/xxx.git (fetch)
origin  https://github.com/xxx/xxx.git (push)
origin  https://gitcode.com/xxx/xxx.git (push)
```

> 关键点：fetch 只有 1 个，push 有 2 个，拉代码默认从 GitHub 拉，推送自动同步两个仓库。
> 
> 

4. 一键推送

```bash
git push origin main
```

执行一次，代码同时提交到 GitHub 和 GitCode。

## 方案二：SSH 地址配置（免密码频繁输入账号密码）

如果配置了 SSH 密钥，把 HTTPS 链接换成 SSH 格式：

```bash
# GitHub SSH
git@github.com:用户名/仓库名.git
# GitCode SSH
git@gitcode.com:用户名/仓库名.git
```

追加多推送地址：

```bash
git remote set-url --add origin git@gitcode.com:用户名/仓库名.git
```

## 常用维护命令

### 删除多余推送地址

```bash
git remote set-url --delete origin 要删掉的仓库地址
```

### 单独只推其中一个平台

```bash
# 仅GitHub
git push origin https://github.com/xxx/xxx.git main
# 仅GitCode
git push origin https://gitcode.com/xxx/xxx.git main
```

### 克隆已有双远程仓库

别人配置好双远程的项目，你正常克隆即可，push 时自动同步双平台，无需额外配置。

## 常见问题

1. **GitCode 推送报权限 403**

    - HTTPS 方式：在 GitCode 个人设置里生成个人访问令牌（Token），密码处填写 Token；

    - SSH 方式：把本机公钥添加到 GitCode 账户 SSH 密钥列表。

2. 分支名不是 main（旧仓库 master）
把命令里的 `main` 全局替换成 `master` 即可。

3. 推送时两个仓库先后报错
只会推送成功的仓库保留提交，失败的不会影响另一个，修正权限后重新 push 即可同步。

## 补充：全局一键批量推送脚本（Windows/Linux/macOS）

### Linux/macOS 新建 `push-all.sh`

```bash
#!/bin/bash
BRANCH=${1:-main}
git push origin $BRANCH
git push gitcode $BRANCH
echo "✅ 双仓库推送完成"
```

授权 \+ 执行：

```bash
chmod +x push-all.sh
./push-all.sh
```

### Windows bat 脚本 `push-all.bat`

```bat
@echo off
set branch=%1
if "%branch%"=="" set branch=main
git push origin %branch%
git push gitcode %branch%
echo 双仓库推送完毕
pause
```

双击运行即可一键同步。

> （注：文档部分内容可能由 AI 生成）
