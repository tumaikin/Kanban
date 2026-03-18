# Канбан-доска для задач разработчика

Приложение для управления задачами разработчика в формате kanban-доски.

Текущая структура доски:

- `Идеи`
- `План`
- `В работе`
- `Готово`

## Стек

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase Database
- Supabase Auth

## Локальный запуск

```bash
npm install
npm run dev
```

## GitHub Pages

Проект настроен под публикацию по адресу:

```text
https://username.github.io/Kanban
```

Для этого в `vite.config.ts` уже задано:

```ts
base: '/Kanban/'
```

### Что нужно сделать на GitHub

1. Создай репозиторий `Kanban`
2. Запушь в него проект
3. В репозитории открой `Settings -> Pages`
4. В `Build and deployment` выбери `GitHub Actions`
5. В репозитории открой `Settings -> Secrets and variables -> Actions`
6. Добавь два секрета:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

7. Закоммить и запушь изменения в ветку `main`
8. GitHub Actions сам соберёт и задеплоит сайт

Workflow уже лежит здесь:

- `.github/workflows/deploy.yml`

### Если у тебя другая ветка

Сейчас workflow настроен на `main`.
Если используешь, например, `master`, замени это в `.github/workflows/deploy.yml`.

## Настройка Supabase

1. Создай проект в Supabase
2. В `Authentication -> Providers -> Email` включи `Email`
3. Если хочешь вход сразу после регистрации, отключи подтверждение email
4. Выполни SQL из `supabase/schema.sql`
5. Для GitHub Pages добавь в `Supabase -> Authentication -> URL Configuration`:

```text
Site URL:
https://username.github.io/Kanban
```

```text
Redirect URLs:
http://localhost:5173/**
https://username.github.io/Kanban/**
```

## Переменные окружения локально

Создай `.env` по примеру `.env.example`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Структура

- `src/components` — UI-компоненты
- `src/hooks` — состояние приложения и авторизация
- `src/lib` — клиент Supabase и API-слой
- `src/types` — типы задач и досок
- `src/utils` — фильтрация, сортировка, форматирование
- `src/data` — конфигурация колонок и демо-данные
- `supabase/schema.sql` — SQL-схема и RLS policy
- `.github/workflows/deploy.yml` — автодеплой на GitHub Pages
