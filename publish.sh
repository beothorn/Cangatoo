#!/bin/bash
git checkout gh-pages
git fetch
git pull
git merge origin
git merge master
git push
git checkout master
