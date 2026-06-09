// Traditional Chinese (Taiwan) messages — mirrors the en-US key structure.
// Proper nouns from the mock data (event/session/add-on names) stay as-is.
export default {
  app: {
    title: '活動報名',
    language: '語言',
  },
  nav: {
    back: '上一步',
    next: {
      sessions: '下一步:選擇議程',
      addons: '下一步:加購項目',
      review: '下一步:確認',
    },
    submit: '送出報名',
  },
  steps: {
    attendee: { label: '報名資料' },
    sessions: { label: '議程' },
    addons: { label: '加購' },
    review: { label: '確認' },
  },
  ticket: {
    sectionTitle: '選擇票種',
    selected: '已選擇',
  },
  attendee: {
    sectionTitle: '報名者資料',
    fullName: { label: '姓名', placeholder: '請輸入您的姓名' },
    email: { label: '電子郵件', placeholder: '請輸入您的電子郵件' },
    phone: { label: '電話', placeholder: '請輸入您的電話號碼' },
    company: { label: '公司', placeholder: '請輸入您的公司名稱' },
    jobTitle: { label: '職稱', placeholder: '請輸入您的職稱' },
    shippingAddress: {
      label: '寄送地址',
      optional: '(選填)',
      placeholder: '請輸入您的寄送地址',
      required: '購買周邊商品時需填寫寄送地址',
    },
  },
  sessions: {
    sectionTitle: '選擇議程',
    selectedCount: '尚未選擇議程 | 已選擇 {count} 場議程 | 已選擇 {count} 場議程',
    spotsLeft: '剩 {count} 個名額 | 剩 {count} 個名額',
    soldOut: '已額滿',
    conflict: '與另一個已選議程時間衝突',
    conflictNotice: '部分已選議程時間重疊 — 請在每組標示的衝突中取消一個議程以繼續。',
  },
  addons: {
    sectionTitle: '選擇加購項目',
    tabs: {
      workshop: '工作坊',
      meal: '餐點方案',
      merchandise: '周邊商品',
    },
    spotsRemaining: '剩 {count} 個名額 | 剩 {count} 個名額',
    soldOut: '已額滿',
    unavailable: '無法選擇 — 與已選議程時間衝突',
    workshopConflict: '此工作坊與您在步驟 2 選擇的議程時間衝突,因此無法選擇。已加入的工作坊已自動從您的訂單中移除。',
    added: '已加入訂單',
    size: '尺寸:',
    selectSize: '請選擇',
    qty: '數量:',
    qtyDecrease: '減少數量',
    qtyIncrease: '增加數量',
    max: '上限 {count}',
    banner: {
      title: '寄送資訊',
      text: '周邊商品將於會議前一週寄送至您的地址。請確認步驟 1 的寄送地址正確無誤。',
    },
    summary: {
      title: '訂單摘要',
      ticket: '{name} 票',
      workshopDiscount: '工作坊折扣 (VIP 9 折)',
      total: '總計',
      empty: '尚未選擇任何項目。',
    },
  },
  review: {
    title: '確認您的報名',
    edit: '編輯 → 步驟 {step}',
    banner: {
      title: '送出前請修正以下錯誤',
      line: '步驟 {step}:{message}',
    },
    required: '— (必填)',
    notSelected: '未選擇',
    sections: {
      attendee: '報名者資料',
      sessions: '已選議程',
      addons: '加購項目',
    },
    fields: {
      name: '姓名',
      email: '電子郵件',
      phone: '電話',
      company: '公司',
      jobTitle: '職稱',
      ticketType: '票種',
    },
    empty: {
      sessions: '尚未選擇議程',
      addons: '尚未選擇加購項目',
    },
    categories: {
      workshop: '工作坊',
      meal: '餐點方案',
      merchandise: '周邊商品',
    },
    pricing: {
      title: '費用明細',
      ticket: '{name} 票',
      workshopDiscount: '工作坊折扣 (VIP 9 折)',
      total: '總計',
    },
    errors: {
      fullName: '請填寫姓名',
      emailRequired: '請填寫電子郵件',
      emailInvalid: '請輸入有效的電子郵件',
      phoneRequired: '請填寫電話號碼',
      phoneInvalid: '請輸入有效的電話號碼',
      company: '請填寫公司名稱',
      jobTitle: '請填寫職稱',
      ticketType: '請選擇票種',
      shipping: '購買周邊商品時需填寫寄送地址',
      sessionConflict: '已選議程之間有時間衝突',
      addonSize: '請為已選的周邊商品選擇尺寸',
    },
  },
  success: {
    title: '報名完成!',
    confirmation: '確認編號 #{code}',
    message: '感謝您報名 {event}。確認信將寄送至 {email}。',
    backHome: '返回首頁',
  },
  // Translations for the mock "content" (keyed by entity id). Personal names,
  // company names, the event name, and tech/brand terms are kept in English.
  // Consumed by useCatalog(); en-US needs no equivalent (it falls back to the
  // mock data, which is already English).
  data: {
    tickets: {
      general: {
        name: '一般',
        description: '可參加所有議程與主題演講',
        perks: ['所有議程', '主題演講入場', '含午餐'],
      },
      vip: {
        name: 'VIP',
        description: '尊榮體驗與專屬禮遇',
        perks: ['所有議程', '主題演講入場', '含午餐', 'VIP 貴賓室', '講者見面會', '工作坊 9 折'],
      },
      student: {
        name: '學生',
        description: '憑有效學生證享優惠價',
        perks: ['所有議程', '主題演講入場'],
      },
    },
    tracks: {
      main: '主議程',
      frontend: '前端',
      backend: '後端',
      devops: 'DevOps',
    },
    sessions: {
      s1: { title: '開場主題演講:網頁平台的未來', speakerTitle: '工程副總,WebCorp' },
      s2: { title: 'Vue.js 進階模式', speakerTitle: '核心團隊,Vue.js' },
      s3: { title: '用 Node.js 打造可擴展的 API', speakerTitle: '資深工程師,CloudScale' },
      s4: { title: '現代 CSS:超越 Tailwind', speakerTitle: '設計系統負責人,DesignLab' },
      s5: { title: '資料庫效能調校', speakerTitle: '資料庫管理員,DataForge' },
      s6: { title: '真正能用的 CI/CD 流水線', speakerTitle: 'DevOps 架構師,ShipFast' },
      s7: { title: '第二天主題演講:AI 輔助開發', speakerTitle: '技術長,CodeAssist AI' },
      s8: { title: '2028 年的狀態管理', speakerTitle: '高級工程師,FrontEnd Co' },
      s9: { title: '微服務通訊模式', speakerTitle: '架構師,ScaleUp Inc' },
      s10: { title: '前端應用的可觀測性', speakerTitle: '監控負責人,ObserveAll' },
      s11: { title: '無障礙設計深入解析', speakerTitle: '無障礙專家,InclusiveWeb' },
      s12: { title: '使用 Cloudflare Workers 的邊緣運算', speakerTitle: '開發者推廣,Cloudflare' },
    },
    addons: {
      ws1: {
        name: 'Vue.js 實作測試',
        description: '使用 Vitest 與 Vue Test Utils 撰寫單元與元件測試。請自備筆電。',
      },
      ws2: {
        name: '前端開發者的 Docker 與 Kubernetes',
        description: '將你的應用容器化,並從零部署到 Kubernetes。',
      },
      meal1: { name: '標準午餐(兩日)', description: '自助式午餐,提供素食與全素選項。' },
      meal2: {
        name: '尊榮晚宴 — 第一天交流活動',
        description: '頂樓場地三道式晚宴,含開放式吧台與現場音樂。',
      },
      merch1: { name: '大會 T 恤', description: '100% 有機棉,WebDev Summit 2028 紀念版。' },
      merch2: { name: '開發者貼紙包', description: '12 張鐳射全像開發者貼紙組。' },
      merch3: { name: '保溫水瓶', description: '不鏽鋼,500 毫升,雷射雕刻標誌。' },
      merch4: { name: '筆電保護套(15 吋)', description: '附大會品牌的氯丁橡膠保護套。' },
    },
  },
}
