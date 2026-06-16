// ==================== 自定义配置区域 ====================
// 修改这里的内容来自定义你的礼物和弹窗

const CONFIG = {


    // ✅ 在这里自定义所有礼物，想改什么直接改这里
    gifts: [
        { id: 1, name: '🌟🌟 黑珍珠二星摘摘',     emoji: '🌟🌟', rarity: 'common',    color: 0xd4956a },
        { id: 2, name: '💌 一封信（7月来信）',      emoji: '💌', rarity: 'rare',      color: 0xff6b9d },
        { id: 3, name: '🌸 生日花花',      emoji: '🌸', rarity: 'common',      color: 0xffb7c5 },
        { id: 4, name: '🎀 LULU发抓抓',   emoji: '🎀', rarity: 'rare',    color: 0xff69b4 },
        { id: 5, name: '🍰 catcatcatCake',   emoji: '🍰', rarity: 'common',    color: 0xff8fa3 },
        { id: 6, name: '📱iphone18pm兑换卡',      emoji: '💎', rarity: 'legendary', color: 0x88eeff },
        { id: 7, name: '⛺️万石坞露营游',   emoji: '🌙', rarity: 'legendary', color: 0x9b7fcc },
        { id: 8, name: '📖手账本',   emoji: '📖', rarity: 'common',    color: 0xffdd44 },
        { id: 9, name: '👗亚朵睡衣',      emoji: '👗', rarity: 'rare',      color: 0xffd700 },
        { id: 10,name: '💆爱情故事',      emoji: '💆', rarity: 'rare',      color: 0xa8edea },
    ],

    // 稀有度显示配置
    rarityConfig: {
        common:    { label: '小意思',   color: '#6dd444', chance: 0.60 },
        rare:      { label: '小巧思',   color: '#4fc3f7', chance: 0.30 },
        legendary: { label: '大女皇',   color: '#ffd700', chance: 0.10 },
    } ,
    

    // 摩天轮弹窗配置
    ferrisWheel: {
        title: "幸福摩天轮 🎡",
        image: "images/mtl.jpg",
        description: "生活里的高点低点都美的不只一点",
        message: " 日子转呀转，我在你身边🎡"
    },

    // 跟随距离（数字越大跟随距离越远）
    followDistance: {
        followerGirl: 3.5,
        dog: 5.0
    },

    // 跟随速度
    followSpeed: {
        followerGirl: 0.07,
        dog: 0.06
    },

    // 背景音乐（修复：换一个可用的链接）
    music: {
        // 使用 freesound.org 的免费音乐（无需登录）
        url: "https://freesound.org/data/previews/320/320655_5260872-lq.mp3",
        volume: 0.2
    },
    
    // 照片墙配置（新增）
    photos: [
        {
            url: 'images/birth1.JPG',
            title: '2022，粉粉女孩💕'
        },
        {
            url: 'images/birth2.JPG',
            title: '2023，变成了一个姐姐'
        },
        {
            url: 'images/jinian.jpg',
            title: '2024，2🎆'
        },
        {
            url: 'images/2025.jpg',
            title: '2025，留在牌桌的大女人'
        },
        {
            url: 'images/2026.jpg',
            title: '2026，跨了4个年咯'
        },
        {
            url: 'images/2026love.jpg',
            title: '发发发，未完待续 💑'
        }
    ]
};
