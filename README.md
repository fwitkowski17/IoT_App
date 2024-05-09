# IoT_App
Aplikacja do zbierania i wyświetlania danych z czujników tempertaury, wilgotności i ciśnienia napisana w języku TypeScript.
Aplikacja na laboratorium z przedmiotu *Technologie webowe w aplikacjach internetu rzeczy*.

## API
### Uruchamianie
Przed uruchomieniem serwera należy utworzyć plik `.env`. W nim należy umieścić następującą zawartość (bez niej aplikacja się nie uruchomi):
```ini
MONGODB_URI='<link do bazy danych MongoDB>'
```
Dodatkowo w pliku można zdefiniować inne parametry, które nadpiszą domyślne:
```ini
PORT=3100
JWT_TOKEN=secret
```
Następnie należy zainstalować zależności poleceniem `npm install` będać w katalogu `api`. Serwer w trybie deweloperskim można uruchomić korzystając z jednego z tych poleceń:

* `npm run dev`
* `npm run start`
* `npm run watch` (korzysta z `nodemon` celem przeładowywania bez konieczności ponownego uruchamiania aplikacji)

Pełen zestaw komend:
```bash
git clone https://github.com/fwitkowski17/IoT_App.git
cd IoT_App/api
npm install
echo MONGODB_URI='<link do bazy MongoDB>' > .env
npm run start
```

### Endpointy
* **GET** /api/data/latest
* **GET** /api/data/{id}/latest
* **GET** /api/data/{id}
* **GET** /api/data/{id}/{num}
* **POST** /api/data/{id}
* **POST** /api/user/auth
* **POST** /api/user/create
* **POST** /api/user/reset
* **PUT** /api/user/{userId}
* **DELETE** /api/data/all
* **DELETE** /api/data/{id}
* **DELETE** /api/user/logout/{userId} 
* **DELETE** /api/user/{userId}

## Wykonane laboratoria
* :white_check_mark: Laboratorium 5 (22.03.2024)
* :white_check_mark: Laboratorium 6 (12.04.2024)
* :white_check_mark: Laboratorium 7 (19.04.2024)