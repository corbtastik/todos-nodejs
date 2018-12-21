# Todo(s) API in Node.js

Howdy! This is a Todo(s) backing API implemented in [Node.js](https://nodejs.org) w/[Express](https://github.com/expressjs/express).

## Pushing to Cloud Foundry

This app is ready to push to Cloud Foundry and will rely on the Node.js Buildpack to automate containerization of the app.

1. Specify version of Node.js to use
1. Cloud Foundry vendoring
1. Vendor using npm
1. Vendor using yarn
1. Vendor using yarn offline

## Specify version of Node.js to use

You can [target the proper Node.js version](https://docs.cloudfoundry.org/buildpacks/node/index.html#runtime) to use by supplying this information in ``package.json`` or leave it undefined and CF will use the lowest LTS release of Node.js supported by [Buildpack](https://github.com/cloudfoundry/nodejs-buildpack/releases/latest) being used.  This is one of the benefits of CF, that is the Buildpack provides a means to control and upgrade multiple versions of the Node.js middleware stack from 6.x to 11.x so you don't have to :)

```json
{
  "engines": {
<<<<<<< HEAD
    "node": "10.14.1"
=======
    "node": "10.14.0"
>>>>>>> dcb97c2fd989b2bf22ae5661b2b75286b4bb6905
  }
}
```

## Cloud Foundry vendoring

If you want CF to handle vendoring of your Node.js dependencies it will gladly do so.  You can simply clone this sample and push the code "as is" to CF and the Node.js Buildpack will run ``npm install`` and pull down dependencies from the [public NPM registry](https://registry.npmjs.org).  This is great for convenience but often deployments of CF are air-gapped and can't reach such registries.

If we clone and push this sample un-vendored (as provided) then all resolved dependencies will coming from ``https://registry.npmjs.org`` and be placed into ``node_modules`` along with ``package-lock.json`` file that describes the resolved dependencies in ``node_modules``.

```bash
app.js
manifest.yml
package.json
```

## Vendor using npm

Before we push to CF we can vendor by running ``npm install`` to pull down dependencies and generate the ``package-lock.json`` file.  If we push at this point we can provide a fully encapsulated app for CF, thus it will not run ``npm install`` and will simply use our vendored dependencies in ``node_modules``.

```bash
app.js
manifest.yml
node_modules/
package-lock.json
package.json
```

## Vendor using yarn

Similar to vendoring with npm, we can run ``yarn install`` to pull down dependencies and such.  In this case the registry will be ``https://registry.yarnpkg.com``.

```bash
app.js
manifest.yml
node_modules/
package.json
yarn.lock
```

## Cloud Foundry Need to Node

If you're a Node.js developer using Cloud Foundry then here's a short list of things to consider.

1. Make sure you're using a Node version provided by the [Node.js Buildpack](https://github.com/cloudfoundry/nodejs-buildpack/releases)
1. Understand how to [Vendor](https://docs.cloudfoundry.org/buildpacks/node/index.html#vendoring) a Node.js application for Cloud Foundry
1. In particular running Node.js apps in an [air-gapped](https://docs.cloudfoundry.org/buildpacks/node/index.html#offline_environments) CF
1. Understand the application [ENVIRONMENT](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html) being presented to the Node.js app

## CRUD Ops

 ```bash
$ http localhost:8080/ title="make bacon pancakes"
HTTP/1.1 201 Created
{
    "id": 1,
    "title": "make bacon pancakes"
}

$ http localhost:8080/1
HTTP/1.1 200 OK
{
    "completed": "true",
    "id": 1,
    "title": "make bacon pancakes"
}
$ http PATCH localhost:8080/1 completed=true
HTTP/1.1 200 OK
{
    "completed": "true",
    "id": 1,
    "title": "make bacon pancakes"
}
$ http DELETE localhost:8080/1
HTTP/1.1 200 OK
{
    "completed": "true",
    "id": 1,
    "title": "make bacon pancakes"
}
$ http localhost:8080/ 
HTTP/1.1 200 OK

[]
```
