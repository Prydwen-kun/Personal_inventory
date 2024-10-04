<?php
require_once 'config/config.php';
require_once 'lib/autoloader.php';

require 'views/partials/head.php';

// Your main application logic goes here

$ctrl = 'ConversationController';

if (isset($_GET['ctrl'])) {
   
  $ctrl = ucfirst(strtolower($_GET['ctrl'])) . 'Controller';
}



$method = 'index';
if (isset($_GET['action'])) {
 
  $method = $_GET['action'];
}

try {
 
  if (class_exists($ctrl)) {
 
    $controller = new $ctrl();

    if (!empty($_POST)) {

      if (method_exists($ctrl, $method)) {
        # On vérifie si on a un $_GET['id'] qu'il n'est pas vide et du type numérique
        if (!empty($_GET['id']) && ctype_digit($_GET['id'])) {
          # update($_GET['id], $_POST)
          $controller->$method($_GET['id'], $_POST);
        } else {
          # create($_POST)
          $controller->$method($_POST);
        }
      }
    } else {

      if (method_exists($ctrl, $method)) {
        # On vérifie si on a un $_GET['id'] qu'il n'est pas vide et du type numérique
        if (!empty($_GET['id']) && ctype_digit($_GET['id'])) {
          # show($_GET['id']) ou delete($_GET['id'])
          $controller->$method($_GET['id']);
        } else {
          # index()
          $controller->$method();
        }
      }
    }
  }
} catch (Exception $e) {
  die($e->getMessage());
}

require 'views/partials/foot.php';

?>
