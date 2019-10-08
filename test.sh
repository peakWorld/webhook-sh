#!/bin/bash

projectAddress="/Users/bjhl/webhookTest/blog-back"

echo ${projectAddress%/*}

echo ${projectAddress:0:7}

function gitBranch() {
  br=`git branch | grep "*"`
  echo ${br/* /}
}

gitBranch

echo $aa

echo ${projectAddress:0-7}