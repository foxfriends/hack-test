<?php
$file = fopen('lb.txt', 'r');
$scores = fread($file, filesize('lb.txt'));
fclose($file);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $level = intval($_GET['level']);
  $hash = $_GET['hash'];

  // ensure they actually are on a level
  $nextLevel = $level + 1;
  if (!file_exists("$nextLevel/$hash.html")) exit;

  $id = $_GET['id'];
  $name = $_GET['name'];
  $attempts = intval($_GET['attempts']);

  $lines = explode("\n", $scores);
  foreach ($lines as &$line) {
    $list = $explode(',', $line);
    if ($list[0] == $id && intval($list[1]) < $level) {
      $list[0] = $name;
      $list[1] = $level;
      $list[2] = intval($list[2]) + $attempts;
      $line = join(',', $list);
    }
  }
  unset($line);

  $output = join("\n", $lines) + "\n";

  $file = fopen('lb.txt', 'w');
  fwrite($file, $output);
  fclose($file);
} else {
  echo $scores;
}

?>
