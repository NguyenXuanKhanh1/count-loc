#!/bin/bash
pwd=$(pwd)
report="report"
sources="sources"
gitRepo=$1
path=$(echo ${gitRepo##*/} | cut -d. -f1)
cd $sources
git clone $gitRepo
cd $path
output_file=$path"_output.csv"
author_file="author.log"
awkscript='
  {
    if ($1 != "" && $2 == "") {
      if (date != "" && date!=$1) {
        for (extension in extensions) {
          if (extension != "" && extension != " " && extensions[extension]==1) {
            print date","hoc[extension]","loc[extension]","added[extension]","deleted[extension]","extension;
            added[extension]=0;
            deleted[extension]=0;
            extensions[extension]=0;
          }
        }
      }
      date=$1;
      commits+=1;
    }
    else {
      if ($1 >= 0 && $2 >= 0) {
        n=split($0,array,".")
        extension=array[n]
        last=substr(extension, length(extension), length(extension));
        if(last=="}"){
          extension=substr(extension, 1, length(extension)-1)
        }
        extensions[extension]=1;
        added[extension] += $1;
        deleted[extension] += $2;
        hoc[extension]+=$1+$2
        loc[extension]+=$1-$2
      }
    }
  }
  END {
    for (extension in extensions) {
      if (extension != "" && extension != " " && extensions[extension]==1) {
        print date","hoc[extension]","loc[extension]","added[extension]","deleted[extension]","extension;
      }
    }
  }'

echo "date,hoc,loc,added,deleted,extension" > $output_file
echo "Whole project" >> $output_file
git log --reverse --numstat --pretty=format:"%ad" --date=short --ignore-all-space --ignore-space-change --ignore-space-at-eol | awk "$awkscript" >> $output_file

git log --pretty="%an" | sort | uniq > $author_file
while IFS='' read -r f1
do 
  echo "$f1" >> $output_file
  git log --reverse --numstat --author="$f1" --pretty=format:"%ad" --date=short --ignore-all-space --ignore-space-change --ignore-space-at-eol | awk "$awkscript" >> $output_file
done < "$author_file"
last=$(tail -n 1 $output_file)
echo "Age: $(head -3 $output_file | awk 'NR>1' | cut -d',' -f1) ~ $(cut -d',' -f1 <<< $last)"
echo "HoC = $(cut -d',' -f2 <<< $last), LoC = $(cut -d',' -f3 <<< $last)"
echo $output_file
cp $output_file "$pwd/$report"
cd $pwd/$sources
rm -rf $path
cd $pwd
exit
