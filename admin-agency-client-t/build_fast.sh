#! /bin/bash
#set -x
set -u
set -o errexit


if [ $# -ne 1 ] || ([ $1 != "prod" ]); then
   echo "usage: ./build.sh sit|prod"
   exit
fi
env=$1
echo ">remove local dist"
rm -rf ./dist

dept=three

dist=(
    "/home/server/wind/public/third/admin/Atest/agent"
    "/home/server/wind/public/third/admin/Btest/agent"
    )
pidList=(A B)
ip=192.168.1.9


function pack_one() {
    local i=$1 
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


    echo ">${env} dist:${dist[i]}"
    echo ">remove old  dist."
    ssh root@$ip "rm -rf ${dist[i]}"
    echo ">copy to dist."
    scp -r $local_dist "root@$ip:${dist[i]}"
    ssh root@$ip "chown -R nobody.nogroup ${dist[i]}"
    echo ">build ${pidList[i]} for $1 finish."
}


START=$(date +%s)
lens=${#pidList[*]}
for (( i = 0; i < $lens; i = i + 1 ))
do
   pack_one $i &
done

wait
END=$(date +%s)
DIFF=$(( $END - $START ))
echo ">build finish $1  cost:${DIFF}s"