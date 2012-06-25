#!/bin/bash
git checkout gh-pages
git fetch
git merge origin/gh-pages
git merge master
git push
git checkout master
