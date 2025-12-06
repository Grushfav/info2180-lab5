<?php
// Simple API for lookup used by world.js
$host = 'localhost';
$username = 'lab5_user';
$password =  'password123';
$dbname = 'world';

function respond_json($data, $status=200){
  header('Content-Type: application/json; charset=utf-8');
  http_response_code($status);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

try{
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);

  $type = $_GET['type'] ?? 'country';
  $q = $_GET['q'] ?? '';
  $qterm = "%" . $q . "%";
  $countryParam = $_GET['country'] ?? null;

  // If a 'country' GET parameter is provided, run a LIKE search against countries.name
  if($countryParam !== null){
    $countryTerm = "%" . $countryParam . "%";
    $lookup = $_GET['lookup'] ?? '';

    if($lookup === 'cities'){
      // Return cities for the matched country(s)
      $sql = "SELECT cities.name AS name, cities.district AS district, cities.population AS population
              FROM cities
              JOIN countries ON cities.country_code = countries.code
              WHERE countries.name LIKE :country
              LIMIT 250";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([':country' => $countryTerm]);
      $rows = $stmt->fetchAll();

      // Output HTML table for cities
      echo '<table class="results">';
      echo '<thead><tr><th>Name</th><th>District</th><th>Population</th></tr></thead><tbody>';
      foreach($rows as $r){
        echo '<tr>';
        echo '<td>' . htmlspecialchars($r['name'] ?? '', ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</td>';
        echo '<td>' . htmlspecialchars($r['district'] ?? '', ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</td>';
        echo '<td>' . htmlspecialchars($r['population'] ?? '', ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</td>';
        echo '</tr>';
      }
      echo '</tbody></table>';
      exit;
    } else {
      // Return country info (matches via LIKE)
      $sql = "SELECT name, continent, independence_year, head_of_state FROM countries WHERE name LIKE :country LIMIT 250";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([':country' => $countryTerm]);
      $rows = $stmt->fetchAll();

      // Output HTML table for countries
      echo '<table class="results">';
      echo '<thead><tr><th>Name</th><th>Continent</th><th>Independence</th><th>Head of State</th></tr></thead><tbody>';
      foreach($rows as $r){
        echo '<tr>';
        echo '<td>' . htmlspecialchars($r['name'] ?? '', ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</td>';
        echo '<td>' . htmlspecialchars($r['continent'] ?? '', ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</td>';
        echo '<td>' . htmlspecialchars($r['independence_year'] ?? '', ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</td>';
        echo '<td>' . htmlspecialchars($r['head_of_state'] ?? '', ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</td>';
        echo '</tr>';
      }
      echo '</tbody></table>';
      exit;
    }
  }

  if(isset($_GET['format']) && $_GET['format']==='json'){
    if($type === 'cities'){
      // join cities -> countries to return helpful fields
      $sql = "SELECT cities.name AS city, cities.district, cities.population, countries.name AS country
          FROM cities
          LEFT JOIN countries ON cities.country_code = countries.code
          WHERE countries.name LIKE :q OR cities.name LIKE :q
          LIMIT 250";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([':q'=>$qterm]);
      $rows = $stmt->fetchAll();
      respond_json($rows);
    } else {
     
      $sql = "SELECT * FROM countries WHERE name LIKE :q LIMIT 250";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([':q'=>$qterm]);
      $rows = $stmt->fetchAll();
      respond_json($rows);
    }
  } else {
    // legacy HTML listing (table) 
    $stmt = $pdo->query("SELECT name, head_of_state FROM countries LIMIT 200");
    $results = $stmt->fetchAll();
    echo '<table class="results">';
    echo '<thead><tr><th>Name</th><th>Head of State</th></tr></thead><tbody>';
    foreach($results as $row){
      echo '<tr>';
      echo '<td>' . htmlspecialchars($row['name'] ?? '', ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</td>';
      echo '<td>' . htmlspecialchars($row['head_of_state'] ?? '', ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8') . '</td>';
      echo '</tr>';
    }
    echo '</tbody></table>';
    exit;
  }

} catch(Exception $e){
  if(isset($_GET['format']) && $_GET['format']==='json'){
    respond_json(['error'=> $e->getMessage()], 500);
  }
 
  http_response_code(500);
  echo '<h1>Server error</h1><pre>' . htmlspecialchars($e->getMessage()) . '</pre>';
  exit;
}
