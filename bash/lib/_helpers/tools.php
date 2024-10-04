<?php 

  function debug($var)
  {
    echo '<pre>';
    var_dump($var);
    echo '</pre>';
  }
// Helper functions go here
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags($input));
}
?>
