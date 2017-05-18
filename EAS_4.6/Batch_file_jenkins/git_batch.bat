@echo off
setlocal
set STARTTIME=%TIME%

if not exist "C:\perf_project_git" md "C:\perf_project_git"

if exist "C:\perf_project_git" rd /S /Q "C:\perf_project_git"

md "C:\perf_project_git"

cd C:\Program Files\Git\bin
git clone https://github.com/aankhi25/4.6_perf.git "C:\perf_project_git"
