@if ""%1""=="""" @echo You should set tomcat distributation dir. like D:\apache-tomcat-7.0.69\webapps\kqserver
@if ""%1""=="""" goto end

@set DIST_DIR=%1
@call npm install
@call npm run build
@rd /S /Q %DIST_DIR%\static
@xcopy /E /I /R /Y .\dist\*.* %DIST_DIR%\

:end