#!/usr/bin/env sh

set -e

npm run build

cd dist

git init
git add -A
git commit -m "New Deployment"
git push -f https://github.com/purplesmurf1998/autotracks-vuetify-frontend.git main:gh-pages

cd -