#!/bin/bash

projectAddress=$1
projectParentAdress=${projectAddress%/*}
githubSsh=$2
branchName=$3

# 判断是否为首次提交代码
if [[ ! -d $projectAddress ]] ; then
    cd $projectParentAdress
    git clone $githubSsh
fi

cd $projectAddress

# 如果是master分支
if [[ branchName == 'master' ]] ; then
    
else # 如果是其他分支

fi
