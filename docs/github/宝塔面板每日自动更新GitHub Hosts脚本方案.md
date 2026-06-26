# 宝塔面板每日自动更新GitHub Hosts脚本方案

# 宝塔面板每日自动更新 GitHub Hosts 脚本方案

## 一、原理说明

GitHub 访问慢、打不开是 DNS 污染导致，通过定时拉取最新纯净 Hosts 写入服务器`/etc/hosts`，宝塔计划任务每日自动执行，永久生效。

## 二、一键更新脚本（保存为`update_github_host.sh`）

```bash
#!/bin/bash
# 自动更新GitHub Hosts脚本
HOSTS_FILE="/etc/hosts"
TMP_HOST=$(mktemp)

# 1. 拉取最新Github Hosts（稳定镜像源）
curl -s https://hosts.gitcdn.top/hosts.txt > $TMP_HOST

# 2. 清理旧的github相关host记录
sed -i '/github/d' $HOSTS_FILE
sed -i '/githubusercontent/d' $HOSTS_FILE
sed -i '/gitlab/d' $HOSTS_FILE

# 3. 追加新hosts到系统host文件
cat $TMP_HOST >> $HOSTS_FILE

# 4. 刷新DNS缓存
systemctl restart nscd 2>/dev/null || systemd-resolve --flush-caches 2>/dev/null
/etc/init.d/dns-clean restart 2>/dev/null

# 5. 删除临时文件
rm -f $TMP_HOST

echo "[$(date '+%Y-%m-%d %H:%M:%S')] GitHub Hosts 更新完成"
```

## 三、宝塔部署步骤

### 1\. 上传脚本到服务器

1. 宝塔 → 文件管理 → `/root` 目录

2. 新建文件：`update_github_host.sh`，粘贴上面代码并保存

### 2\. 添加执行权限

宝塔终端执行：

```bash
chmod +x /root/update_github_host.sh
```

### 3\. 宝塔计划任务每日自动运行

1. 左侧菜单：**计划任务**

2. 任务类型：`Shell脚本`

3. 执行周期：每天 03:00（凌晨低负载）

4. 脚本内容填写：

```bash
/root/update_github_host.sh >> /root/github_host_log.txt
```

5. 保存，点击**执行一次**测试

### 4\. 查看更新日志

```bash
cat /root/github_host_log.txt
```

## 四、备选高速 Hosts 源（脚本失效时替换）

如果`hosts.gitcdn.top`访问失败，替换 curl 地址为下面任意一条：

```Plain Text
https://raw.hellogithub.com/hosts
https://cdn.jsdelivr.net/gh/521xueweihan/GitHub520/hosts
https://mirror.ghproxy.com/https://raw.githubusercontent.com/521xueweihan/GitHub520/main/hosts
```

修改脚本内这一行即可：

```bash
curl -s 替换这里的地址 > $TMP_HOST
```

## 五、常见问题

1. **curl 未安装**

```bash
yum install curl -y # CentOS
apt install curl -y # Debian/Ubuntu
```

2. **执行无效果**
手动执行脚本查看报错：`bash /root/update_github_host.sh`

3. **重启服务器 hosts 失效**
部分云服务商（阿里云 / 腾讯云）会开机重置 hosts，解决方案：
计划任务增加**开机执行**任务，同样运行该脚本。

## 六、精简版（直接复制到宝塔计划任务，无需上传文件）

不想创建 sh 文件，直接在计划任务 Shell 框填入完整代码：

```bash
#!/bin/bash
HF="/etc/hosts"
TMP=$(mktemp)
curl -s https://hosts.gitcdn.top/hosts.txt > $TMP
sed -i '/github/d;/githubusercontent/d' $HF
cat $TMP >> $HF
rm -rf $TMP
systemd-resolve --flush-caches 2>/dev/null
echo "更新完成 $(date)"
```

> （注：部分内容可能由 AI 生成）
