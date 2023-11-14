#!/bin/sh

# Get Model Folders
MODEL_FOLDERS=$(ls -d packages/cdk/models/*/)

# Iterate Model Folders
for MODEL_DIR in $MODEL_FOLDERS
do
  MODEL_FILE=${MODEL_DIR%/}.tar.gz

  echo "==--------Packing $MODEL_FILE---------=="

  if [ -f "$MODEL_FILE" ]; then
    rm $MODEL_FILE
  fi

  tar -zcvf $MODEL_FILE -C $MODEL_DIR .

done
