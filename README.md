# Loopback with JWT Autentication

The project is generated by [LoopBack](http://loopback.io).

## Install

See instructions in INSTALL.md

## Basics

Add a new datasource for persists the model. See [more](https://loopback.io/doc/en/lb3/Create-new-data-source.html)

	lb datasource

Define an entity of your model. See [more](https://loopback.io/doc/en/lb3/Create-new-models.html)

	lb model

This will create `entity.js` and `entity.json` files. Inside of them we will find  the acls section that the define methods permissions.