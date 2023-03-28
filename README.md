# Aplikacje w chmurze

## Projekt 2 - Przygotuj konfigurację Vagrant dla trzech maszyn (db, backend, frontend).

Jedynie frontend powinien przekierować port, a reszta komunikacji powinna odbywać się w ramach sieci prywatnej. Zawartość każdej z maszyn powinna powstać przy pomocy Ansible.

Link do danych: [**Life Expectancy 2000-2015**](https://www.kaggle.com/datasets/vrec99/life-expectancy-2000-2015) (kaggle)

### Start środowiska

    vagrant up

### Usunięcie maszyny wirtualnej

    vagrant destroy machinename

### Połączenie SSH z maszyną wirtualną

    vagrant ssh machinename