# GPT Widget — Документация фронтенда (актуальная)

> Последнее обновление: май 2026
> Статус: в активной разработке

---

## Контекст проекта

**Продукт:** SaaS-платформа GPT Widget — конструктор AI-чат-ассистентов с базой знаний.
Владелец регистрируется, создаёт ассистентов, загружает базу знаний, вставляет виджет на сайт одним тегом `<script>`.

**Стек:** React 18, Vite, React Router v6. Никаких UI-библиотек — всё на inline-стилях.

**Шрифты:** Syne (заголовки, кнопки, цифры) + DM Sans (текст) + DM Mono (код, моноширинный)

**Дизайн-токены** (CSS-переменные, `src/styles/globals.css`):
```
--bg        #171b26   фон страницы
--surface   #141720   фон инпутов / левой панели авторизации
--card      #1e2333   фон карточек дашборда
--border    #1f2435   основная граница
--border-2  #2a3050   hover/активная граница
--text      #e2e6f0   основной текст
--muted     #4e5878   второстепенный текст
--subtle    #8890aa   подсказки
--accent    #4f7ef8   синий акцент
--accent-2  #7c5cf8   фиолетовый (градиент)
--green     #3ac97a   успех
--red       #f04f5e   ошибка / опасность
--amber     #f0a83a   предупреждение
--radius    16px      скругление карточек
```

---

## Бэкенд

**Admin API:** `http://localhost:8001/api/v1` (переменная `VITE_API_URL` в `.env`)
**Widget API:** `http://localhost:8000/api/v1` (фронт пока не использует напрямую)

### Готовые эндпоинты

| Метод | Путь | Авторизация | Описание |
|---|---|---|---|
| POST | `/clients/register` | — | Регистрация. Возвращает `api_key (sk-)` и `widget_key (pk-)` — один раз |
| POST | `/auth/login` | — | Логин. Возвращает JWT `access_token` (живёт 24ч) |
| GET | `/auth/me` | Bearer JWT | Данные текущего пользователя |
| POST | `/clients/api-key/regenerate` | Bearer JWT | Перевыпуск sk- |
| POST | `/clients/widget-key/regenerate` | Bearer JWT | Перевыпуск pk- |
| GET | `/credits/summary` | Bearer JWT | Токены, минуты, план, лимиты |
| GET | `/credits/history` | Bearer JWT | История запросов (`?limit=50&offset=0`) |
| POST | `/knowledge/upload` | Bearer JWT | Загрузить файл (PDF/TXT/DOCX) |
| POST | `/knowledge/url` | Bearer JWT | Индексировать URL |
| GET | `/knowledge/` | Bearer JWT | Список источников базы знаний |
| GET | `/knowledge/{id}` | Bearer JWT | Статус источника |
| GET | `/superadmin/metrics` | Bearer SUPERADMIN_SECRET | Метрики платформы |
| GET | `/superadmin/tenants` | Bearer SUPERADMIN_SECRET | Список тенантов |
| GET | `/superadmin/tenants/{id}` | Bearer SUPERADMIN_SECRET | Карточка тенанта |
| PATCH | `/superadmin/tenants/{id}` | Bearer SUPERADMIN_SECRET | Изменить plan / is_active |

### Эндпоинты которых ещё НЕТ (ждём бэкендера)

- `POST/GET/PATCH/DELETE /assistants` — CRUD ассистентов
- База знаний per-ассистент (привязка по `assistant_id`)
- `PATCH /auth/me` — смена имени, email, пароля

### Формат ошибок API

```json
{ "detail": "текст ошибки" }
{ "detail": [{ "msg": "текст", "loc": [...] }] }
```

Обрабатывается одинаково во всех `src/api/*.js` файлах через функцию `request()`.

---

## Полная структура проекта

