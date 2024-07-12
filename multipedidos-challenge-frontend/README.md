# Multipedidos-Challenge

[Desafio Técnico Multipedidos](https://pool-chicory-54c.notion.site/Desafio-T-cnico-Multipedidos-f65b568762064e64a0d8f7c49a219c59)

## Instalação
##### OBS: todos os comandos são considerando a pasta root (multipedidos-challenge) como inicial.

Para emular as portas COM, foi utilizado o software [Free Virtual Serial Ports](https://freevirtualserialports.com/).

O projeto está divido entre **backend e frontend**, então serão necessárias duas instalações, uma dentro da pasta API:

    $ cd multipedidos-challenge-backend
    $ npm install

E outra no **front**:

    $ cd multipedidos-challenge-frontend
    $ npm install

## Rodando o projeto

Primeiro passo é criar as duas portas COM virtuais, abrindo o software instalado e na tela inicial selecionando a opção **Local Bridges**.
Depois disso, é necessário configurar o arquivo **.env**, conforme o arquivo **.env.example**, com as portas criadas, por exemplo:
    
    $ PATHSEND=COM3
    $ BAUDRATESEND=9600
    $ PATHSCALE=COM2
    $ BAUDRATESCALE=9600

Lembrando que não é possível simular o **Baud Rate** na versão free do software.

Novamente, como o projeto está dividido em duas partes, primeiro iniciamos o **backend**:

    $ cd multipedidos-challenge-backend
    $ npm start

E depois no **front**:

    $ cd multipedidos-challenge-frontend
    $ ng serve

