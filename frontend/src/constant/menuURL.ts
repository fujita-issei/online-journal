interface MenuURL {
    menu: string;
    url : string;
}

const menuURL: MenuURL[] = [
    { menu: "ホーム", url : "/"},
    { menu: "ジャーナルを作成", url : "/createJournal" },
    { menu: "ルーティーンを作成", url : "/createRoutine" },
    { menu: "禁止リストを作成", url : "/createNGList"},
    { menu: "過去のジャーナルを見る", url: "/watchPastJournal"},
    { menu: "サマリーを見る", url : "/watchSummary"},
    { menu: "プロフィール", url : "/profile"},
    { menu: "投稿", url: "/post"},
    { menu: "検索", url: "/search"},
    { menu: "通知", url: "/notice"},
    { menu: "フレンドリスト", url : "/friendsList"},
    { menu: "メッセージ", url : "/message"},    
    { menu: "保存した投稿", url : "/saved"},
    { menu: "設定", url: "/setting"},
    { menu: "使い方ガイド", url : "/guide"},
    { menu: "お問い合わせフォーム", url : "/form"}
]

export default menuURL