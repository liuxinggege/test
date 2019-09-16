#! /bin/bash
#set -x
set -o errexit

dept="three"
echo "dept: $dept"

path=/data/test/admin/admin-client
tarname=dist.tar.gz
ip=192.168.1.9


# tar zvcf $tarname dist/$dept/
# echo "remove remote sources..."
# ssh root@$ip "cd $path && rm -rf *"
# echo "scp to remote..."
# scp $tarname root@$ip:$path/$tarname
# echo "remove local tar"
# rm -f $tarname
# ssh root@$ip "cd $path && tar zxf $tarname && cp -R dist/* . && rm -rf dist && rm -f $tarname"
# echo "update finish..."

echo "path:$path"
npm run build:sit:$dept

echo ">remove old dist."
ssh root@$ip "rm -rf $path"
echo ">copy to dist."
scp -r ./dist/$dept "root@$ip:$path"
ssh root@$ip "chown -R nobody.nogroup $path"
echo ">build for $dept finish."