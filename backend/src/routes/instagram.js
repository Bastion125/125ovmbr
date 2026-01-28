const express = require('express');
const router = express.Router();

// Кеш для Instagram зображень
const instagramCache = new Map();
const CACHE_TTL = 3600000; // 1 година в мілісекундах

/**
 * Очищення застарілого кешу
 */
function cleanCache() {
    const now = Date.now();
    for (const [key, value] of instagramCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
            instagramCache.delete(key);
        }
    }
}

// Очищаємо кеш кожні 30 хвилин
setInterval(cleanCache, 1800000);

/**
 * GET /api/instagram-feed
 * Отримує останні пости з Instagram профілю
 * 
 * Для використання потрібно:
 * 1. Налаштувати Instagram Graph API
 * 2. Додати INSTAGRAM_ACCESS_TOKEN до .env
 * 3. Отримати Access Token через Facebook Developer Console
 * 
 * Використовує кешування на 1 годину для оптимізації
 */
router.get('/feed', async (req, res) => {
    const cacheKey = 'instagram-feed';
    const cached = instagramCache.get(cacheKey);
    
    // Перевіряємо кеш
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json({
            success: true,
            images: cached.data,
            count: cached.data.length,
            cached: true
        });
    }
    try {
        const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
        
        if (!INSTAGRAM_ACCESS_TOKEN) {
            // Якщо токен не налаштований, повертаємо порожній масив
            // Фронтенд використає fallback зображення
            return res.json({ 
                success: false, 
                message: 'Instagram access token not configured',
                images: []
            });
        }
        
        // Отримуємо медіа з Instagram Graph API
        const response = await fetch(
            `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,thumbnail_url,caption&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=12`
        );
        
        if (!response.ok) {
            throw new Error(`Instagram API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Перевіряємо чи є дані
        if (!data.data || !Array.isArray(data.data)) {
            return res.json({
                success: false,
                message: 'No media data received from Instagram',
                images: []
            });
        }
        
        // Фільтруємо тільки зображення та каруселі, валідуємо URL
        const images = data.data
            .filter(post => {
                // Перевіряємо тип медіа та наявність URL
                const hasValidType = post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM';
                const hasValidUrl = post.media_url || post.thumbnail_url;
                return hasValidType && hasValidUrl;
            })
            .map(post => ({
                url: post.media_url || post.thumbnail_url || '',
                link: post.permalink || '',
                caption: post.caption || '',
                id: post.id || ''
            }))
            .filter(img => img.url && img.url.trim()); // Видаляємо зображення без URL
        
        // Зберігаємо в кеш
        instagramCache.set(cacheKey, {
            data: images,
            timestamp: Date.now()
        });
        
        res.json({
            success: true,
            images: images,
            count: images.length,
            cached: false
        });
        
    } catch (error) {
        console.error('Error fetching Instagram feed:', error);
        
        // Якщо є закешовані дані, повертаємо їх навіть якщо вони застарілі
        const cached = instagramCache.get(cacheKey);
        if (cached && cached.data && cached.data.length > 0) {
            return res.json({
                success: true,
                images: cached.data,
                count: cached.data.length,
                cached: true,
                warning: 'Using cached data due to API error'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Instagram feed',
            error: error.message,
            images: []
        });
    }
});

module.exports = router;
