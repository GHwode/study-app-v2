// ==================== 电子课本 ====================
// 课本电子化：知识点讲解 + 核心示例 + 总结提炼
const Textbook = {
    // 课本数据 — 按学科/年级/单元组织
    // 格式：lessons[subject][grade][unitIndex] = { title, knowledgePoints: [{title, content, examples: [{title, content, analysis}], summary}] }
    lessons: {},

    // 注册课本章节
    register(subject, grade, units) {
        if (!this.lessons[subject]) this.lessons[subject] = {};
        this.lessons[subject][grade] = units;
    },

    // 获取某年级所有单元
    getUnits(subject, grade) {
        return this.lessons[subject]?.[grade] || [];
    },

    // 渲染单元列表
    renderUnits(subject, grade) {
        const container = document.getElementById('page-textbook');
        if (!container) return;

        const units = this.getUnits(subject, grade);
        const sName = SUBJECTS[subject]?.name || subject;
        const gradeLabel = GRADE_NAMES[grade];

        let html = '';
        html += '<div class="breadcrumb">';
        html += '<a onclick="App.showPage(\'home\')">🏠 首页</a> › ';
        html += '<a onclick="App.selectSubject(\'' + subject + '\')">' + (SUBJECTS[subject]?.icon||'') + ' ' + sName + '</a> › ';
        html += '<span>' + gradeLabel + ' 电子课本</span>';
        html += '</div>';

        html += '<div class="card"><div class="card-title">📖 ' + gradeLabel + sName + ' 电子课本</div>';
        html += '<p class="subtitle">按单元学习：知识点讲解 → 核心例题 → 总结提炼</p>';

        if (units.length === 0) {
            html += '<div class="empty-state"><div class="icon">📭</div><p>该年级课本内容正在编制中</p></div>';
        } else {
            html += '<div class="grid grid-3">';
            units.forEach((u, i) => {
                html += '<div class="teach-action-card" onclick="Textbook.renderLesson(\'' + subject + '\',' + grade + ',' + i + ')">';
                html += '<div class="icon">' + (u.icon || '📕') + '</div>';
                html += '<div class="label">' + u.title + '</div>';
                html += '<div style="font-size:0.75rem;color:var(--text-secondary);margin-top:0.3rem">' + (u.knowledgePoints?.length || 0) + ' 个知识点</div>';
                html += '</div>';
            });
            html += '</div>';
        }

        html += '</div>';
        container.innerHTML = html;
    },

    // 渲染单个课时（知识点+例题+总结）
    renderLesson(subject, grade, unitIndex) {
        const container = document.getElementById('page-textbook');
        if (!container) return;

        const units = this.getUnits(subject, grade);
        const unit = units[unitIndex];
        if (!unit) return;

        const sName = SUBJECTS[subject]?.name || subject;
        const gradeLabel = GRADE_NAMES[grade];

        let html = '';
        html += '<div class="breadcrumb">';
        html += '<a onclick="App.showPage(\'home\')">🏠 首页</a> › ';
        html += '<a onclick="App.selectSubject(\'' + subject + '\')">' + sName + '</a> › ';
        html += '<a onclick="Textbook.renderUnits(\'' + subject + '\',' + grade + ')">' + gradeLabel + ' 课本</a> › ';
        html += '<span>' + unit.title + '</span>';
        html += '</div>';

        html += '<div class="card"><div class="card-title">' + unit.icon + ' ' + unit.title + '</div>';

        if (!unit.knowledgePoints || unit.knowledgePoints.length === 0) {
            html += '<div class="empty-state"><div class="icon">📭</div><p>本单元暂无内容</p></div>';
        } else {
            unit.knowledgePoints.forEach((kp, ki) => {
                html += '<div class="knowledge-point">';
                html += '<h4>' + (ki + 1) + '. ' + kp.title + '</h4>';

                // 知识点讲解
                if (kp.content) {
                    html += '<p style="margin:0.5rem 0;line-height:2">' + kp.content + '</p>';
                }

                // 核心示例
                if (kp.examples && kp.examples.length > 0) {
                    html += '<div style="margin-top:0.8rem">';
                    html += '<div style="font-weight:700;color:var(--primary);margin-bottom:0.5rem;font-size:0.9rem">📌 核心示例</div>';
                    kp.examples.forEach((ex, ei) => {
                        html += '<div style="border:1px solid var(--border);padding:1rem;margin-bottom:0.6rem;background:#fafafa">';
                        html += '<div style="font-weight:700;margin-bottom:0.4rem;font-size:0.9rem">例' + (ei + 1) + '：' + ex.title + '</div>';
                        html += '<div style="font-size:0.9rem;margin-bottom:0.4rem">' + ex.content + '</div>';
                        if (ex.analysis) {
                            html += '<div class="tip">💡 ' + ex.analysis + '</div>';
                        }
                        html += '</div>';
                    });
                    html += '</div>';
                }

                // 总结
                if (kp.summary) {
                    html += '<div style="margin-top:0.6rem;padding:0.6rem;background:#fdedec;border-left:3px solid var(--primary);font-size:0.88rem">';
                    html += '<strong>📝 总结：</strong>' + kp.summary;
                    html += '</div>';
                }

                html += '</div>';
            });
        }

        // 单元总结
        if (unit.summary) {
            html += '<div style="margin-top:1.5rem;padding:1rem;background:#fef9e7;border:1px solid #f9e79f">';
            html += '<div style="font-weight:700;color:#7d6608;margin-bottom:0.3rem">📋 本单元总结</div>';
            html += '<p style="font-size:0.9rem;line-height:1.8">' + unit.summary + '</p>';
            html += '</div>';
        }

        // 导航按钮
        html += '<div style="display:flex;gap:0.6rem;margin-top:1.2rem;flex-wrap:wrap">';
        if (unitIndex > 0) {
            html += '<button class="btn btn-outline" onclick="Textbook.renderLesson(\'' + subject + '\',' + grade + ',' + (unitIndex - 1) + ')">← 上一单元</button>';
        }
        if (unitIndex < units.length - 1) {
            html += '<button class="btn btn-outline" onclick="Textbook.renderLesson(\'' + subject + '\',' + grade + ',' + (unitIndex + 1) + ')">下一单元 →</button>';
        }
        html += '<button class="btn btn-primary" onclick="Textbook.startQuizFromLesson(\'' + subject + '\',' + grade + ',' + unitIndex + ')">🎯 本单元练习</button>';
        html += '<button class="btn btn-outline" onclick="Textbook.renderUnits(\'' + subject + '\',' + grade + ')">返回单元列表</button>';
        html += '</div>';

        html += '</div>';
        container.innerHTML = html;
    },

    // 从课本跳转到答题
    startQuizFromLesson(subject, grade, unitIndex) {
        // 先切换到 quiz 页面，稍后可扩展为按单元筛选题目
        App.showPage('home');
        showToast('💡 提示：可在综合练习中选择对应单元题目');
    },

    // ===== 预置课本数据 =====
    initDefaultData() {
        // ---- 数学 示例 ----
        const mathData = {
            1: [
                {
                    title: '数的认识',
                    icon: '🔢',
                    knowledgePoints: [
                        {
                            title: '10以内的数',
                            content: '1、2、3、4、5、6、7、8、9、10 是我们最先认识的数。每个数都表示物体的个数。<br>• 数数：一个一个地数，1, 2, 3, ..., 10<br>• 比大小：3 < 5，表示 3 比 5 少',
                            examples: [
                                { title: '数一数', content: '树上有3只鸟，又飞来2只，现在一共有几只？', analysis: '3 + 2 = 5（只），用加法计算总数' },
                                { title: '比大小', content: '在 ○ 里填上 >、< 或 = ：5 ○ 3，7 ○ 7', analysis: '5 > 3（5比3大），7 = 7（相等）' }
                            ],
                            summary: '掌握1-10的读写和大小比较，能用数表示物体的个数。'
                        },
                        {
                            title: '加法的意义',
                            content: '加法就是把两个（或多个）数合并成一个数的运算。<br>• 符号：＋<br>• 读作："加"<br>• 例：3 + 2 = 5 读作"3加2等于5"',
                            examples: [
                                { title: '看图列式', content: '左边有4个苹果，右边有3个苹果，一共有多少个？', analysis: '4 + 3 = 7（个），把两部分合起来用加法' }
                            ],
                            summary: '加法用于"合并"场景，记住：合起来用加法。'
                        },
                        {
                            title: '减法的意义',
                            content: '减法就是从一个数里去掉一部分，求还剩多少的运算。<br>• 符号：－<br>• 读作："减"<br>• 例：5 － 2 = 3 读作"5减2等于3"',
                            examples: [
                                { title: '简单应用', content: '盘子里有6个梨，吃掉2个，还剩几个？', analysis: '6 － 2 = 4（个），去掉部分用减法' }
                            ],
                            summary: '减法用于"去掉"或"剩下"场景，记住：去掉了用减法。'
                        }
                    ],
                    summary: '本单元认识了1-10的数，学会了加法和减法的基本含义。加法是"合起来"，减法是"去掉"。'
                },
                {
                    title: '图形与位置',
                    icon: '📐',
                    knowledgePoints: [
                        {
                            title: '认识基本图形',
                            content: '• 长方形：长长方方的，有4条边<br>• 正方形：四条边都一样长<br>• 圆：圆圆的，没有角<br>• 三角形：有三条边、三个角',
                            examples: [
                                { title: '辨认图形', content: '硬币是什么形状？红领巾是什么形状？', analysis: '硬币是圆形，红领巾是三角形' }
                            ],
                            summary: '能辨认长方形、正方形、圆和三角形。'
                        }
                    ],
                    summary: '认识四种基本平面图形，能在生活中找到它们的影子。'
                }
            ],
            7: [
                {
                    title: '有理数',
                    icon: '🔢',
                    knowledgePoints: [
                        {
                            title: '正数和负数',
                            content: '• 正数：大于0的数，如 3, +5, 2.5<br>• 负数：在正数前面加上"－"号的数，如 －3, －5<br>• 0 既不是正数，也不是负数<br>• 意义：正负表示相反意义的量，如上升与下降、收入与支出',
                            examples: [
                                { title: '温度问题', content: '某天北京的最高气温是5℃，最低气温是－3℃，这一天温差是多少？', analysis: '温差 = 最高 － 最低 = 5 － (－3) = 5 + 3 = 8℃' },
                                { title: '正负意义', content: '如果向东走5米记作＋5米，那么－3米表示什么？', analysis: '－3米表示向西走3米，正负表示相反方向' }
                            ],
                            summary: '正数>0，负数<0，0是正负分界点。正负表示相反意义的量。'
                        },
                        {
                            title: '有理数的分类',
                            content: '有理数 = 整数 + 分数<br>• 整数：正整数、0、负整数<br>• 分数：正分数、负分数<br>• 有限小数和无限循环小数都可以化为分数',
                            examples: [
                                { title: '分类练习', content: '将下列各数填入相应的集合：－5，3.5，0，－2/3，7，－0.4<br>正数集合：{ ... }<br>负整数集合：{ ... }', analysis: '正数：{3.5, 7}；负整数：{－5}；整数：{－5, 0, 7}' }
                            ],
                            summary: '有理数包括整数和分数，整数又分为正整数、0、负整数。'
                        },
                        {
                            title: '数轴',
                            content: '数轴三要素：原点、正方向、单位长度<br>• 规定了原点、正方向和单位长度的直线叫做数轴<br>• 数轴上的点与有理数一一对应<br>• 右边的数总比左边的数大',
                            examples: [
                                { title: '数轴比较', content: '在数轴上，－2 和 ＋3 哪个更大？为什么？', analysis: '+3 > －2，因为数轴上右边的数总比左边的大，+3 在 －2 的右边' }
                            ],
                            summary: '数轴是理解有理数大小关系的工具，牢记"右大左小"。'
                        },
                        {
                            title: '相反数与绝对值',
                            content: '• 相反数：只有符号不同的两个数互为相反数，如 5 和 －5<br>• 0 的相反数是 0<br>• 绝对值：数轴上表示数 a 的点与原点的距离，记作 |a|<br>• |5| = 5，|－5| = 5，|0| = 0<br>• 性质：|a| ≥ 0',
                            examples: [
                                { title: '相反数', content: '写出下列各数的相反数：3，－7，0', analysis: '3的相反数是－3；－7的相反数是7；0的相反数是0' },
                                { title: '绝对值', content: '计算：|－8| + |5|', analysis: '|－8| = 8，|5| = 5，所以 8 + 5 = 13' }
                            ],
                            summary: '相反数：符号相反，数值相同；绝对值：去掉符号，永远非负。'
                        }
                    ],
                    summary: '本单元学习了正负数、有理数的分类、数轴、相反数和绝对值。核心是理解"正负表示相反意义"和"绝对值是非负的"。'
                },
                {
                    title: '整式的加减',
                    icon: '📝',
                    knowledgePoints: [
                        {
                            title: '单项式',
                            content: '• 定义：数与字母的积组成的代数式<br>• 系数：单项式中的数字因数<br>• 次数：所有字母指数的和<br>• 例：－3x²y 的系数是 －3，次数是 3（2+1）',
                            examples: [
                                { title: '识别单项式', content: '指出单项式 5a²b 的系数和次数', analysis: '系数是 5，次数是 3（a的指数2 + b的指数1 = 3）' }
                            ],
                            summary: '单项式 = 系数 × 字母，次数是所有字母指数之和。'
                        },
                        {
                            title: '多项式与同类项',
                            content: '• 多项式：几个单项式的和<br>• 同类项：所含字母相同，相同字母的指数也相同的项<br>• 合并同类项：把同类项的系数相加，字母和指数不变<br>• 例：3x² + 5x² = 8x²',
                            examples: [
                                { title: '合并同类项', content: '化简：2x² － 3x + 5x² + 4x － 1', analysis: '=(2x²+5x²)+(－3x+4x)+(－1)=7x²+x－1' }
                            ],
                            summary: '合并同类项：系数相加，字母不变。不是同类项不能合并。'
                        }
                    ],
                    summary: '本单元从单项式到多项式，掌握同类项的识别和合并，是代数运算的基础。'
                }
            ]
        };

        // ---- 语文 示例 ----
        const chineseData = {
            1: [
                {
                    title: '识字与写字',
                    icon: '✏️',
                    knowledgePoints: [
                        {
                            title: '认识基本汉字',
                            content: '汉字是世界上最古老的文字之一。每个汉字都有它的读音和意义。<br>• 笔画：横(一)、竖(丨)、撇(丿)、捺(㇏)、点(丶)<br>• 笔顺规则：先横后竖，先撇后捺，从上到下，从左到右',
                            examples: [
                                { title: '笔画练习', content: '"木"字有几画？笔顺是什么？', analysis: '"木"字共4画：横、竖、撇、捺。笔顺：木' },
                                { title: '认字造句', content: '用"山"字组词并造句', analysis: '组词：大山、山上、山坡。造句：远处有一座高高的山。' }
                            ],
                            summary: '掌握基本笔画和笔顺规则，能认读和书写简单的汉字。'
                        }
                    ],
                    summary: '本单元学习汉字的基本笔画和笔顺，认识常用汉字，学会用学过的字组词造句。'
                },
                {
                    title: '朗读与背诵',
                    icon: '📖',
                    knowledgePoints: [
                        {
                            title: '古诗《咏鹅》',
                            content: '鹅，鹅，鹅，曲项向天歌。<br>白毛浮绿水，红掌拨清波。<br>— 骆宾王（唐代）<br>这首诗描写了夏天池塘里鹅游泳的美丽画面。',
                            examples: [
                                { title: '理解诗句', content: '"曲项向天歌"是什么意思？', analysis: '"曲项"指鹅弯曲的脖子，"向天歌"指向着天空唱歌。整句写鹅仰头鸣叫的样子。' },
                                { title: '画面想象', content: '"白毛浮绿水，红掌拨清波"描绘了什么颜色？', analysis: '白色的羽毛、绿色的水、红色的脚掌——色彩鲜明，画面生动。' }
                            ],
                            summary: '《咏鹅》是骆宾王7岁时写的诗，抓住鹅的外形特点，用白、绿、红三种颜色描绘了一幅优美的画面。'
                        }
                    ],
                    summary: '通过朗读和背诵古诗，培养语感和记忆力，感受中华文化的优美。'
                }
            ]
        };

        this.register('shuxue', 1, mathData[1]);
        this.register('shuxue', 7, mathData[7]);
        this.register('yuwen', 1, chineseData[1]);
    }
};
