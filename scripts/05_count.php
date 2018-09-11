<?php
$json = json_decode(file_get_contents(dirname(__DIR__) . '/parks.json'), true);
foreach($json['features'] AS $f) {
  if(false !== strpos($f['properties']['維護管理單位'], '公園管理科')) {

    echo "{$f['properties']['區']}{$f['properties']['公園名稱']}({$f['properties']['面積_公頃']}公頃)\n";
  }

}
