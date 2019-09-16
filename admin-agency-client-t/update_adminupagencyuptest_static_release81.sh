# 新版本——test
#! /bin/bash
#set -x
set -u
set -o errexit

env=sit
echo ">remove local dist"
rm -rf ./dist

dept=three

dist="/var/www/admin-agency-test/agency"
pidList=(A)
ip=121.201.122.17

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
    echo ">build ${pidList[i]} for $1 finish."
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
echo ">build finish  cost:${DIFF}s"






# 老版本
# #! /bin/bash
# set -u
# set -o errexit

# if [ $# -ne 1 ] || ([ $1 != "one" ] && [ $1 != "two" ]); then
#     echo "usage: dept one|two"
#     exit
# fi
# dept=$1
# echo "dept: $dept"
# path=()
# tarname=()
# pidList=()
# ip=183.61.126.200
# if [ "$dept" == "one" ];then
#     path=(/var/www/admin-agency-test /var/www/admin-agency-kx /var/www/html_xg/agent /var/www/admin-agency-hy)
#     tarname=(dist.tar.gz dist2.tar.gz dist3.tar.gz dist4.tar.gz)
#     pidList=(A B C D)
#     ip=183.61.126.200
# fi
# if [ "$dept" == "two" ];then
#     path=(/var/www/admin-agency-test )
#     tarname=(dist.tar.gz )
#     pidList=(A )
#     ip=45.118.251.13
# fi
# echo "path:$path"
# echo "ip:$ip"
# lens=${#pidList[*]}
# for (( i = 0; i < $lens; i = i + 1 ))
# do
#     if [ $i -eq 0 ];then
#         echo ">change  temp to ${pidList[i]}."
#         sed  -i -e "s/\"temp\"/\"${pidList[i]}\"/g" "config/sit.env.js"  
#     else
#         echo ">change  ${pidList[i-1]} to ${pidList[i]}."
#         sed  -i -e "s/\"${pidList[i-1]}\"/\"${pidList[i]}\"/g" "config/sit.env.js" 
#     fi  
#     npm run build:sit:$dept:${pidList[i]}
#     tar zvcf ${tarname[i]} dist/
# done
# echo ">change  ${pidList[lens-1]} to temp."
# sed  -i -e "s/\"${pidList[lens-1]}\"/\"temp\"/g" "config/sit.env.js" 
# rm -f config/sit.env.js-e

# echo "build finish..."

# for (( i = 0; i < $lens; i = i + 1 ))
# do
#     ssh root@$ip "cd ${path[i]} && rm -rf *"
#     echo "scp to remote..."
#     scp ${tarname[i]} root@$ip:${path[i]}/${tarname[i]}
#     echo "remove local tar"
#     rm -f ${tarname[i]}
#     ssh root@$ip "cd ${path[i]} && tar zxf ${tarname[i]} && cp -R dist/* . && rm -rf dist && rm -f ${tarname[i]}"
# done
# echo "finised..."