```
gptwidget-auth/
├── index.html
├── vite.config.js            proxy /api → localhost:8001 (решает CORS при разработке)
├── package.json
├── .env.example              VITE_API_URL=http://localhost:8001/api/v1
├── FRONTEND_DOCS.md          этот файл
└── src/
    ├── main.jsx              точка входа React
    ├── App.jsx               роутер + все провайдеры
    ├── styles/
    │   └── globals.css       CSS-переменные, шрифты, анимации, scrollbar
    │
    ├── api/                  ТОЛЬКО fetch-запросы, никакой логики UI
    │   ├── auth.js           register, login, me
    │   ├── credits.js        summary, history
    │   └── superadmin.js     metrics, tenants, updateTenant
    │
    ├── store/
    │   ├── AuthContext.jsx         JWT + user, глобальный стейт авторизации
    │   └── SuperadminContext.jsx   SUPERADMIN_SECRET в sessionStorage
    │
    ├── hooks/
    │   ├── useAuthForm.js    useLogin(), useRegister() — логика форм
    │   └── useCredits.js     summary + history с API, экспортирует оба
    │
    ├── components/
    │   ├── Field.jsx         инпут: лейбл, иконка, ошибка, show/hide пароля
    │   ├── SubmitButton.jsx  кнопка с loading-спиннером
    │   ├── Toast.jsx         всплывашки через useToast()
    │   ├── KeysModal.jsx     модалка с sk-/pk- ключами после регистрации
    │   ├── LeftPanel.jsx     левая брендинг-панель на /auth
    │   ├── MeshCanvas.jsx    анимированный canvas-фон
    │   │
    │   ├── dashboard/
    │   │   ├── AppHeader.jsx          шапка дашборда
    │   │   ├── StatsGrid.jsx          4 карточки статистики
    │   │   ├── AssistantsGrid.jsx     карточки ассистентов + контекстное меню
    │   │   ├── CreateAssistantModal.jsx  создание в 2 шага
    │   │   ├── DeleteModal.jsx        подтверждение удаления
    │   │   ├── RightPanel.jsx         правая панель настроек виджета
    │   │   └── WidgetPreview.jsx      живой превью FAB + чат
    │   │
    │   ├── credits/
    │   │   ├── StatsRow.jsx     3 большие цифры вверху страницы
    │   │   ├── PlanCard.jsx     план с прогресс-барами
    │   │   ├── TokenChart.jsx   SVG-график за 14 дней
    │   │   └── HistoryTable.jsx таблица с фильтрами и пагинацией
    │   │
    │   └── superadmin/
    │       └── SuperadminHeader.jsx  шапка суперадминки
    │
    └── pages/
        ├── AuthPage.jsx        /auth
        ├── LoginPanel.jsx      форма входа
        ├── RegisterPanel.jsx   форма регистрации
        │
        ├── dashboard/
        │   ├── DashboardPage.jsx   /dashboard
        │   └── CreditsPage.jsx     /dashboard/credits
        │
        └── superadmin/
            ├── SuperadminLoginPage.jsx    /superadmin/login
            ├── SuperadminOverviewPage.jsx /superadmin
            ├── SuperadminTenantsPage.jsx  /superadmin/tenants
            └── SuperadminTenantPage.jsx   /superadmin/tenants/:id
```

---

## Маршруты (App.jsx)

```
/                          → редирект на /auth
/auth                      → AuthPage
/dashboard                 → DashboardPage        [PrivateRoute]
/dashboard/credits         → CreditsPage          [PrivateRoute]
/superadmin/login          → SuperadminLoginPage
/superadmin                → SuperadminOverviewPage
/superadmin/tenants        → SuperadminTenantsPage
/superadmin/tenants/:id    → SuperadminTenantPage
```

`PrivateRoute` проверяет `useAuth().user`. Суперадминка проверяет `useSuperadmin().secret`.

---

## Авторизация пользователя (AuthContext)

```js
const { user, token, loading, saveSession, logout } = useAuth();
```

При старте читает токен из `localStorage`, проверяет через `GET /auth/me`.
Если протух — чистит и редиректит на `/auth`.

`saveSession(token, user, remember)`:
- `remember=true` → `localStorage`
- `remember=false` → `sessionStorage`

---

## Авторизация суперадмина (SuperadminContext)

```js
const { secret, loading, error, login, logout } = useSuperadmin();
```

Секрет хранится в `sessionStorage` — слетает при закрытии вкладки.
Верификация через `GET /superadmin/metrics`. 401 → редирект на `/superadmin/login`.

---

## Toast

```js
const toast = useToast();
toast("Текст");               // info
toast("Ошибка", "error");     // красный
toast("Готово", "success");   // зелёный
```

`<Toast />` вставлен в каждую страницу. В новые страницы тоже добавлять.

---

## Запуск

```bash
# Бэкенд (держать запущенным)
docker compose up

# Фронтенд
cd gptwidget-auth
npm install
npm run dev
# → http://localhost:3000
```

Суперадминка: `http://localhost:3000/superadmin/login`
Секрет по умолчанию: `change-me-superadmin`

---

## Статус реализации

| Фича | Статус | Данные |
|---|---|---|
| Регистрация / логин | ✅ | Реальный API |
| Показ ключей после регистрации | ✅ | Реальный API |
| Дашборд — карточки ассистентов | ✅ | localStorage (нет API) |
| Создание / удаление / rename ассистентов | ✅ | localStorage (нет API) |
| Правая панель виджета | ✅ | Локальный стейт |
| Живой превью виджета | ✅ | Захардкожен |
| Кредиты — summary | ✅ | Реальный API |
| Кредиты — история | ✅ | Мок (нет данных) |
| Кредиты — график | ✅ | Мок (нет данных) |
| Суперадминка — вход | ✅ | Реальный API |
| Суперадминка — метрики | ✅ | Реальный API |
| Суперадминка — список тенантов | ✅ | Реальный API |
| Суперадминка — карточка тенанта | ✅ | Реальный API |
| Суперадминка — смена плана | ✅ | Реальный API |
| Суперадминка — блокировка | ✅ | Реальный API |

