#!/bin/bash

classTemplate() {
    cat <<EOF >"$1/Template.php"
<?php
class Template
{

  private \$_id;
  //properties


  public function __construct(array \$data)
  {
    \$this->hydrate(\$data);
  }


  private function hydrate(array \$data) :void
  {
    foreach (\$data as \$key => \$value) {
      // si vous gardez le prefixage dans la requete SQL des model
      // \$methodName = 'set' . ucfirst(substr(\$key, 2, strlen(\$key) - 2));

      # On peut faire comme ça car dans toute les requetes on alias tous les noms de colonnes
      \$methodName = 'set' . ucfirst(\$key);

      if (method_exists(\$this, \$methodName)) {
        \$this->\$methodName(\$value);
      }
    }

   
  } 
  //GETTERS AND SETTERS

}
?>
EOF
}

configWrite() {
    cat <<EOF >"$1/config.php"
<?php 
  # APP TAG
  define('APP_TAG', 'APPNAME');

  # PAGINATION
  define('PAGINATION', 20);

  # DATABASE
  define('DB_ENGINE', 'mysql');
  define('DB_HOST', 'localhost');
  define('DB_NAME', 'forum');
  define('DB_CHARSET', 'utf8mb4');
  define('DB_USER', 'root');
  define('DB_PWD', '');
?>
EOF
}

controllerTemplate() {
    cat <<EOF >"$1/TemplateController.php"
<?php 

  class TemplateController 
  {

    public function index()
    {

      try
      {

        \$TemplateModel = new TemplateModel();
        \$datas = \$TemplateModel->readAll();

        foreach(\$datas as \$data)
        {
          \$classTemplate[] = new classTemplate(\$data);
        }

        include 'views/index.php';
      
      }
      catch(Exception \$e)
      {
        throw new Exception(\$e->getMessage(), \$e->getCode(), \$e);
      }

    }

  }
?>
EOF
}

tools() {
    cat <<EOF >"$1/_helpers/tools.php"
<?php 

  function debug(\$var)
  {
    echo '<pre>';
    var_dump(\$var);
    echo '</pre>';
  }
// Helper functions go here
function sanitizeInput(\$input) {
    return htmlspecialchars(strip_tags(\$input));
}
?>
EOF
}

autoloader() {
    cat <<EOF >"$1/autoloader.php"
<?php

  function loadController( string \$controller)
  {
    if(file_exists('controllers/'.\$controller.'.php'))
    {
      require_once 'controllers/'.\$controller.'.php';
    }
  }

  spl_autoload_register('loadController');


  function loadModel(string \$model)
  {
    if(file_exists('models/'.\$model.'.php'))
    {
      require_once 'models/'.\$model.'.php';
    }
  }

  spl_autoload_register('loadModel');


  function loadClass(string \$class)
  {
    if(file_exists('class/'.\$class.'.php'))
    {
      require_once 'class/'.\$class.'.php';
    }
  }

  spl_autoload_register('loadClass');
?>
EOF
}

