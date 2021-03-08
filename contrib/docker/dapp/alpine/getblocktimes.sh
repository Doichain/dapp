#!/bin/bash
#
# Nico Krause (nico@le-space.de)
# This bash script prints out the difficulty and its block times of the last 50 blocks
#
LASTBLOCK=$1
DISPLAY=100
BACK=0
FORWARD=$DISPLAY
if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    LASTBLOCK=$(doichain-cli getchaintips | jq '.[0].height' | sed 's/\"//g')
    BACK=$DISPLAY
    FORWARD=0
fi
echo "lastblock:"$LASTBLOCK
LAST_TIME=0
for ((z=$LASTBLOCK-BACK;z<=$LASTBLOCK+FORWARD;z++))
do
 THIS_HASH=$(doichain-cli getblockhash $z)
 THIS_BLOCK=$(doichain-cli getblock $THIS_HASH)
 BLOCK_UNIXTIME=$(echo $THIS_BLOCK | jq '.time')
 #BLOCK_UNIXTIME=$(doichain-cli getblock $THIS_HASH | jq '.time')
 DURATION_UNIXTIME=$(($BLOCK_UNIXTIME-$LAST_TIME))
 echo $THIS_HASH
 DURATION_TIME=$(date -d @$DURATION_UNIXTIME | cut -c 12-20)
 DIFFICULTY=$(echo $THIS_BLOCK | jq '.difficulty')
 LAST_TIME=$BLOCK_UNIXTIME

 BLOCK_TIME=$(date -d @$BLOCK_UNIXTIME)
 echo $z" "$THIS_HASH" "$BLOCK_UNIXTIME" "$BLOCK_TIME" :"$DURATION_TIME" : "$DIFFICULTY
done