#!/usr/bin/env bash
source $PWD/scripts/setup.sh
source $directoryPath"user.sh";

write () {
   
    DATA="$1"
    FILE_NAME="$2"
    mkdir -p $directoryPath 
    
    printf "#!/usr/bin/env bash\n\n ${DATA}" > $directoryPath$FILE_NAME".sh"
}

read_file () {
     FILE_NAME="$1"

     cat $directoryPath$FILE_NAME".sh"
}


get_user_id() {
    echo $uuid

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
    echo $(curl -d $2 -sb -H  -X PUT $1)
}

post_action() {
    echo $(curl -d $2 -sb -H "Authorization: Bearer ${uuid}" 'Content-Type: application/json'  $1)
}


get_action() {
   echo $(curl -sb -H  http://localhost:3000/user)
}