export default {
  async scheduled(event, env, ctx) {
    // 由於 Cloudflare Worker 單次執行時間限制（Paid 方案的計時事件通常上限為 30 秒）
    // 這裡設計每次觸發執行 25 秒，每秒發送 10 個請求
    const durationSeconds = 25;
    const requestsPerSecond = 10;
    
    const url = "https://vud.xio78.shop/api/chat/visitor/submitUserForm";
    
    const sendRequest = async () => {
      // 隨機生成 8 位數字 (50000000 到 99999999 之間)
      const randomPhone = Math.floor(50000000 + Math.random() * 90000000).toString();
      
      const payload = {
        userId: "d6ce8434a86b44a3aee15bcc46d208cd",
        userName: "",
        phone: randomPhone,
        email: "",
        formParams: '[{"name":"微信","key":"weixin","show":false,"require":false,"value":""},{"name":"备注","key":"remark","show":false,"require":false,"value":""}]'
      };

      try {
        await fetch(url, {
          method: "POST",
          headers: {
            "Host": "vud.xio78.shop",
            "Connection": "keep-alive",
            "sec-ch-ua-platform": "\"Android\"",
            "User-Agent": "Mozilla/5.0 (Linux; Android 16; 2510DPC44G Build/BP2A.250605.031.A3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.8059.43 Mobile Safari/537.36",
            "Accept": "application/json",
            "sec-ch-ua": "\"Android WebView\";v=\"155\", \"Chromium\";v=\"155\", \"Not(A:Brand\";v=\"24\"",
            "Content-Type": "application/json;charset=UTF-8",
            "sec-ch-ua-mobile": "?1",
            "Origin": "https://vud.xio78.shop",
            "X-Requested-With": "mark.via.gp",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Referer": "https://vud.xio78.shop/chat/index?channelId=d7b4e6a1f8c24b93a0e5d9f8c7b6a5e4&isBack=true",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7"
          },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        // 忽略單次請求網路波動錯誤
      }
    };

    const promises = [];

    for (let i = 0; i < durationSeconds; i++) {
      const secondStart = Date.now();
      const batch = [];
      
      for (let j = 0; j < requestsPerSecond; j++) {
        batch.push(sendRequest());
      }
      
      promises.push(Promise.all(batch));

      // 控制每秒發送的間隔
      const elapsed = Date.now() - secondStart;
      if (elapsed < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
      }
    }

    await Promise.all(promises);
  }
};
