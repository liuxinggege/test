set HOST=192.168.0.125
set HOST2=192.168.0.126
set PWD=123456
plink -pw %PWD% root@%HOST% "rm -fr /opt/apache-tomcat-7.0.69/webapps/coalmine/static /opt/apache-tomcat-7.0.69/webapps/coalmine/index.html"
pscp -pw  %PWD% -r dist\*.* root@%HOST%:/opt/apache-tomcat-7.0.69/webapps/coalmine/

plink -pw %PWD% root@%HOST2% "rm -fr /opt/apache-tomcat-7.0.69/webapps/coalmine/static /opt/apache-tomcat-7.0.69/webapps/coalmine/index.html"
pscp -pw  %PWD% -r dist\*.* root@%HOST2%:/opt/apache-tomcat-7.0.69/webapps/coalmine/
