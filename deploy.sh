#!/bin/bash

SOURCE_BRANCH="angular"
TARGET_BRANCH="gh-pages"

# Pull requests and commits to other branches shouldn't try to deploy.
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; The request or commit is not on master"
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Deceyption of the deploy_key.enc
openssl aes-256-cbc -k "$super_secret_password" -in deploy.enc -out deploy_key -d


chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key

# Cloning the repository to repo/ directory,
# Creating gh-pages branch if it doesn't exists else moving to that branch
git clone $REPO repo
cd repo
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cd ..

# Setting up the username and email.
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# Cleaning up the old repo's gh-pages branch except CNAME file and 404.html
find repo/* ! -name "CNAME" ! -name "404.html" -maxdepth 1  -exec rm -rf {} \; 2> /dev/null
cd repo

git add --all
git commit -m "Travis CI Clean Deploy : ${SHA}"

git checkout $SOURCE_BRANCH

# Actual building and setup of current push or PR.
npm install
ng build
git checkout $TARGET_BRANCH
mv dist/* .

# Staging the new build for commit; and then commiting the lastest build
git add .
git commit --amend --no-edit --allow-empty

# Actual push to gh-pages branch via Travis
git push --force $SSH_REPO $TARGET_BRANCH
