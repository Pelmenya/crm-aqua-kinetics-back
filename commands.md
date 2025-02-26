### Новая миграция

docker exec crm-aqua-kinetics-back-dev npm run migration:create --name=TestMigration

### Запустить миграцию
docker exec crm-aqua-kinetics-back-dev npm run migration:run

### Откатить миграцию
docker exec crm-aqua-kinetics-back-dev npm run migration:revert
