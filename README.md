# SKINZ Subtitle Archive — GitHub Pages 2.2.2

這份資料夾只包含公開網站。沒有登入、訪客統計或新增影片頁面。

## 重新上傳

1. 將壓縮檔解壓縮。
2. 把裡面所有檔案與資料夾上傳到 GitHub repository 根目錄。
3. 到 **Settings → Pages**，將 **Source** 設為 **GitHub Actions**。
4. 到 **Actions** 查看 `Deploy SKINZ Subtitle Archive`；綠色完成後約等 1–3 分鐘再開網站。

每次替換 `data/videos.json` 並 Commit，GitHub Actions 都會自動建立首頁與每部影片的獨立網址：

`https://shysssiee.github.io/SKINZ_Subtitle_Archive/video/影片ID/`

建置時也會自動產生輕量的 `data/videos-index.json`，首頁不必下載完整字幕；每部影片的字幕只會在進入該影片頁後載入。請勿手動修改這些自動產生的檔案。

## 新增及管理影片

請使用另一個壓縮檔「SKINZ_Local_Video_Admin_v2.2」。它只留在自己的電腦，不要上傳 GitHub。

1. 雙擊管理工具的 `index.html`。
2. 匯入本網站 `data/videos.json`。
3. 新增、編輯或刪除影片。
4. 匯出新的 `videos.json`。
5. 替換 GitHub 上的 `data/videos.json` 並 Commit。

## 問題回報表單

打開 `assets/config.js`，將 Google 表單分享網址填入 `reportFormUrl` 的引號內。

## 評分

目前星星只保存在每位訪客自己的瀏覽器，不會顯示公開平均或人數；之後接上資料庫即可升級。

## 播放限制

部分 YouTube 影片由官方關閉外部嵌入，這類影片無法在網站內播放，但仍可讀字幕並點按鈕前往官方頁面。
