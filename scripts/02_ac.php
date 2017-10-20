<?php
$fc = array(
  'type' => 'FeatureCollection',
  'features' => array(),
);

$fh = fopen(dirname(__DIR__) . '/raw/activity-center.csv', 'r');
while($line = fgetcsv($fh, 2048)) {
  foreach($line AS $k => $v) {
    $line[$k] = mb_convert_encoding($v, 'utf-8', 'big5');
  }
  $f = array(
    'type' => 'Feature',
    'properties' => array(
      'area' => $line[0],
      'cunli' => $line[1],
      'name' => $line[2],
      'address' => $line[3],
    ),
    'geometry' => array(
      'type' => 'Point',
      'coordinates' => array($line[5], $line[4]),
    ),
  );
  $fc['features'][] = $f;
}

file_put_contents(dirname(__DIR__) . '/ac.json', json_encode($fc));