---

## Бэклог — что делать следующим

### 1. Контекстное меню ассистента (три точки)
**Файл:** `src/components/dashboard/AssistantsGrid.jsx`

Проблема: меню открывается по координатам клика мыши без учёта границ экрана — уходит за край.

Решение: позиционировать через `getBoundingClientRect()` кнопки, а не координаты мыши. Добавить проверку:
```js
const rect = btn.getBoundingClientRect();
const menuH = 200; // примерная высота меню
const top = rect.bottom + menuH > window.innerHeight
  ? rect.top - menuH   // открыть вверх
  : rect.bottom + 4;   // открыть вниз
const left = rect.right - 176; // выровнять по правому краю кнопки
```

---

### 2. Убрать моковые данные на странице кредитов
**Файлы:** `src/components/credits/TokenChart.jsx`, `src/components/credits/HistoryTable.jsx`

**TokenChart.jsx — что убрать:**
- Функцию `generateDays()` — она рисует случайные числа
- Заменить на реальную группировку `history` по полю `created_at` (уточнить формат у бэкендера)
- Пока история пустая — показывать пустой график с надписью "Нет данных за период"

**HistoryTable.jsx — что убрать:**
- Функцию `mockRows()` и её вызов в теле компонента
- Заменить на пустое состояние когда `history.length === 0`
- Уточнить у бэкендера точные названия полей: `session_id`, `event_type`, `amount`, `created_at`

**Тариф всегда показывает Free — почему:**
`useCredits()` вызывается при монтировании и кэширует результат. Если суперадмин поменял план — у пользователя на фронте данные не обновятся пока он не перезагрузит страницу.

Решение — добавить `refetch` при фокусе на вкладке:
```js
// в useCredits.js
useEffect(() => {
  const onFocus = () => fetchSummary();
  window.addEventListener('focus', onFocus);
  return () => window.removeEventListener('focus', onFocus);
}, [fetchSummary]);
```

---

### 3. Суперадминка — дропдаун смены плана обрезается
**Файл:** `src/pages/superadmin/SuperadminTenantsPage.jsx`

Проблема: дропдаун открывается вниз, если строка внизу таблицы — обрезается.

Решение: использовать `position: fixed` с вычислением позиции:
```js
const rect = btnRef.current.getBoundingClientRect();
const menuH = PLANS.length * 36;
const top = rect.bottom + menuH > window.innerHeight
  ? rect.top - menuH
  : rect.bottom + 4;
setMenuPos({ top, left: rect.left });
// в JSX: position: 'fixed', top: menuPos.top, left: menuPos.left
```

---

### 4. Суперадминка — хлебные крошки и навигация
**Создать:** `src/components/superadmin/Breadcrumbs.jsx`

Использовать `useLocation()` и `useParams()` для построения крошек:
```
/superadmin                    → Обзор
/superadmin/tenants            → Обзор / Тенанты
/superadmin/tenants/:id        → Обзор / Тенанты / {tenant.name}
```

Вставить компонент под `<SuperadminHeader />` на каждой странице суперадминки.

---

### 5. Суперадминка — подтверждение на каждое действие
**Создать:** `src/components/superadmin/ConfirmModal.jsx`

Универсальная модалка подтверждения. Вызывать перед любым действием:
- Смена плана (в таблице и на карточке)
- Блокировка / разблокировка тенанта

Интерфейс:
```js
// Хук
const confirm = useConfirm();

// Вызов
confirm({
  title: "Сменить план на Pro?",
  description: "Тенант получит 10 000 000 токенов в месяц.",
  confirmLabel: "Сменить план",
  danger: false,         // true — кнопка подтверждения красная
  onConfirm: () => changePlan(id, "pro"),
});
```

Реализация: стейт `{ open, config }` в провайдере или локально в каждой странице.

---

## Что делать когда появится API ассистентов

1. Создать `src/api/assistants.js`
2. Создать `src/hooks/useAssistants.js`
3. В `DashboardPage.jsx` заменить `useState(loadAssistants())` на `useAssistants()`
4. В `CreateAssistantModal.jsx` добавить API-вызов в `handleCreate`
5. Убрать `localStorage` логику

## Что делать когда появится API базы знаний per-ассистент

Создать `src/pages/dashboard/AssistantPage.jsx` по маршруту `/dashboard/assistant/:id`:
- Загрузка файлов, список источников, настройки ассистента

Добавить в `App.jsx`:
```jsx
<Route path="/dashboard/assistant/:id" element={<PrivateRoute><AssistantPage /></PrivateRoute>} />
```
