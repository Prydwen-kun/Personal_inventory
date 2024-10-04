#!/bin/bash
echo "||Bash exec Dir :"
which bash
echo "||Current directory -->"
current_dir=$(pwd)
echo "$current_dir"

var2=""
read -p "Enter to create directory template... q/Q to exit" var2

if [[ "$var2" == "q" || "$var2" == "Q" ]]; then
    exit 0
else

    if [[ -d "lib" && -d "controllers" && -d "class" && -d "config" && -d "models" && -d "views" ]]; then
        echo "Folders exist already"
    else
        mkdir --verbose lib controllers class config models views
        touch index.php

        parent_dir=$(pwd)

        find "$parent_dir" -type d | while read -r dir; do
            echo "$dir"

            case $(basename "$dir") in
            "class")
                touch "$dir/classTemplate.php"
                ;;
            "config")
                touch "$dir/config.php"
                ;;
            "controllers")
                touch "$dir/controllerTemplate.php"
                ;;
            "lib")
                mkdir "$dir/_helpers"
                touch "$dir/_helpers/tools.php"
                touch "$dir/autoloader.php"
                ;;
            "models")
                touch "$dir/CoreModel.php"
                touch "$dir/templateModel.php"
                ;;
            "views")
                mkdir "$dir/partials"
                touch "$dir/partials/foot.php"
                touch "$dir/partials/head.php"
                touch "$dir/viewsTemplate.php"
                ;;
            *) ;;
            esac

        done
    fi
fi
read -p 'Enter to exit...' var1
exit 0
