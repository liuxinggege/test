#! /bin/bash
#set -x
set -u
set -o errexit

if [ $# -ne 1 ] || ([ $1 != "prod" ]); then
    echo "usage: ./build.sh sit|prod"
    exit
fi
env=$1

dept=three
echo "dept: $dept"

echo ">building for $1."

echo ">building start."
npm run build:$env:$dept

dist="/home/server/wind/public/third/admin/admin"
ip=192.168.1.9

echo ">${env} dist:${dist}"
echo ">remove old dist."
ssh root@$ip "rm -rf $dist"
echo ">copy to dist."
scp -r ./dist/$dept "root@$ip:$dist"
ssh root@$ip "chown -R nobody.nogroup $dist"
echo ">build for $1 finish."
