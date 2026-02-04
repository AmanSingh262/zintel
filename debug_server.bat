@echo off
echo Debugging Zintel Server... > debug_status.txt
echo Checking Node Version... >> debug_status.txt
node -v > node_version_bat.txt 2>&1
echo Checking NPM Version... >> debug_status.txt
npm -v >> node_version_bat.txt 2>&1
echo Running Build... >> debug_status.txt
npm run build > build_log_bat.txt 2>&1
echo Build attempt finished. >> debug_status.txt
