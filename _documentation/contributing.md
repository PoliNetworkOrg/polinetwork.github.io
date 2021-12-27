# Contribuisci al sito di PoliNetwork!

## Testare il sito in locale per fare modifiche

### Prerequisiti Linux (Debian based, per altre distro o macOS [clicca qui](https://jekyllrb.com/docs/installation/other-linux/))

```
sudo apt install git ruby-full build-essential zlib1g-dev
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
gem install jekyll bundler
git clone https://github.com/PoliNetwork/polinetwork.github.io
git submodule init
git submodule update
```

### Prerequisiti Windows

1. Scarica e installa Git da [qui](https://git-scm.com/download/win);
2. Scarica e installa **Ruby+Devkit** da [qui](https://rubyinstaller.org/downloads/). Usa le impostazioni di default per l'installazione;
3. Fai andare `ridk install` durante il passo finale dell'installazione;
4. Apri una nuova finestra del terminale per fare in modo che i cambiamenti alla variabile d'ambiente `PATH` vengano salvati.

```
gem install jekyll bundler webrick wdm
git clone https://github.com/PoliNetwork/polinetwork.github.io
git submodule init
git submodule update
```

### Avvio

	cd polinetwork.github.io
	jekyll serve

Il sito si raggiunge da qualsiasi browser tramite http://localhost:4000 e si aggiorna automaticamente ad ogni modifica ai file del sito.

## Aggiungere i cambiamenti al sito

**IMPORTANTE: i primi 4 comandi sono obbligatori da fare PRIMA dei successivi se fai modifiche alla [repository dei dati](https://github.com/PoliNetworkOrg/polinetworkWebsiteData), altrimenti possono essere saltati. Anche se non modifichi la repository principale devi seguire i passaggi successivi.**

Apri una finestra del terminale nella cartella `polinetwork.github.io/_data`, [richiedici](https://polinetwork.org/it/learnmore/contacts/) l'accesso in scrittura alla repository dei dati, poi:

```
	git checkout main
	git add .
	git commit -m <messaggio>
	git push
	cd ..
	git checkout master
	git add .
	git commit -m <messaggio>
```
Crea un fork di questa repository sul tuo account GitHub, accedi a GitHub tramite VScode o GitKraken aggiungendo la cartella locale della repository, poi `git push <nomeutentegithub> master`. Infine, dal tuo fork, crea una Pull Request verso il nostro master.