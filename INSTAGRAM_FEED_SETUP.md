# Налаштування Instagram Feed для стрічки

## Поточний стан
Стрічка Instagram налаштована для відображення зображень з профілю @125ovmbr. Зараз використовуються placeholder зображення.

## Варіанти підключення реальних зображень

### Варіант 1: Instagram Graph API (Рекомендовано)
1. Створіть Facebook Developer аккаунт
2. Створіть новий додаток на https://developers.facebook.com/
3. Додайте Instagram Basic Display продукт
4. Отримайте Access Token для вашого Instagram акаунту
5. Оновіть функцію `fetchInstagramImages()` в `index.html`:

```javascript
async function fetchInstagramImages() {
    const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';
    const response = await fetch(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,thumbnail_url&access_token=${ACCESS_TOKEN}&limit=12`);
    const data = await response.json();
    return data.data
        .filter(post => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM')
        .map(post => ({
            url: post.media_url || post.thumbnail_url,
            link: post.permalink
        }));
}
```

### Варіант 2: Backend Proxy (Найбезпечніше)
Створіть endpoint на вашому backend сервері:

```javascript
// backend/src/routes/instagram.js
app.get('/api/instagram-feed', async (req, res) => {
    try {
        const response = await fetch(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,thumbnail_url&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}&limit=12`);
        const data = await response.json();
        res.json({ images: data.data.map(...) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

Потім оновіть `fetchInstagramImages()`:
```javascript
const response = await fetch('/api/instagram-feed');
const data = await response.json();
return data.images;
```

### Варіант 3: Сторонні сервіси
- **Juicer.io** - безкоштовний план до 15 постів
- **SnapWidget** - безкоштовний план
- **Elfsight Instagram Feed** - платний сервіс

### Варіант 4: Ручне оновлення
Якщо у вас немає доступу до API, можна вручну оновити масив `getFallbackImages()` з реальними URL зображень з Instagram профілю.

## Примітки
- Instagram Basic Display API був закритий у грудні 2024
- Використовуйте Instagram Graph API з Facebook Login
- Access Token потрібно оновлювати періодично
- Не зберігайте Access Token у фронтенд коді - використовуйте backend proxy
