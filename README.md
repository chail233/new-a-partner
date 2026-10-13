# 没有对象？new 一个！

用 Remotion 制作的面向对象编程科普短片（约 6 分 24 秒，1920×1080，30fps）。
把编程里的「对象」和恋爱里的「对象」联系起来，面向零基础观众，用 TypeScript 演示。
主角是女版小 Claude「小克」，程序员是原版小 Claude「阿码」。

## 章节

| # | 文件 | 内容 | 时长 |
|---|------|------|------|
| 开场 | `S01Intro.tsx` | 春节饭桌：「有对象了没？」→ `new` 一个 → 片名 | 20s |
| 01 | `S02Concept.tsx` | 什么是对象：特征与行为、OOP、类 = 模具 / 理想型 | 37s |
| 02 | `S03Class.tsx` | `class Partner`：属性、类型、注释，空白档案卡 | 36s |
| 03 | `S04New.tsx` | 构造函数、`this`、`new` 实例化，代码里的值飞进档案卡 | 43s |
| 04 | `S05Methods.tsx` | 方法与参数：`smile()`、`chat()`、`receiveGift()` 改变心情 | 43s |
| 05 | `S06Encapsulation.tsx` | 封装：`private` 秘密、报错、陪伴积累信任后解锁 | 46s |
| 06 | `S07Inheritance.tsx` | 继承：`Person` → `Partner`，父类 / 子类，兄弟类 | 42s |
| 07 | `S08Polymorphism.tsx` | 多态：诗人 / 程序员 / 厨师各自重写 `sayLove()` | 44s |
| 08 | `S09Recap.tsx` | 五个关键词复习卡片 | 24s |
| 尾声 | `S10Ending.tsx` | 没有哪个对象是 new 出来的 → 先 new 一个更好的自己 | 48s |

## 常用命令

```bash
npm install
npm run music      # 重新合成背景音乐和音效（改了场景时长后要重跑）
npm run dev        # 打开 Remotion Studio 预览
npm run render     # 输出 out/oop-love.mp4
node scripts/stills.mjs 4:792 6:1015   # 渲染指定「场景:帧」的预览图到 out/stills
```

## 结构

- `src/components/Clawdia.tsx`：角色（表情、配饰、手持物、虚线「未实例化」形态）
- `src/components/Code.tsx`：代码编辑器 / 控制台，逐行打字、语法高亮、标记与行高亮
- `src/components/ui.tsx`：字幕、章节外壳、气泡、爱心 / 星光特效、进度条、音效
- `scripts/make-audio.mjs`：用纯代码合成的 BGM（王道进行 lo-fi + 抒情尾声）和音效，无版权问题
- 字体取自系统自带的 Noto Sans SC / Noto Serif SC / Cascadia Code，放在 `public/fonts`
