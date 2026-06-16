// ==================== 自定义配置区域 ====================
// 修改这里的内容来自定义你的礼物和弹窗

const CONFIG = {


    // ✅ 在这里自定义所有礼物，想改什么直接改这里
    gifts: [
        { id: 1, name: '🧸 小熊玩偶',     emoji: '🧸', rarity: 'common',    color: 0xd4956a },
        { id: 2, name: '💌 专属信件',      emoji: '💌', rarity: 'rare',      color: 0xff6b9d },
        { id: 3, name: '🌸 樱花香水',      emoji: '🌸', rarity: 'rare',      color: 0xffb7c5 },
        { id: 4, name: '🎀 蝴蝶结发饰',   emoji: '🎀', rarity: 'common',    color: 0xff69b4 },
        { id: 5, name: '🍰 草莓蛋糕券',   emoji: '🍰', rarity: 'common',    color: 0xff8fa3 },
        { id: 6, name: '💎 友谊水晶',      emoji: '💎', rarity: 'legendary', color: 0x88eeff },
        { id: 7, name: '🌙 星空音乐盒',   emoji: '🌙', rarity: 'legendary', color: 0x9b7fcc },
        { id: 8, name: '🦋 彩虹棒棒糖',   emoji: '🦋', rarity: 'common',    color: 0xffdd44 },
        { id: 9, name: '📸 合照相框',      emoji: '📸', rarity: 'rare',      color: 0xffd700 },
        { id: 10,name: '🎵 专属歌单',      emoji: '🎵', rarity: 'rare',      color: 0xa8edea },
    ],

    // 稀有度显示配置
    rarityConfig: {
        common:    { label: '普通',   color: '#aaaaaa', chance: 0.60 },
        rare:      { label: '稀有',   color: '#4fc3f7', chance: 0.30 },
        legendary: { label: '传说',   color: '#ffd700', chance: 0.10 },
    } ,
    

    // 摩天轮弹窗配置
    ferrisWheel: {
        title: "浪漫摩天轮 🎡",
        image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=400",
        description: "在最高点，我想和你一起俯瞰这个世界，感受属于我们的浪漫",
        message: "每一次旋转，都是我们的美好回忆 🎡"
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
            url: 'images/beijing.JPG',
            title: '北京 💕'
        },
        {
            url: 'images/daban.JPG',
            title: '一起看的日落 🌅'
        },
        {
            url: 'images/IMG_1065.JPG',
            title: '生日快乐 🎂'
        },
        {
            url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
            title: '旅行的回忆 ✈️'
        },
        {
            url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
            title: '最美的笑容 😊'
        },
        {
            url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
            title: '永远在一起 💑'
        }
    ]
};
