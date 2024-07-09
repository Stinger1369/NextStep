ls /docker-entrypoint-initdb.d/
exit
mongosh --version
mongosh mychatdb /docker-entrypoint-initdb.d/init-mongo.js
exit
mongosh admin --username root --password rootpassword /docker-entrypoint-initdb.d/init-mongo.js
mongosh --username root --password rootpassword
exit
