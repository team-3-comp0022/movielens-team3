# movielens-team3

To run:
### `docker-compose up -d --build`

The frontend can be accessed locally:
### http://localhost:3000/

To stop:
### `docker-compose stop`

To create a DB backup, run the following two commands:
### docker exec movielens-team3_db_1 /usr/bin/mysqldump -u root --password=example films > backup/backup_db.sql

### cat backup.sql | docker exec -i movielens-team3_db_1 /usr/bin/mysql -u {DB_USER} --password={DB_PASSWORD} films