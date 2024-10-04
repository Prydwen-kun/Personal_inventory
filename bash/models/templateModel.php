<?php
class TemplateModel extends CoreModel {
    // Model-specific functionality goes here
     private $_req;

    public function __destruct()
    {
      if(!empty($this->_req))
      {
        $this->_req->closeCursor();
      }
    }

    public function readAll(int $idConv, int $pagination, int $start = 0, string $orderBy = 'm_date', string $order = 'DESC') : array{}

}
?>
