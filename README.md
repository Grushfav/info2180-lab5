#This is Lab 5 for Gavin Seaton on PHP and MySQL

This repository contains a small PHP + MySQL demo used for Lab 5. It provides a simple UI (`index.html`) and a server endpoint (`world.php`) that look up countries and their cities from the provided `world.sql` dataset.

**Quick Links**
- **UI:** `http://localhost/info2180-lab5/index.html`
- **API / legacy endpoint:** `http://localhost/info2180-lab5/world.php`

**What’s included**
- `index.html` — front-end UI with a search box and result area.
- `world.php` — server endpoint that returns HTML tables for legacy lab usage and also supports a JSON API.
- `world.css`, `world.js` — client styles and scripts.
- `world.sql` — SQL dump with `countries` and `cities` tables used as the data source.

**Prerequisites**
- XAMPP (Apache + MySQL) or another PHP + MySQL stack installed on Windows.
- A browser to open the UI (Chrome, Firefox, Edge).

Setup
1. Place the project folder in your Apache `htdocs` directory. Example default path used in this repo:

```powershell
C:\xampp\htdocs\info2180-lab5
```

Or import `world.sql` via phpMyAdmin (choose or create a database named `world`, then Import → select file).

2. Configure database credentials
- By default `world.php` contains the database connection variablesa local XAMPP setup these values are:

```php
$host = '127.0.0.1';
$dbname = 'world';
$username = ' lab5_user';
$password = ' password123';
```


Usage
- Open the UI in your browser: `http://localhost/info2180-lab5/index.html`. Use the search box and the lookup buttons to fetch results.
- Legacy HTML endpoints (used by the lab):
	- Default list (first 200 countries): `http://localhost/info2180-lab5/world.php`
	- Search countries by name: `http://localhost/info2180-lab5/world.php?country=Jamaica`
	- List cities for a country: `http://localhost/info2180-lab5/world.php?country=Jamaica&lookup=cities`


Contact / Credits
- Author: Gavin (Lab 5 workspace)
- Dataset: standard `world` SQL dataset (countries and cities)

---
If you want, I can create a `config.sample.php` and update `world.php` to use it, and then mark the README update complete.



