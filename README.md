# Setup instructions

If you have already installed all the components you can use these short commands inside the project root:

- To rebuild & restart all components at once:
```
yarn docker:upgrade
```

- Or any of the commands below:
```
yarn docker:start:mongo
yarn docker:stop:mongo
yarn docker:restart:mongo
yarn docker:build:backend
yarn docker:stop:backend
yarn docker:start:backend
yarn docker:restart:backend
yarn docker:upgrade:backend
yarn docker:build:web
yarn docker:stop:web
yarn docker:start:web
yarn docker:restart:web
yarn docker:upgrade:web
yarn docker:build
yarn docker:stop
yarn docker:start
yarn docker:restart
yarn docker:upgrade
```

Otherwise follow the installation instructions below.

## 1. Checkout starter project

```
git clone git@github.com:ipavlenko/Labor-X-Starter.git
```

## 2. Build & install docker images

Go to the  project root:

```
cd ./Labor-X-Starter
```

### 2.1. Build the backend container

Execute this command from the project root:

```
docker build \
  --tag laborx-platform-backend \
  --file ./setup/backend/Dockerfile \
  --build-arg GIT_BRANCH=develop \
  .
```

GIT_BRANCH used to specify source branch of the main project and all the subprojects.
Add --no-cache option if you have caching issues.

### 2.2. Build the web container

Execute this command from the project root:

```
docker build \
  --tag laborx-platform-web \
  --file ./setup/web/Dockerfile \
  --build-arg GIT_BRANCH=develop \
  .
```

GIT_BRANCH used to specify source branch of the main project and all the subprojects.
Add --no-cache option if you have caching issues.

## 3. Create network

```
docker network create --driver=bridge --subnet=192.168.11.0/24 laborx-platform
```

We will use these hosts and ip addresses:

| Host                         | Ip                  | Port(s)                  | Purpose                                |
|------------------------------|---------------------|--------------------------|----------------------------------------|
| host                         | 192.168.11.1        |                          | Host machine, proxy and gateway        |
| laborx.platform.mongo        | 192.168.11.2        | 27017                    | Mongo database                         |
| laborx.platform.backend      | 192.168.11.3        | 3000                     | Backend application (REST & Admin app) |
| laborx.platform.web          | 192.168.11.4        | 3001                     | Public web application                 |

## 4. Run docker images

### 4.1. Run the storage container

1. Before first launch create storage folder on your host machine:
```
mkdir -p /var/data/laborx.platform.mongo/db
```

2. Run the container using this command:
```
docker run \
  --name laborx.platform.mongo \
  --network laborx-platform --ip 192.168.11.2 \
  --restart=always --detach \
  --mount type=bind,src=/var/data/laborx.platform.mongo/db,dst=/data/db \
  mongo mongod --auth
```

Container exports port 27017, so you can also add `--publish 27017:27017` param to `docker run` if necessary.

3. After the first launch bootsrtap a mongo database:

  - Connect to mongo in the container locally
  ```
  docker exec -it laborx.platform.mongo mongo admin
  ```

  - Create an admin account in the mongo shell inside a container
  ```
  db.createUser({ user: 'admin', pwd: 'admin', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]});
  ```

  - Exit from the mongo shell and the container
  ```
  exit
  ```

  - Connect to mongo in the container using mongo client
  ```
  mongo mongodb://192.168.11.2:27017/admin --username admin --password
  ```
  (this command will propt for a password, type "admin")

  - Create a database and a user for the backend application
  ```
  use laborx-platform-backend
  db.createUser({ user: 'platform', pwd: 'platform', roles: [ { role: "dbOwner", db: "laborx-platform-backend" } ]});
  ```

  - Exit from the mongo shell
  ```
  exit
  ```

  - Try the connection
  ```
  mongo mongodb://192.168.11.2:27017/laborx-platform-backend --username platform --password
  ```
  (this command will propt for a password, type "platform")

  - Exit from the mongo shell
  ```
  exit
  ```


### 4.2. Run the backend container

```
docker run \
  --name laborx.platform.backend \
  --restart=always --detach \
  --network laborx-platform --ip 192.168.11.3 \
  --mount type=bind,src=$(pwd)/setup/backend/config,dst=/data/config \
  --mount type=bind,src=/var/data/laborx.platform.files,dst=/data/files \
  laborx-platform-backend
```

Container exports port 3000, so you can also add `--publish 3000:3000` param to `docker run` if necessary.
You can also specify custom environment (and custom config):

```
docker run \
  --name laborx.platform.backend \
  --restart=always --detach \
  --network laborx-platform --ip 192.168.11.3 \
  --mount type=bind,src=$(pwd)/setup/backend/config,dst=/data/config \
  --mount type=bind,src=/var/data/laborx.platform.files,dst=/data/files \
  laborx-platform-backend pm2-runtime start ecosystem.config.js --env development
```

By default `docker run` command will start pm2 inside a container with these arguments:
```
pm2-docker start ecosystem.config.js --env production
```

### 4.3. Run the web container

```
docker run \
  --name laborx.platform.web \
  --restart=always --detach \
  --network laborx-platform --ip 192.168.11.4 \
  --mount type=bind,src=$(pwd)/setup/web/config,dst=/data/config \
  laborx-platform-web
```

Container exports port 3001, so you can also add `--publish 3001:3001` param to `docker run` if necessary.
You can also specify custom environment (and custom config):

```
docker run \
  --name laborx.platform.web \
  --restart=always --detach \
  --network laborx-platform --ip 192.168.11.4 \
  --mount type=bind,src=$(pwd)/setup/web/config,dst=/data/config \
  laborx-platform-web pm2-runtime start ecosystem.config.js --env development
```

By default `docker run` command will start pm2 inside a container with these arguments:
```
pm2-docker start ecosystem.config.js --env production
```
