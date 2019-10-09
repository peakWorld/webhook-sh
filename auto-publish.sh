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
        git pull origin master && npm i && npm run pm2
    fi
# 任何分支都会自动构建
else
    if [[ $branchName != $currBranchName ]] ; then 
        git checkout remotes/origin/$branchName
    fi
    git pull origin $branchName && npm i && npm run pm2
fi
