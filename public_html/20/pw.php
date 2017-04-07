{
  "comment": "You'll need the source for this file. It's out there somewhere.",
  "validated": <?php
  $l = "prxbcg";
  $s = array(1, -1, -1, 1, -1, 1, -1);
  function validate($_) {
    global $l, $s;
    $r = str_rot13($l);
    $a = strspn($_, $r) === strlen($_);
    $b = array_map(function($m) { $n = $m[1] - $m[0]; return $n < 0 | -($n > 0); },
                   array_map(null,
                             array_map('ord', str_split($_."\0")),
                             array_map('ord', str_split("\0".$_)))) === $s;
    $c = array_unique(array_map(function($c) use(&$_) { return substr_count($_, $c); }, str_split($r)));
    $c = count($c) === 1 && $c[0] === 1;
    $_ = str_rot13($_);
    $d = strpos($_, $l[0]) < strpos($_, $l[1]) &&
         strpos($_, $l[3]) < strpos($_, $l[2]) &&
         strpos($_, $l[4]) < strpos($_, $l[5]);
    $e = preg_match('/^c.*g$/', $_);
    return $a && $b && $c && $c && $d && $e;
  }
  echo (float) validate($_GET['guess']);
  ?>

}
