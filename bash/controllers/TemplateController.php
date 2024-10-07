<?php 

  class TemplateController 
  {

    public function index()
    {

      try
      {

        $TemplateModel = new TemplateModel();
        $datas = $TemplateModel->readAll();

        foreach($datas as $data)
        {
          $classTemplate[] = new classTemplate($data);
        }

        include 'views/index.php';
      
      }
      catch(Exception $e)
      {
        throw new Exception($e->getMessage(), $e->getCode(), $e);
      }

    }

  }
?>
