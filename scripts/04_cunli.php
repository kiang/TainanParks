<?php
$json = json_decode(file_get_contents('/home/kiang/public_html/map_print/cunli.json'), true);
foreach($json['features'] AS $k => $f) {
  if($f['properties']['TOWNNAME'] !== '北區' && $f['properties']['TOWNNAME'] !== '中西區') {
    unset($json['features'][$k]);
  }
}
$json['features'] = array_values($json['features']);
file_put_contents(dirname(__DIR__) . '/cunli.json', json_encode($json));
