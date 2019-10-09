#!/bin/bash

projectAddress=$1
projectParentAdress=${projectAddress%/*}
githubSsh=$2
branchName=$3
onlyMaster=$4

function git.branch() {
  br=`git branch | grep "*"`
  echo ${br/* /}
}

currBranchName=$(git.branch)

# 判断是否为首次提交代码
if [[ ! -d $projectAddress ]] ; then
    cd $projectParentAdress
    git clone $githubSsh
fi

cd $projectAddress

# 只有master分支才会自动构建
if [[ $onlyMaster == true ]] ; then
    if [[ $branchName == 'master' && $currBranchName == 'master' ]] ; then
        git pull origin master && npm run pm2
    fi
else

fi
