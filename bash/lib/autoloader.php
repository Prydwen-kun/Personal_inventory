<?php

  function loadController( string $controller)
  {
    if(file_exists('controllers/'.$controller.'.php'))
    {
      require_once 'controllers/'.$controller.'.php';
    }
  }

  spl_autoload_register('loadController');


  function loadModel(string $model)
  {
    if(file_exists('models/'.$model.'.php'))
    {
      require_once 'models/'.$model.'.php';
    }
  }

  spl_autoload_register('loadModel');


  function loadClass(string $class)
  {
    if(file_exists('class/'.$class.'.php'))
    {
      require_once 'class/'.$class.'.php';
    }
  }

  spl_autoload_register('loadClass');
?>
