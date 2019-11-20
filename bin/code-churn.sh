#!/bin/bash
# Analysis code churn use git log command
if [ -z "$1" ]
then
    echo 'Wrong argument!'
    echo 'You need to provide an argument as a path to the source code.' 
    echo 'Please following instruction below:'
    echo './code-churn.sh . output.csv'
    exit
fi
pwd=$(pwd)
if [ ! -z "$1" ]
then
    cd $1
fi
output_file="output.csv"
if [ ! -z "$2" ]
then
    output_file=$2
fi
echo "date,hoc,loc,added,deleted,commits" > $output_file
git log --reverse --numstat --pretty=format:"%ad" --date=short --ignore-all-space --ignore-space-change --ignore-space-at-eol | awk '
{
  if ($1 != "" && $2 == "") {
    if (date != "" && date!=$1) {
      print date","hoc","loc","added","deleted","commits;
      added=0;
      deleted=0;
      commits=0;
    }
    date=$1;
    commits+=1;
  }
  else {
    added += $1;
    deleted += $2;
    hoc+=$1+$2
    loc+=$1-$2
  }
}
END {
  print date","hoc","loc","added","deleted","commits;
}' >> $output_file
last=$(tail -n 1 $output_file)
echo "Age: $(head -2 $output_file | awk 'NR>1' | cut -d',' -f1) ~ $(cut -d',' -f1 <<< $last)"
echo "HoC = $(cut -d',' -f2 <<< $last), LoC = $(cut -d',' -f3 <<< $last)"
echo "Read $pwd/$output_file in detail"
# while IFS=',' read -r f1 f2 f3 f4
# do 
#   echo "$f1, $f2, $f3, $f4"
# done < "$output_file"
cp $output_file "$pwd/"
cd $pwd
