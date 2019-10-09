#!/bin/bash

projectAddress=$1
projectParentAdress=${projectAddress%/*}
githubSsh=$2
branchName=$3
onlyMaster=$4

# 获取当前分支名字
function git.branch() {
  br=`git branch | grep "*"`
  echo ${br/* /}
}

# 校验本地是否存在该分支
function checkBranch() {
    br=`git branch | grep $1`
    echo $br
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
        git fetch origin master && npm i && npm run pm2
    fi
# 任何分支都会自动构建
else
    if [[ $branchName != $currBranchName ]] ; then
        existBranch=$(checkBranch $branchName)
        # 本地不存在branchName分支, 则创建该分支
        if [[ "" == existBranch ]] ; then
            git checkout -b $branchName
        else
        # 本地存在该分支, 则直接切换分支
            git checkout $branchName
        fi
    fi
    git fetch origin $branchName && npm i && npm run pm2
fi


## 1. 对package.json进行比较; 分情况来npm i 
## 2. 对任何分支都会进行自动构建的项目, 通过 commitId来拉取最新的代码 和 切换 分支