CoreModel() {
    cat <<EOF >"$1/CoreModel.php"
<?php 

  abstract class CoreModel 
  {

    private \$_engine = DB_ENGINE;
    private \$_host = DB_HOST;
    private \$_dbname = DB_NAME;
    private \$_charset = DB_CHARSET;
    private \$_dbuser = DB_USER;
    private \$_dbpwd = DB_PWD;

    private \$_db;

    # Constructeur qui appele ma methode connect() pour la connexion a la base 
    public function __construct()
    {
      \$this->connect();
    }

    /**
     * Connexion a la base de donnée
     * 
     * @return void
     * 
     */
    private function connect() : void
    {
      try
      {
        \$dsn = \$this->_engine . ':host=' . \$this->_host .  ';dbname='.\$this->_dbname .';charset='.\$this->_charset;
        \$this->_db = new PDO(\$dsn, \$this->_dbuser, \$this->_dbpwd, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
      } catch(PDOException \$e)
      {
        die(\$e->getMessage());
      }
    }

    /**
     * Getter de _db qui nous retourne un objet PDO
     * 
     * @return PDO
     * 
     */
    protected function getDb() : PDO
    {
      return \$this->_db;
    }

  }
?>
EOF
}

templateModel() {
    cat <<EOF >"$1/TemplateModel.php"
<?php
class TemplateModel extends CoreModel {
    // Model-specific functionality goes here
     private \$_req;

    public function __destruct()
    {
      if(!empty(\$this->_req))
      {
        \$this->_req->closeCursor();
      }
    }

    public function readAll(int \$idConv, int \$pagination, int \$start = 0, string \$orderBy = 'm_date', string \$order = 'DESC') : array{}

}
?>
EOF
}

foot() {
    cat <<EOF >"$1/partials/foot.php"
          </div>
  </div>
</body>
</html>
EOF
}

head() {
    cat <<EOF >"$1/partials/head.php"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <title><?= \$page ?> | APPNAME</title>
  <style>
    .is-fullheight{
      min-height: 100vh;
    }
  </style>
</head>
<body class="has-background-light is-fullheigth" >
  <div class="column is-fullheight is-marginless">
    <div class="container column is-10">
EOF
}

viewsTemplate() {
    cat <<EOF >"$1/TemplateView.php"
<?php include 'partials/head.php'; ?>

 <div class="section">
    <h1 class="title">Liste</h1>
    <div class="card is-shadowless">
      <div class="card-content"></div>
    </div>
  </div>
<!-- Main content goes here -->

<?php include 'partials/foot.php'; ?>
EOF
}

index() {
    cat <<EOF >"$1/index.php"
<?php
require_once 'config/config.php';
require_once 'lib/autoloader.php';

require 'views/partials/head.php';

// Your main application logic goes here

\$ctrl = 'ConversationController';

if (isset(\$_GET['ctrl'])) {
   
  \$ctrl = ucfirst(strtolower(\$_GET['ctrl'])) . 'Controller';
}



\$method = 'index';
if (isset(\$_GET['action'])) {
 
  \$method = \$_GET['action'];
}

try {
 
  if (class_exists(\$ctrl)) {
 
    \$controller = new \$ctrl();

    if (!empty(\$_POST)) {

      if (method_exists(\$ctrl, \$method)) {
        # On vérifie si on a un \$_GET['id'] qu'il n'est pas vide et du type numérique
        if (!empty(\$_GET['id']) && ctype_digit(\$_GET['id'])) {
          # update(\$_GET['id], \$_POST)
          \$controller->\$method(\$_GET['id'], \$_POST);
        } else {
          # create(\$_POST)
          \$controller->\$method(\$_POST);
        }
      }
    } else {

      if (method_exists(\$ctrl, \$method)) {
        # On vérifie si on a un \$_GET['id'] qu'il n'est pas vide et du type numérique
        if (!empty(\$_GET['id']) && ctype_digit(\$_GET['id'])) {
          # show(\$_GET['id']) ou delete(\$_GET['id'])
          \$controller->\$method(\$_GET['id']);
        } else {
          # index()
          \$controller->\$method();
        }
      }
    }
  }
} catch (Exception \$e) {
  die(\$e->getMessage());
}

require 'views/partials/foot.php';

?>
EOF
}

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
        read -p "Enter to overwrite files... q/Q to exit" var2

        if [[ "$var2" == "q" || "$var2" == "Q" ]]; then
            exit 0
        fi
    fi
    mkdir -p --verbose lib controllers class config models views
    touch index.php
    
    parent_dir=$(pwd)
    index "$parent_dir"

    find "$parent_dir" -type d | while read -r dir; do
        echo "Processing : $dir"

        case $(basename "$dir") in
        "class")
            touch "$dir/Template.php"
            classTemplate "$dir"
            ;;
        "config")
            touch "$dir/config.php"
            configWrite "$dir"
            ;;
        "controllers")
            touch "$dir/TemplateController.php"
            controllerTemplate "$dir"
            ;;
        "lib")
            mkdir -p "$dir/_helpers"
            touch "$dir/_helpers/tools.php"
            touch "$dir/autoloader.php"
            tools "$dir"
            autoloader "$dir"
            ;;
        "models")
            touch "$dir/CoreModel.php"
            touch "$dir/TemplateModel.php"
            CoreModel "$dir"
            templateModel "$dir"
            ;;
        "views")
            mkdir -p "$dir/partials"
            touch "$dir/partials/foot.php"
            touch "$dir/partials/head.php"
            touch "$dir/TemplateView.php"
            foot "$dir"
            head "$dir"
            viewsTemplate "$dir"
            ;;
        *) ;;
        esac

    done

fi
read -p 'Enter to exit...' var1
exit 0
