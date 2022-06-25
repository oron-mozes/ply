#!/usr/bin/env bash

write () {
    ROOT_DIRECTORY="$1"
    DATA="$2"
    FILE_NAME="$3"
    mkdir -p $ROOT_DIRECTORY
    
    printf $DATA > $ROOT_DIRECTORY$FILE_NAME
}


ask_with_valiation () {

    read -p "$2" result
    
    if [[ $result =~ $1 ]] ; then
       echo $result
    else

        ask_with_valiation "$1" "$2" "$3"
    fi
}

ask () {
   read -p "$1" result
   echo $result
}

dropdown () {
    options=("$@")
    length=${#options[@]} 

    PS3=${options[${#options[@]} - 1]}
    select option in "${options[@]:0:length-1}"; do
        echo $option && break
        [[ $option == exit ]] && break
        [[ $option == skip ]] && break

    done
}

put_action() {
    echo $(curl -d $2 -sb -H -X PUT $1)
}

get_action() {
   echo $(curl -sb -H  http://localhost:3000/user)
}