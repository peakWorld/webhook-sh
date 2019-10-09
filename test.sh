#!/bin/bash

projectAddress="/Users/bjhl/webhookTest/blog-back"

echo ${projectAddress%/*}

echo ${projectAddress:0:7}

function git.branch() {
  br=`git branch | grep "*"`
  echo ${br/* /}
}

aa=$(git.branch)

echo $aa

echo ${projectAddress:0-7}