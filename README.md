## Hur har det gått?

Det har varit svårt men jag har lärt mig väldigt mycket även om det fortfarande kanske är lite suddigt men processen har fått mig att förstå korrelationen mellan en server och databas osv.

Det som gick dåligt var kanske att förstå hur man skulle routa allt och förstå skillnaden på GET POST osv

Jag hade behövt lära mig mer om allt så jag verkligen förstår eftersom att det fortfarande är lite oklart för mig.

## Mina routes

| Metod | Route       | Funktionalitet                                                              | Säkerhet                             |
|-------|-------------|-----------------------------------------------------------------------------|--------------------------------------|
| GET   | /           | Hämtar och visar alla tweets                                                | Inga specifika säkerhetsåtergärder   |
| GET   | /skicka     | Visar formuläret för att skapa en ny tweet                                  | --                                   |
| POST  | /skicka     | Tar emot och lagrar den nya tweeten i databasen                             | Min-Max längd                        |
| GET   | /:id/delete | Raderar en tweet baserat på id som är valt                                  | Kontrollerar id är giltigt heltal    |
| GET   | /:id/edit   | Hämtar tweet baserat på id och tar fram en sida som du kan ändra tweeten på | Kontrollerar heltal och om den finns |
| POST  | /edit       | Uppdaterar tweeten av det du skickat in                                     | Min- Max läng                        |

## Säkerhet

Jag kan inte riktigt komma ihåg om jag lagt ner särskilt mycket tid på säkerheten

## Nya funktioner

Jag hade lagt till att man kunde favorisera tweets localt på sin dator men jag tog bort det för jag tänkte ändra på något och hann inte bli klar med det.
Annars så har jag bara ändrat på css och gjort sp att hemsidan ser bättre ut.