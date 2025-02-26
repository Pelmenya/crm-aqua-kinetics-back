# Инфо и комманды

## Адрес для pgAdmin

```clip
host.docker.internal
```

## Старт приложения в Docker

```clip
docker compose -f docker-compose.dev.yml up --build
```

## Миграции

### Новая миграция

```bash

docker exec crm-aqua-kinetics-back-dev npm run migration:create --name=TestMigration
```

### Запустить миграцию

```bash
docker exec crm-aqua-kinetics-back-dev npm run migration:run
```

### Откатить миграцию

```bash
docker exec crm-aqua-kinetics-back-dev npm run migration:revert
```
