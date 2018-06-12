<?php
include('/home/kiang/public_html/add/taiwan-address-data-master/lookup.php');
// from http://stats.moe.gov.tw/files/school/106/e1_new.csv
$fh = fopen(dirname(__DIR__) . '/raw/e1_new.csv', 'r');
$header = fgetcsv($fh, 2048);
$fc = array(
  'type' => 'FeatureCollection',
  'features' => array(),
);
$points = array(
  '114631' => array(120.349595,23.067946),
  '114635' => array(120.355199,23.100461),
  '114637' => array(120.429803,23.077768),
  '114639' => array(120.470109,23.044221),
  '114640' => array(120.494634,23.076038),
  '114641' => array(120.445799,23.046149),
  '114642' => array(120.51893,23.074794),
  '114643' => array(120.595268,23.173175),
  '114644' => array(120.40396,23.056233),
  '114646' => array(120.389881,23.064537),
  '' => array(),
  '' => array(),
  '' => array(),
  '' => array(),
  '' => array(),
);
while($line = fgetcsv($fh, 2048)) {
  if($line[3] === '[11]臺南市' && $line[2] === '公立' && !empty($line[4])) {
    $address = substr($line[4], strpos($line[4], ']') + 1);
    $result = AddressLookup::lookup($address);
    if(isset($points[$line[0]])) {
      $fc['features'][] = array(
        'type' => 'Feature',
        'properties' => array_combine($header, $line),
        'geometry' => array(
          'type' => 'Point',
          'coordinates' => $points[$line[0]],
        ),
      );
    } elseif(!empty($result[0]->X)) {
      $fc['features'][] = array(
        'type' => 'Feature',
        'properties' => array_combine($header, $line),
        'geometry' => array(
          'type' => 'Point',
          'coordinates' => array(
            floatval($result[0]->X), floatval($result[0]->Y)
          ),
        ),
      );
    } else {
      print_r($line);
      print_r($result); exit();
    }
  }
}

file_put_contents(dirname(__DIR__) . '/school.json', json_encode($fc));
