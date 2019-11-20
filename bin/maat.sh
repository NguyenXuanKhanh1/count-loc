#!/bin/bash
if [ -z "$1" ]
then
    echo 'Wrong argument!'
    echo 'You need to provide an argument as a path to the source code.' 
    echo 'Please following instruction below:'
    echo './maat.sh path_to_source_code'
    exit
fi

pwd=$(pwd)
cp code-maat-1.0-standalone.jar $1

maat_analysis='maat_churn.csv'
output_file=$2
if [ -z "$2" ]
then
    output_file='output.csv'
fi

cd $1
# git summary --line > git_line.log
# while IFS=' ' read -r f1 f2 f3
# do 
#   echo "$f1, $f2, $f3" 
# done < git_line.log
# cp git_line.log "$pwd/"
# exit 

echo "Step 1: git log ..."
git log --all --numstat --date=short --pretty=format:'--%h--%ad--%aN' --no-renames $3> git.log

echo "Step 2: maat analysis ..."
java -jar code-maat-1.0-standalone.jar -c git2 -l git.log  -a abs-churn > $maat_analysis

echo "Step 3: hoc calculate ..."
loc=0
commits=0;
hoc_base=0

if [ ! -z "$3" ]
then
  hoc_base=$(hoc --before $3)
fi

while IFS=',' read -r f1 f2 f3 f4
do 
  if [ $f1 == 'date' ]
  then
    echo "$f1, hoc, loc, $f2, $f3, $f4" > $output_file
    echo "----- write to csv file (header: $f1, hoc, loc, $f2, $f3, $f4) ..."
  else
    ((hoc+=f2+f3))
    ((loc+=f2-f3))
    echo "$f1, $hoc, $loc, $f2, $f3, $f4" >> $output_file
    ((commits+=$f4))
  fi
done < "$maat_analysis"

echo "Step 4: copy output file ..."
cp $output_file "$pwd/"
cp git.log "$pwd/"
rm git.log
rm $maat_analysis
cd $pwd
echo "hoc: $hoc, loc: $loc, commits: $commits"