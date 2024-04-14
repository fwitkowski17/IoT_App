# IoT_App
Aplikacja do zbierania i wyświetlania danych z czujników tempertaury, wilgotności i ciśnienia napisana w języku TypeScript.
Aplikacja na laboratorium z przedmiotu *Technologie webowe w aplikacjach internetu rzeczy*.

## API
### Uruchamianie
Przed uruchomieniem serwera należy utworzyć plik `.env` w którym należy umieścić następującą obowiązkową zawartość:
```ini
MONGODB_URI=link do bazy danych mongodb
```
Nieobowiązkowa zawartość, niekonieczna do działania aplikacji:
```ini
PORT=3200
```
Następnie należy zainstalować zależności poleceniem `npm install` będać w katalogu `api`. Serwer w trybie deweloperskim można uruchomić korzystając z jednego z tych poleceń:
```
npm run dev
npm run watch
npm run start
```
`npm run watch` - korzysta z `nodemon` celem przeładowania bez konieczności ponownego uruchamiania aplikacji

### Endpointy
* **GET** /api/data/latest
* **GET** /api/data/{id}/latest
* **GET** /api/data/{id}
* **GET** /api/data/{id}/{num}
* **POST** /api/data/{id}
* **DELETE** /api/data/all
* **DELETE** /api/data/{id} 

## Wykonane laboratoria
* :white_check_mark: Laboratorium 5 (22.03.2024)
* :white_check_mark: Laboratorium 6 (12.04.2024)