#!/bin/bash
echo "Analysis source code for periods by checkout new branch"
echo "You need: (1) sonar-project.properties file and sonarqube"
echo "          (2) hoc library https://rubygems.org/gems/hoc"
# Step 1: Detect date of first commit and last commit => age of code
# Step 2: Split age of code to periods
# Step 3: Analysis metrics for each period by checkout to new branch from last commit of each period.
#        - churn (lines of added, deleted code)
#        - loc by xargs wc -l  method
#        - hoc used to hoc library https://rubygems.org/gems/hoc
#        - sonar-scanner
# Step 4: Output file in csv with date, hoc, loc, added, deleted and sonarqube server.
# 
echo "Sonar-scanner is heavy work that takes time."
echo "Do you want to ignore sonar-scanner? (y) (n)"
read ignoreSonar

pwd=$(pwd)
if [ ! -z "$1" ]
then
    cd $1
fi
sonarScanner='sonar-scanner'
if [ ! -z "$2" ]
then
    sonarScanner=$2
fi
output_file="out.csv"
mainline=$(git branch | grep \* | cut -d ' ' -f2)
period="14d" #7d 1m
# First commit
# git log --reverse --pretty=format:"%H %ad" --date=short | awk '{print $1, $2; exit}'
firstDate=$(git log --reverse --pretty=format:"%ad" --date=short | head -1)
# Last commit
# git log --pretty=format:"%H %ad" --date=short | awk '{print $1, $2; exit}'
lastDate=$(git log --pretty=format:"%ad" --date=short | head -1)
d=$firstDate
echo "date, hoc, lsloc, added, deleted" > $output_file
while [[ "$lastDate" > "$d" ]]; do 
  # Last date of each period
  d=$(date -j -f %Y-%m-%d -v+$period $d +%Y-%m-%d)
  # Detect revision of last commit in each period
  revision=$(git log --before=$d --pretty=format:"%H" | head -1)
  # Checkout new branch
  git checkout -b $d $revision
  # Calculate code churn
  churn=$(git log --format=tformat: --numstat | awk '{added += $1} {deleted += $2} END {print added, deleted}')
  added=$(cut -d' ' -f1 <<< $churn)
  deleted=$(cut -d' ' -f2 <<< $churn)
  # Calculate loc
  # cloc=$(cloc $(git ls-files) | tail -2 | awk '{print $5; exit}')
  lsloc=$(git ls-files | xargs wc -l | awk 'END{print $1}')
  # sumloc=$(git summary --line | awk 'FNR == 3 {print $3; exit}')
  # Calculate hoc
  hoc=$(hoc)
  # Write to csv file
  echo "$d, $hoc, $lsloc, $added, $deleted " >> $output_file
  # run sonar-scaner for each period
  if [ "$ignoreSonar" != "y" ]
  then
    ($sonarScanner)
  fi
  # Save modify if have, checkout mainline and delete branch
  git stash save
  git checkout $mainline
  git branch -d $d
done
echo "Read $pwd/$output_file in detail"
cp $output_file "$pwd/"
cd $pwd