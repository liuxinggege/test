#! /bin/bash
set -u
set -o errexit
env=sit

echo ">remove local dist"
rm -rf ./dist

dept=three
dist=/var/www/admin-agent-test
pidList=(A B C D E F)
ip=121.201.122.17

function pack_one() {
    local i=$i
    npm run build:$env:$dept:${pidList[i]}

    local local_dist=./dist/$dept/${pidList[i]}
    branch_name=`git symbolic-ref --short -q HEAD`
    revision=`git rev-parse --short HEAD`
    gitusername=`git config user.name`
    date=`date +%c`
    local version_name=$local_dist/$dept:${pidList[i]}:$env
    echo user:$gitusername > $version_name
    echo branch:$branch_name >> $version_name
    echo revision:$revision >> $version_name
    echo Date:$date >> $version_name
    echo ">build ${pidList[i]} for sit finish."
}


START=$(date +%s)
lens=${#pidList[*]}
for (( i = 0; i < $lens; i = i + 1 ))
do
   pack_one $i &
done

wait
echo ">${env} dist:${dist}"
echo ">remove old  dist."
tarname=dist.tar.gz
# 删除远端
# ssh root@$ip "rm -rf ${dist}"
ssh root@$ip "cd $dist && rm -rf *"
echo ">copy to dist."
# 压缩
cd dist/ 
tar zvcf $tarname $dept
cd ..
# tar zvcf $tarname dist/$dept
# 上传
echo "scp to remote..."
# scp -r $tarname "root@$ip:${dist}"
scp dist/$tarname root@$ip:$dist/$tarname
# 删除本地
rm -f dist/$tarname
# 解压
ssh root@$ip "cd $dist && tar zxf $tarname && cp -R $dept/* . && rm -rf $dept && rm -f $tarname"
# ？？？
ssh root@$ip "chown -R nobody.nogroup ${dist}"
END=$(date +%s)
DIFF=$(( $END - $START ))
echo ">build finish sit one cost:${DIFF}s"
