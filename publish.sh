#!/bin/bash
git checkout gh-pages
git pull
git merge master
git push
git checkout master
