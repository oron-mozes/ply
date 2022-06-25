#!/usr/bin/env bash
source $PWD/scripts/style.sh
source $PWD/scripts/functions.sh

uuid=$(get_user_id)

if [[ -n "$uuid"  ]] ; then
    exit
fi

printf "${Green}${bold}Hello, and welcome to \"ply\".
${normal}${Green}We are your humble assistent here at your service to help you focus on development and not chasing bugs.
Before we can start we would like to know a littel bit about you.\nall the detail are confedential and will be used in order to provide the best service to you.
let\'s start."

printf "${divider}"
emailAddress=$(ask_with_valiation $emailregex "What is your email address? " "Email is invalid please type again")
printf "${divider}"
placeOfWork=$(ask "It's nice to meet you $emailAddress.
Can you please let us know what is your place of work?
if there are any other community memeber we will make sure to link you as you are most likely to share the same development experiance. ")

printf "${divider}"
options=( "Yes" "No")
continueToConfig="$(dropdown ${options[@]} "You are doing great.
Lets create a personlise experiance specially for you.
At any point in time you could always call \"ply config\" and modify the configuration.
Would you like to continue? ")"


 if [[ $continueToConfig == "Yes" ]] ; then
    printf "${divider}"
    options=( "Yes" "No")
    withSound="$(dropdown ${options[@]} "We will use your OS notification for communication. Would you like to play sound?")"

fi



#This is the last action where we write the json
instance=$(put_action http://localhost:3000/user "data={\"email\":\""$emailAddress"\",\"metadata\":{\"placeOfWork\":\""$placeOfWork"\",\"osType\":\""$OSTYPE"\",\"deviceID\":\""$HOSTNAME.$MACHTYPE"\"},\"packages-manage\":{\"npm\":\"null\",\"yarn\":\"null\"},\"config\":{\"sound\":\""$withSound"\"}}")
write "uuid=${instance}" "user"
write "sound=${withSound}" "config"

