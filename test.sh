#!/bin/bash

a='test'

function existBranch() {
    br=`git branch | grep $1`
    echo $br
}

bb=$(existBranch $a)

echo $bb