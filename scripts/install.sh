#!/usr/bin/env bash
source $PWD/scripts/style.sh
source $PWD/scripts/setup.sh


withSound=0;

printf "${Green}${bold}Hello, and welcome to \"ply\".
${normal}${Green}We are your humble assistent here at your service to help you focus on development and not chasing bugs.
Before we can start we would like to know a littel bit about you.\nall the detail are confedential and will be used in order to provide the best service to you.
let\'s start."

greeting() {
    read -p "What is your email address? " emailAddress
    
    if [[ $emailAddress =~ $emailregex ]] ; then
       place_of_work
    else
        echo "Email is invalid please type again";
        greeting
    fi
}


place_of_work() {
    printf "${divider}"
    read -p "It's nice to meet you $emailAddress.
    Can you please let us know what is your place of work?
    if there are any other community memeber we will make sure to link you as you are most likely to share the same development experiance." placeOfWork
    
    config
}



write_to_file () {
    mkdir -p $directoryPath
    printf '{
        "email": "'$emailAddress'",
        "metadata": {
            "placeOfWork": "'$placeOfWork'"
        },
        "config": {
            "sound": "'$withSound'"
        }
    }' > "${directoryPath}user.json"

}


config_sound () {
    printf "${divider}"
   PS3="We will use your OS notification for communication. Would you like to play sound?"
        
    select opt in Yes No Skip; do

    case $opt in
        Yes)
        withSound=1;
        write_to_file
        break;;
        No)
        write_to_file
        break;;
        
        Skip)
        write_to_file
        break;;
        
        *) 
        echo "Invalid option $REPLY"
        ;;
    esac
    done
}

config() {
    
    printf "${divider}"
    PS3="You are doing great.
            Let create a personlise experiance specially for you.
            At any point in time you could always call \"ply config\" and modify the configuration.
            Would you like to continue? "
            
    select opt in Yes No Skip; do

    case $opt in
        Yes)
        config_sound
        break;;
        No)
        write_to_file
        break;;
        
        Skip)
        write_to_file
        break;;
        
        *) 
        echo "Invalid option $REPLY"
        ;;
    esac
    done
}

greeting
