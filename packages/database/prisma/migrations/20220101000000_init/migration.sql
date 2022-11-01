-- タイムゾーンを設定
ALTER DATABASE postgres SET timezone TO 'Asia/Tokyo';

-- 反映
SELECT pg_reload_conf();
