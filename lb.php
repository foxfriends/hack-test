<?php
try {
  $file = fopen('lb.txt', 'r');
  $scores = fread($file, filesize('lb.txt'));
  fclose($file);

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $level = intval($_GET['level']);
    $hash = $_GET['hash'];

    // ensure they actually are on a level
    $nextLevel = $level + 1;
    if (!file_exists("$nextLevel/$hash.html")) {
      echo "Aborted";
      exit;
    }

    $id = $_GET['id'];
    $name = $_GET['name'];
    $attempts = intval($_GET['attempts']);

    $lines = explode("\n", $scores);
    $added = false;
    foreach ($lines as &$line) {
      $list = explode(',', $line);
      if ($list[0] == $id) {
        if (intval($list[1]) < $level) {
          $list[0] = $name;
          $list[1] = $level;
          $list[2] = intval($list[2]) + $attempts;
          $line = join(',', $list);
        }
        $added = true;
        break;
      }
    }
    unset($line);

    if (!$added) {
      array_push($lines, "$id,$name,$level,$attempts");
    }

    $output = join("\n", $lines);

    $file = fopen('lb.txt', 'w');
    fwrite($file, $output);
    fclose($file);

    echo "OK!"
  } else {
    echo $scores;
  }
} catch (Exception $exception) {
  echo "Error: " . $exception->getMessage() . "\n";
}
?>
