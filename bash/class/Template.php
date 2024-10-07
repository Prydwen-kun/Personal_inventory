<?php
class Template
{

  private $_id;
  //properties


  public function __construct(array $data)
  {
    $this->hydrate($data);
  }


  private function hydrate(array $data) :void
  {
    foreach ($data as $key => $value) {
      // si vous gardez le prefixage dans la requete SQL des model
      // $methodName = 'set' . ucfirst(substr($key, 2, strlen($key) - 2));

      # On peut faire comme ça car dans toute les requetes on alias tous les noms de colonnes
      $methodName = 'set' . ucfirst($key);

      if (method_exists($this, $methodName)) {
        $this->$methodName($value);
      }
    }

   
  } 
  //GETTERS AND SETTERS

}
?>
