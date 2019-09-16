#! /bin/bash

set -e
set -u
#set -x



res_static=
remote_dist=
res_static=./public/static/res
remote_dist=/home/server/wind/public/third/domain_guard
res=res

seedfile=./config/staticPathSeed.json
#大图片
bigsize=100k
tarname=domain_guard.tar.gz
check_bigimg() {
    big=$(find ${res_static}  -type f -size +${bigsize} -exec file {} \; | awk -F: '{if ($2 ~/image/) print $1}')
    for f in ${big}; do
        du -h $f
    done
}

bigimg=$(check_bigimg)
if [ "${bigimg}" != "" ]; then
    echo -e "$bigimg"|sort -k 1
    echo "有大图片是否继续?(1\2)"
    select yn in "Yes" "No"; do
        case $yn in
            Yes ) break;;
            No ) echo "exit..."; exit;;
        esac
    done
fi


echo ">tsc..."
rm -rf bin
tsc

#动态调整seed?
fresh_seed() {
    new_seed=`date +%s`
    echo '{"seed": 1}'| jq ".seed=\"${new_seed}\"" > $seedfile
}

#暂不动态调整seed
# fresh_seed
seed=$(cat $seedfile|jq .seed)
baseUrlMixLen=6

short_md5() {
    md5_=`echo -n $1${seed}|md5`
    echo ${md5_:0:${baseUrlMixLen}} #注意调整router.ts
}

static=./public/static
static_tmp=./public/.static_tmp
#备份static
echo ">copy static..."
rm -rf ${static_tmp}
cp -R ${static} ${static_tmp}
#修改static里面的路径
echo ">mod url name..."

pids=("A" "B" "C" "D" "E" "F" "G")
md5_res=`short_md5 ${res}`
mv ${static}/${res} ${static}/${md5_res}
for(( j=0;j<${#pids[@]};j++)) do
    pid=${pids[j]}
    pid_dir=${static}/${md5_res}/${pid}
    if [ ! -d "${pid_dir}" ]; then
        continue;
    fi
    md5_pid=`short_md5 ${pid}`
    mv ${static}/${md5_res}/${pid} ${static}/${md5_res}/${md5_pid}
done;

#打包
tar zcf $tarname  --exclude="./config/config.json" \
./bin/ ./config/ ./node_modules/ \
./public/views/${res} ./public/views/common ./public/views/redirect.ejs \
${static}/${md5_res} ${static}/clipboard.min.js ${static}/jquery.js ${static}/simJQ.js ${static}/stats.js ${static}/qrcode.min.js \
${static}/html/

#回滚static目录
echo ">rollback static..."
rm -rf ${static}
mv ${static_tmp} ${static}
echo ">scp.."
remote=192.168.1.9
dist=${remote_dist}
ssh root@${remote} "cd $dist && rm -rf *"
scp $tarname root@${remote}:${dist}
rm $tarname
ssh root@${remote} "cd $dist && tar zxf $tarname && rm -f $tarname && chown -R nobody.nogroup $dist"
echo ">${res} build finish..."
