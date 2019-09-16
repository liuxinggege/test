#!/bin/bash
set -x
set -u
set -o errexit

echo ">update sit start."
tarname=lottery-xg-client.tar.gz

rm -rf node_modules
rm -rf lottery-xg-client
rm -f $tarname
yarn
yarn build
mv build  lottery-xg-client
tar zvcf $tarname   ./lottery-xg-client 




sit_server=121.201.122.16
sit_server_port=22335
sit_dist=/export/web

#拷贝至测试服
echo ">copy to sit..."
scp -P$sit_server_port $tarname export@$sit_server:$sit_dist
#删除本地
echo ">remove local tar..."
rm -f $tarname
#测试服解压并重启
echo ">tar zxf $tarname..."
ssh -p$sit_server_port export@$sit_server "cd $sit_dist && rm -rf lottery-xg-client && tar zxf $tarname && rm -f $tarname"
echo ">upload finish..."
