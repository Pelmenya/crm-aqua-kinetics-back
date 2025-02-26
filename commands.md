# Миграции

## Новая миграция

```bash

docker exec crm-aqua-kinetics-back-dev npm run migration:create --name=TestMigration
```

## Запустить миграцию

```bash
docker exec crm-aqua-kinetics-back-dev npm run migration:run
```

## Откатить миграцию

```bash
docker exec crm-aqua-kinetics-back-dev npm run migration:revert
```
