# Considerazioni riguardo alla struttura del progetto UF14

Se questo software dovesse gestire davvero un ospedale vero, l'architettura che abbiamo usato oggi avrebbe tre grandi punti deboli:

## 1. Gateway Nginx

Il primo problema sorge quando vogliamo fare un cambio ninario, perchè bisogna aprire il file delle configurazioni e cambiare a mano la scritta e ricaricare il file.
Una soluzione che ho trovato potrebbe essere l'uso di Traefik, che è in grado di di integrarsi e configurarsi in maniera automatica con i componenti infrastrutturali già esistenti.
[Traefik](https://www.ibm.com/it-it/products/instana/supported-technologies/traefik-labs-proxy)

## 2. Migrazione da Docker a Kubernetes
In fase di sviluppo docker è perfetto, però in produzione dovremmo spostarci su un qualcosa di più potente come kubernetes che rispetto a Docker è in grado di autogestirsi e riavviare i componenti in caso di crash improvvisi.