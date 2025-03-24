#!/bin/sh

BASEDIR="<path to my project dir>"

files=$(git diff --name-status master);

while read -r file; do
  mode=$(echo "$file" | awk '{print $1}')
  filePath=$(echo "$file" | awk '{print $2}')
  if [ "$mode" = "M" ] || [ "$mode" = "A" ] || [ "$mode" = "AM" ]
    then
      npx prettier --write $filePath
  fi
done <<< "$files"