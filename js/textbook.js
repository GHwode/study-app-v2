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
        // ========== 数学 2-6,8-9年级 ==========
        this.register('shuxue', 2, [
            {title:'乘法口诀',icon:'✖️',knowledgePoints:[
                {title:'九九乘法表',content:'1×1=1, 1×2=2, ..., 9×9=81<br>• 乘法口诀是乘法运算的基础<br>• 规律：每行/列递增，对角线是平方数',
                 examples:[{title:'计算',content:'7×8=?',analysis:'七八五十六，7×8=56'}],
                 summary:'熟记九九乘法表，能快速口算。'}
            ],summary:'掌握乘法口诀，能进行多位数乘法。'},
            {title:'除法初步',icon:'➗',knowledgePoints:[
                {title:'除法的意义',content:'除法是把一个数平均分成几份，求每份是多少。<br>• 符号：÷<br>• 例：12÷3=4 表示把12平均分成3份，每份是4',
                 examples:[{title:'平均分',content:'15个苹果平均分给5个小朋友，每人几个？',analysis:'15÷5=3（个），用除法求每份数'}],
                 summary:'除法是乘法的逆运算，用于平均分场景。'}
            ],summary:'理解除法含义，能进行简单除法计算。'}
        ]);
        
        this.register('shuxue', 3, [
            {title:'乘法进阶',icon:'✖️',knowledgePoints:[
                {title:'两位数乘一位数',content:'• 例：23×4=92<br>• 方法：先算20×4=80，再算3×4=12，最后80+12=92',
                 examples:[{title:'计算',content:'35×6=?',analysis:'35×6=210，先算30×6=180，再算5×6=30，180+30=210'}],
                 summary:'掌握两位数乘一位数的计算方法。'}
            ],summary:'能熟练进行两位数乘一位数的计算。'},
            {title:'除法进阶',icon:'➗',knowledgePoints:[
                {title:'有余数的除法',content:'• 例：17÷5=3...2<br>• 余数必须小于除数<br>• 验算：商×除数+余数=被除数',
                 examples:[{title:'计算',content:'23÷4=?',analysis:'23÷4=5...3，验算：5×4+3=23'}],
                 summary:'理解有余数的除法，掌握验算方法。'}
            ],summary:'掌握除法计算和有余数除法的处理方法。'},
            {title:'分数初步',icon:'½',knowledgePoints:[
                {title:'分数的认识',content:'• 分数表示整体的一部分<br>• 例：1/4表示把整体平均分成4份，取其中的1份<br>• 分子表示取的份数，分母表示总份数',
                 examples:[{title:'看图写分数',content:'一个蛋糕平均切成8块，吃了3块，吃了多少？',analysis:'吃了3/8，分母8表示总共8块，分子3表示吃了3块'}],
                 summary:'理解分数的含义，能读写简单分数。'}
            ],summary:'初步认识分数，理解分子分母的含义。'}
        ]);
        
        this.register('shuxue', 4, [
            {title:'大数认识',icon:'🔢',knowledgePoints:[
                {title:'亿以内数的认识',content:'• 数位顺序：个、十、百、千、万、十万、百万、千万、亿<br>• 分级：个级（个十百千）、万级（万十万百万千万）、亿级<br>• 读法：从高位读起，一级一级往下读',
                 examples:[{title:'读数',content:'读出30500000',analysis:'三千零五十万，先分级3050|0000，万级读作三千零五十万'}],
                 summary:'掌握大数的读法和写法。'}
            ],summary:'认识亿以内的数，掌握数位和分级方法。'},
            {title:'三位数乘两位数',icon:'✖️',knowledgePoints:[
                {title:'乘法计算',content:'• 例：145×12=1740<br>• 方法：先用个位乘，再用十位乘，最后相加',
                 examples:[{title:'计算',content:'236×45=?',analysis:'236×45=10620，先算236×5=1180，再算236×40=9440，1180+9440=10620'}],
                 summary:'掌握三位数乘两位数的计算方法。'}
            ],summary:'能熟练进行三位数乘两位数的计算。'}
        ]);
        
        this.register('shuxue', 5, [
            {title:'小数加减',icon:'➕',knowledgePoints:[
                {title:'小数的加减法',content:'• 小数点对齐，再按整数加减法计算<br>• 例：3.25+1.7=4.95<br>• 注意：位数不够时用0补齐',
                 examples:[{title:'计算',content:'5.3+2.47=?',analysis:'5.30+2.47=7.77，小数点对齐，5.3补0变成5.30'}],
                 summary:'掌握小数加减法的计算方法。'}
            ],summary:'能正确进行小数加减法计算。'},
            {title:'小数乘除',icon:'✖️',knowledgePoints:[
                {title:'小数乘法',content:'• 先按整数乘法计算，再看因数中有几位小数，就从积的右边起数出几位点上小数点<br>• 例：0.25×4=1.00=1',
                 examples:[{title:'计算',content:'1.2×0.3=?',analysis:'12×3=36，因数共2位小数，所以0.36'}],
                 summary:'掌握小数乘法的计算方法。'}
            ],summary:'能正确进行小数乘除法计算。'}
        ]);
        
        this.register('shuxue', 6, [
            {title:'比和比例',icon:'⚖️',knowledgePoints:[
                {title:'比的含义',content:'• 比表示两个数相除的关系<br>• 例：3:4=3÷4=0.75<br>• 性质：比的前项和后项同时乘或除以相同的数（0除外），比值不变',
                 examples:[{title:'化简比',content:'化简12:18',analysis:'12和18的最大公约数是6，12÷6=2,18÷6=3，所以12:18=2:3'}],
                 summary:'理解比的意义，掌握化简比的方法。'}
            ],summary:'掌握比和比例的基本概念和计算方法。'},
            {title:'百分数',icon:'%',knowledgePoints:[
                {title:'百分数的认识',content:'• 百分数表示一个数是另一个数的百分之几<br>• 例：25%=0.25=1/4<br>• 应用：折扣、利率、增长率等',
                 examples:[{title:'计算',content:'一件商品打八折后售价160元，原价多少？',analysis:'八折=80%，原价=160÷80%=200元'}],
                 summary:'理解百分数的含义，能进行百分数计算。'}
            ],summary:'掌握比、比例和百分数的概念及应用。'}
        ]);
        
        this.register('shuxue', 8, [
            {title:'三角形',icon:'🔺',knowledgePoints:[
                {title:'三角形的性质',content:'• 三角形内角和=180°<br>• 两边之和大于第三边<br>• 分类：按边分（等边、等腰、不等边），按角分（锐角、直角、钝角）',
                 examples:[{title:'计算',content:'三角形两个角分别是50°和60°，第三个角是多少？',analysis:'180°-50°-60°=70°，三角形内角和180°'}],
                 summary:'掌握三角形的基本性质和内角和定理。'}
            ],summary:'理解三角形的分类和性质。'},
            {title:'平行四边形',icon:'▱',knowledgePoints:[
                {title:'平行四边形的性质',content:'• 对边平行且相等<br>• 对角相等<br>• 对角线互相平分<br>• 面积=底×高',
                 examples:[{title:'计算',content:'平行四边形底8cm，高5cm，面积是多少？',analysis:'面积=8×5=40cm²'}],
                 summary:'掌握平行四边形的性质和面积计算。'}
            ],summary:'理解平行四边形的性质和面积计算。'}
        ]);
        
        this.register('shuxue', 9, [
            {title:'一元二次方程',icon:'📐',knowledgePoints:[
                {title:'解一元二次方程',content:'• 一般形式：ax²+bx+c=0(a≠0)<br>• 解法：配方法、公式法、因式分解法<br>• 求根公式：x=(-b±√(b²-4ac))/2a',
                 examples:[{title:'解方程',content:'x²-5x+6=0',analysis:'(x-2)(x-3)=0，x₁=2,x₂=3'}],
                 summary:'掌握一元二次方程的解法。'}
            ],summary:'理解一元二次方程的概念和解法。'},
            {title:'二次函数',icon:'📈',knowledgePoints:[
                {title:'二次函数的图像',content:'• 一般形式：y=ax²+bx+c(a≠0)<br>• 图像是抛物线<br>• a>0开口向上，a<0开口向下<br>• 顶点坐标：(-b/2a,(4ac-b²)/4a)',
                 examples:[{title:'分析',content:'y=x²-2x+3的顶点坐标？',analysis:'x=-(-2)/(2×1)=1,y=1-2+3=2，顶点(1,2)'}],
                 summary:'掌握二次函数的图像性质和顶点坐标计算。'}
            ],summary:'理解二次函数的概念和图像性质。'}
        ]);
        
        // ========== 语文 2-9年级 ==========
        this.register('yuwen', 2, [
            {title:'字词积累',icon:'📝',knowledgePoints:[
                {title:'常用汉字',content:'• 认识常用汉字800-1000个<br>• 掌握基本笔画和笔顺<br>• 能正确书写简单汉字',
                 examples:[{title:'写字',content:'写出"春"字的笔顺',analysis:'春：横、横、横、撇、捺、横、横、撇、捺，共9画'}],
                 summary:'掌握常用汉字的写法和笔顺。'}
            ],summary:'积累常用字词，能正确书写。'},
            {title:'词语运用',icon:'📖',knowledgePoints:[
                {title:'词语搭配',content:'• 形容词+名词：美丽的花<br>• 动词+名词：吃饭<br>• 副词+动词：很快地跑',
                 examples:[{title:'填空',content:'( )的天空',analysis:'蓝蓝的天空、晴朗的天空、广阔的天空'}],
                 summary:'掌握常见词语的搭配用法。'}
            ],summary:'能正确使用常见词语。'}
        ]);
        
        this.register('yuwen', 3, [
            {title:'字词巩固',icon:'📝',knowledgePoints:[
                {title:'多音字',content:'• 多音字：一个汉字有多个读音<br>• 例：重(chóng/zhòng)、长(cháng/zhǎng)<br>• 根据语境选择正确读音',
                 examples:[{title:'选择读音',content:'"重"在"重要"中读什么？',analysis:'重要中"重"读zhòng，表示程度深'}],
                 summary:'掌握常见多音字的正确读音。'}
            ],summary:'巩固字词基础，掌握多音字。'},
            {title:'句式变换',icon:'✏️',knowledgePoints:[
                {title:'句子变换',content:'• 把字句：我把书放在桌上<br>• 被字句：书被我放在桌上<br>• 反问句：难道你不知道吗？',
                 examples:[{title:'变换',content:'把"小明吃了苹果"改成把字句',analysis:'我把苹果吃了'}],
                 summary:'掌握常见句式的变换方法。'}
            ],summary:'能正确进行句式变换。'}
        ]);
        
        this.register('yuwen', 4, [
            {title:'字词运用',icon:'📝',knowledgePoints:[
                {title:'近义词和反义词',content:'• 近义词：意思相近的词，如"美丽-漂亮"<br>• 反义词：意思相反的词，如"大-小"<br>• 能根据语境选择恰当的词语',
                 examples:[{title:'找近义词',content:'"高兴"的近义词是什么？',analysis:'开心、愉快、欢乐都是"高兴"的近义词'}],
                 summary:'掌握近义词和反义词的运用。'}
            ],summary:'能准确运用近义词和反义词。'}
        ]);
        
        this.register('yuwen', 5, [
            {title:'字词段篇',icon:'📖',knowledgePoints:[
                {title:'段落理解',content:'• 段落是文章的基本单位<br>• 中心句通常在段首或段尾<br>• 能概括段落大意',
                 examples:[{title:'概括',content:'阅读一段关于春天的文字，概括主要内容',analysis:'这段文字描写了春天万物复苏的景象，表达了作者对春天的喜爱'}],
                 summary:'能理解段落内容，概括段落大意。'}
            ],summary:'掌握段落理解和方法。'}
        ]);
        
        this.register('yuwen', 6, [
            {title:'小学复习',icon:'📚',knowledgePoints:[
                {title:'基础知识回顾',content:'• 汉字：笔画、笔顺、部首<br>• 词语：近义词、反义词、成语<br>• 句子：句式变换、修辞手法<br>• 篇章：阅读理解、写作技巧',
                 examples:[{title:'综合',content:'用"因为...所以..."造句',analysis:'因为今天下雨，所以我带了雨伞。'}],
                 summary:'全面回顾小学语文基础知识。'}
            ],summary:'系统复习小学语文基础知识。'}
        ]);
        
        this.register('yuwen', 7, [
            {title:'古诗词鉴赏',icon:'📜',knowledgePoints:[
                {title:'古诗鉴赏方法',content:'• 了解作者和写作背景<br>• 理解诗句含义<br>• 分析修辞手法<br>• 体会作者情感',
                 examples:[{title:'鉴赏',content:'分析"床前明月光"的表达效果',analysis:'用简洁的语言描绘了月光洒在床前的宁静画面，表达了作者的思乡之情'}],
                 summary:'掌握古诗词鉴赏的基本方法。'}
            ],summary:'能鉴赏古诗词，理解其意境和情感。'},
            {title:'文言文阅读',icon:'📖',knowledgePoints:[
                {title:'文言文基础',content:'• 常见文言虚词：之、乎、者、也、矣、焉、哉<br>• 常见文言实词：走(跑)、汤(热水)、兵(武器)<br>• 特殊句式：判断句、被动句、倒装句',
                 examples:[{title:'翻译',content:'翻译"学而时习之"',analysis:'学习了知识然后按时复习它'}],
                 summary:'掌握文言文基础知识，能进行简单翻译。'}
            ],summary:'能阅读简单文言文，理解基本内容。'}
        ]);
        
        this.register('yuwen', 8, [
            {title:'古诗文积累',icon:'📜',knowledgePoints:[
                {title:'古诗文默写',content:'• 课标要求背诵的古诗文篇目<br>• 理解性默写<br>• 注意易错字',
                 examples:[{title:'默写',content:'默写《论语》中关于学习的名句',analysis:'学而时习之，不亦说乎？有朋自远方来，不亦乐乎？'}],
                 summary:'能准确默写课标要求的古诗文。'}
            ],summary:'积累古诗文，能准确默写和理解。'},
            {title:'名著阅读',icon:'📚',knowledgePoints:[
                {title:'名著阅读方法',content:'• 了解作者和创作背景<br>• 把握故事情节<br>• 分析人物形象<br>• 理解主题思想',
                 examples:[{title:'分析',content:'《西游记》中孙悟空的性格特点',analysis:'勇敢机智、不畏强权、忠诚可靠，但又有些桀骜不驯'}],
                 summary:'掌握名著阅读的基本方法。'}
            ],summary:'能阅读和理解中外名著。'}
        ]);
        
        this.register('yuwen', 9, [
            {title:'中考复习',icon:'📝',knowledgePoints:[
                {title:'中考考点梳理',content:'• 基础知识：字音、字形、词语、病句<br>• 阅读理解：现代文、文言文<br>• 写作：记叙文、说明文、议论文<br>• 综合性学习',
                 examples:[{title:'病句修改',content:'修改"通过努力，使成绩提高了"',analysis:'去掉"通过"或"使"，改为"通过努力，成绩提高了"或"努力使成绩提高了"'}],
                 summary:'系统复习中考考点，提高应试能力。'}
            ],summary:'全面复习中考考点，做好考前准备。'}
        ]);
        
        // ========== 英语 1-9年级 ==========
        this.register('yingyu', 1, [
            {title:'问候与介绍',icon:'👋',knowledgePoints:[
                {title:'日常问候',content:'• Hello/Hi — 你好<br>• Good morning — 早上好<br>• Good afternoon — 下午好<br>• Good evening — 晚上好',
                 examples:[{title:'对话',content:"A: Hello! How are you?<br>B: I\'m fine, thank you.",analysis:'这是最基本的问候对话，询问对方状况并回答'}],
                 summary:'掌握基本的问候用语。'}
            ],summary:'能进行简单的日常问候和自我介绍。'},
            {title:'颜色与数字',icon:'🎨',knowledgePoints:[
                {title:'颜色词汇',content:'• red — 红色<br>• blue — 蓝色<br>• green — 绿色<br>• yellow — 黄色',
                 examples:[{title:'描述',content:'The sky is ___.<br>A. red B. blue C. green',analysis:'选B，sky是蓝色的'}],
                 summary:'掌握常见颜色和数字的英文表达。'}
            ],summary:'认识颜色和数字的英文单词。'}
        ]);
        
        this.register('yingyu', 2, [
            {title:'食物与饮料',icon:'🍎',knowledgePoints:[
                {title:'食物词汇',content:'• apple — 苹果<br>• banana — 香蕉<br>• milk — 牛奶<br>• water — 水',
                 examples:[{title:'点餐',content:'I would like some ___, please.<br>A. rice B. book C. pen',analysis:'选A，would like表示想要，rice是食物'}],
                 summary:'掌握常见食物和饮料的英文表达。'}
            ],summary:'能识别和说出常见食物的英文名称。'},
            {title:'身体部位',icon:'🦴',knowledgePoints:[
                {title:'身体词汇',content:'• head — 头<br>• hand — 手<br>• foot — 脚<br>• eye — 眼睛',
                 examples:[{title:'指令',content:'Touch your ___.<br>A. nose B. book C. desk',analysis:'选A，touch表示触摸，nose是身体部位'}],
                 summary:'认识身体部位的英文单词。'}
            ],summary:'掌握身体部位的英文表达。'}
        ]);
        
        this.register('yingyu', 3, [
            {title:'日常生活',icon:'🏠',knowledgePoints:[
                {title:'日常活动',content:'• get up — 起床<br>• go to school — 上学<br>• have lunch — 吃午饭<br>• go home — 回家',
                 examples:[{title:'排序',content:'给以下活动排序：go home, get up, have lunch',analysis:'正确顺序：get up → have lunch → go home'}],
                 summary:'掌握日常活动的英文表达。'}
            ],summary:'能描述日常生活活动。'},
            {title:'季节与节日',icon:'🎄',knowledgePoints:[
                {title:'季节词汇',content:'• spring — 春天<br>• summer — 夏天<br>• autumn/fall — 秋天<br>• winter — 冬天',
                 examples:[{title:'选择',content:"It\'s cold and snowy. Which season is it?<br>A. spring B. summer C. winter",analysis:'选C，cold and snowy描述冬天'}],
                 summary:'认识季节和节日的英文表达。'}
            ],summary:'掌握季节和节日的英文词汇。'}
        ]);
        
        this.register('yingyu', 4, [
            {title:'学校生活',icon:'🏫',knowledgePoints:[
                {title:'学校场所',content:'• classroom — 教室<br>• library — 图书馆<br>• playground — 操场<br>• cafeteria — 食堂',
                 examples:[{title:'阅读',content:'I read books in the ___.<br>A. playground B. library C. classroom',analysis:'选B，read books在library图书馆'}],
                 summary:'认识学校场所的英文表达。'}
            ],summary:'能描述学校生活。'},
            {title:'时间与日期',icon:'⏰',knowledgePoints:[
                {title:'时间表达',content:'• What time is it? — 几点了？<br>• It\'s 8 o\'clock. — 8点了<br>• Monday — 星期一',
                 examples:[{title:'问答',content:'A: What day is it today?<br>B: It\'s ___.<br>A. Monday B. morning C. year',analysis:'选A，day对应星期'}],
                 summary:'掌握时间和日期的英文表达。'}
            ],summary:'能谈论时间和日期。'}
        ]);
        
        this.register('yingyu', 5, [
            {title:'旅行与交通',icon:'✈️',knowledgePoints:[
                {title:'交通工具',content:'• bus — 公共汽车<br>• train — 火车<br>• plane — 飞机<br>• bike — 自行车',
                 examples:[{title:'选择',content:'I go to Beijing by ___. It\'s far.<br>A. bus B. plane C. bike',analysis:'选B，far表示远，坐飞机plane'}],
                 summary:'掌握交通工具的英文表达。'}
            ],summary:'能描述旅行和交通方式。'},
            {title:'健康与运动',icon:'⚽',knowledgePoints:[
                {title:'运动项目',content:'• play basketball — 打篮球<br>• play football — 踢足球<br>• swim — 游泳<br>• run — 跑步',
                 examples:[{title:'完成',content:'I like ___. I go swimming every weekend.<br>A. running B. swimming C. jumping',analysis:'选B，swimming对应swimming'}],
                 summary:'掌握运动和健康的英文表达。'}
            ],summary:'能谈论健康和运动。'}
        ]);
        
        this.register('yingyu', 6, [
            {title:'小学复习一',icon:'📚',knowledgePoints:[
                {title:'基础语法回顾',content:'• 名词单复数：cat→cats<br>• 动词第三人称单数：go→goes<br>• 代词：I→me, he→him',
                 examples:[{title:'填空',content:'She ___ to school every day.<br>A. go B. goes C. going',analysis:'选B，第三人称单数用goes'}],
                 summary:'复习小学英语基础语法。'}
            ],summary:'系统复习小学英语基础知识。'},
            {title:'小学复习二',icon:'📖',knowledgePoints:[
                {title:'阅读理解技巧',content:'• 找关键词<br>• 理解上下文<br>• 推断作者意图',
                 examples:[{title:'阅读',content:'Read the passage and answer the question.',analysis:'先快速浏览问题，再带着问题阅读文章'}],
                 summary:'掌握阅读理解的基本技巧。'}
            ],summary:'提高阅读理解能力。'}
        ]);
        
        this.register('yingyu', 7, [
            {title:'一般现在时',icon:'📝',knowledgePoints:[
                {title:'一般现在时用法',content:'• 表示经常发生的动作或状态<br>• 结构：主语+动词原形/第三人称单数<br>• 例：I go to school every day.',
                 examples:[{title:'填空',content:'He ___ (play) basketball every Sunday.',analysis:'play→plays，第三人称单数'}],
                 summary:'掌握一般现在时的用法和结构。'}
            ],summary:'能正确使用一般现在时。'},
            {title:'现在进行时',icon:'⏳',knowledgePoints:[
                {title:'现在进行时',content:'• 表示正在进行的动作<br>• 结构：am/is/are + 动词-ing<br>• 标志词：now, look, listen',
                 examples:[{title:'填空',content:'Look! The birds ___ (fly) in the sky.',analysis:'fly→flying，Look表示正在进行'}],
                 summary:'掌握现在进行时的用法。'}
            ],summary:'能正确使用现在进行时。'}
        ]);
        
        this.register('yingyu', 8, [
            {title:'一般将来时',icon:'🔮',knowledgePoints:[
                {title:'一般将来时',content:'• 表示将来要发生的动作<br>• 结构：will + 动词原形 / be going to + 动词原形<br>• 例：I will visit Beijing next year.',
                 examples:[{title:'填空',content:'I ___ (visit) my grandparents tomorrow.',analysis:'will visit 或 am going to visit'}],
                 summary:'掌握一般将来时的用法。'}
            ],summary:'能正确使用一般将来时。'},
            {title:'被动语态',icon:'🔄',knowledgePoints:[
                {title:'被动语态',content:'• 结构：be + 过去分词<br>• 例：The book is written by Lu Xun.<br>• 当强调动作承受者时使用',
                 examples:[{title:'改写',content:'主动：Someone cleaned the room.<br>被动：The room was cleaned.',analysis:'room是动作承受者，用被动语态'}],
                 summary:'掌握被动语态的构成和用法。'}
            ],summary:'能正确使用被动语态。'}
        ]);
        
        this.register('yingyu', 9, [
            {title:'现在完成时',icon:'✅',knowledgePoints:[
                {title:'现在完成时',content:'• 结构：have/has + 过去分词<br>• 表示过去发生的动作对现在的影响<br>• 标志词：already, yet, ever, never',
                 examples:[{title:'填空',content:'I ___ (be) to Beijing twice.',analysis:'have been，表示曾经去过北京'}],
                 summary:'掌握现在完成时的用法。'}
            ],summary:'能正确使用现在完成时。'},
            {title:'中考复习',icon:'📚',knowledgePoints:[
                {title:'语法综合',content:'• 时态：一般现在、现在进行、一般过去、一般将来、现在完成<br>• 语态：主动语态、被动语态<br>• 从句：宾语从句、定语从句、状语从句',
                 examples:[{title:'选择',content:'The book ___ I bought yesterday is very interesting.',analysis:'省略关系代词that/which，定语从句修饰book'}],
                 summary:'系统复习中考语法要点。'}
            ],summary:'全面复习中考英语语法。'}
        ]);
        
        // ========== 物理 7-9年级 ==========
        this.register('wuli', 7, [
            {title:'运动与力',icon:'🏃',knowledgePoints:[
                {title:'运动的描述',content:'• 参照物：判断物体运动还是静止的标准<br>• 速度：v=s/t，单位m/s或km/h<br>• 匀速直线运动：速度保持不变的运动',
                 examples:[{title:'计算',content:'汽车2小时行驶120千米，速度是多少？',analysis:'v=s/t=120km/2h=60km/h'}],
                 summary:'掌握运动的基本描述方法。'}
            ],summary:'理解运动和力的基本概念。'},
            {title:'声现象',icon:'🔊',knowledgePoints:[
                {title:'声音的产生',content:'• 声音由物体振动产生<br>• 传播需要介质（固体、液体、气体）<br>• 真空不能传声',
                 examples:[{title:'判断',content:'在月球上，宇航员不能直接对话，原因是？',analysis:'月球上是真空，没有传播声音的介质'}],
                 summary:'理解声音的产生和传播。'}
            ],summary:'掌握声现象的基本知识。'}
        ]);
        
        this.register('wuli', 8, [
            {title:'力与运动',icon:'💪',knowledgePoints:[
                {title:'牛顿第一定律',content:'• 一切物体在没有受到力的作用时，总保持静止或匀速直线运动状态<br>• 惯性：物体保持原来运动状态的性质<br>• 惯性只与质量有关',
                 examples:[{title:'解释',content:'为什么汽车刹车时乘客会向前倾？',analysis:'乘客由于惯性要保持原来的运动状态，所以向前倾'}],
                 summary:'理解牛顿第一定律和惯性。'}
            ],summary:'掌握力和运动的关系。'},
            {title:'压强',icon:'📏',knowledgePoints:[
                {title:'压强计算',content:'• 固体压强：p=F/S<br>• 液体压强：p=ρgh<br>• 大气压强：约1.01×10⁵Pa',
                 examples:[{title:'计算',content:'压力100N，受力面积0.5m²，压强是多少？',analysis:'p=F/S=100N/0.5m²=200Pa'}],
                 summary:'掌握压强的计算方法。'}
            ],summary:'理解压强的概念和计算。'}
        ]);
        
        this.register('wuli', 9, [
            {title:'电路基础',icon:'⚡',knowledgePoints:[
                {title:'电路组成',content:'• 电源：提供电能<br>• 用电器：消耗电能<br>• 导线：传输电能<br>• 开关：控制电路',
                 examples:[{title:'判断',content:'下列哪个是电源？<br>A. 灯泡 B. 电池 C. 电线',analysis:'选B，电池是电源'}],
                 summary:'认识电路的基本组成。'}
            ],summary:'掌握电路基础知识。'},
            {title:'欧姆定律',icon:'📐',knowledgePoints:[
                {title:'欧姆定律',content:'• 公式：I=U/R<br>• 电流与电压成正比，与电阻成反比<br>• 单位：安培(A)、伏特(V)、欧姆(Ω)',
                 examples:[{title:'计算',content:'电压6V，电阻12Ω，电流是多少？',analysis:'I=U/R=6V/12Ω=0.5A'}],
                 summary:'掌握欧姆定律的应用。'}
            ],summary:'理解欧姆定律并能计算。'}
        ]);
        
        // ========== 化学 8-9年级 ==========
        this.register('huaxue', 8, [
            {title:'物质的变化',icon:'🧪',knowledgePoints:[
                {title:'物理变化和化学变化',content:'• 物理变化：没有新物质生成的变化<br>• 化学变化：有新物质生成的变化<br>• 本质区别：是否有新物质生成',
                 examples:[{title:'判断',content:'下列属于化学变化的是？<br>A. 水结冰 B. 铁生锈 C. 玻璃破碎',analysis:'选B，铁生锈生成了新物质Fe₂O₃'}],
                 summary:'能区分物理变化和化学变化。'}
            ],summary:'理解物质的变化和性质。'},
            {title:'空气与氧气',icon:'💨',knowledgePoints:[
                {title:'空气的成分',content:'• 氮气(N₂)：78%<br>• 氧气(O₂)：21%<br>• 稀有气体：0.94%<br>• 二氧化碳(CO₂)：0.03%',
                 examples:[{title:'实验',content:'测定空气中氧气含量的实验中，用什么物质？',analysis:'红磷，燃烧消耗氧气生成五氧化二磷固体'}],
                 summary:'认识空气的组成和氧气的性质。'}
            ],summary:'掌握空气和氧气的相关知识。'}
        ]);
        
        this.register('huaxue', 9, [
            {title:'化学方程式',icon:'📝',knowledgePoints:[
                {title:'方程式书写',content:'• 质量守恒定律：反应前后质量不变<br>• 配平：使左右两边原子个数相等<br>• 例：2H₂+O₂→2H₂O',
                 examples:[{title:'配平',content:'配平：Fe + O₂ → Fe₃O₄',analysis:'3Fe + 2O₂ → Fe₃O₄'}],
                 summary:'掌握化学方程式的书写和配平。'}
            ],summary:'能书写和配平化学方程式。'},
            {title:'酸碱盐',icon:'🧫',knowledgePoints:[
                {title:'常见的酸和碱',content:'• 酸：HCl, H₂SO₄, HNO₃<br>• 碱：NaOH, Ca(OH)₂, NH₃·H₂O<br>• 酸碱指示剂：石蕊、酚酞',
                 examples:[{title:'判断',content:'能使酚酞变红的溶液是？<br>A. 酸性 B. 碱性 C. 中性',analysis:'选B，酚酞遇碱变红'}],
                 summary:'认识常见的酸碱盐及其性质。'}
            ],summary:'理解酸碱盐的基本性质。'}
        ]);
        
        // ========== 生物 7-9年级 ==========
        this.register('shengwu', 7, [
            {title:'细胞的结构',icon:'🔬',knowledgePoints:[
                {title:'动植物细胞',content:'• 动物细胞：细胞膜、细胞质、细胞核<br>• 植物细胞：细胞壁、细胞膜、细胞质、细胞核、液泡、叶绿体<br>• 基本结构：细胞膜、细胞质、细胞核',
                 examples:[{title:'比较',content:'植物细胞特有而动物细胞没有的结构是？',analysis:'细胞壁、液泡、叶绿体'}],
                 summary:'掌握细胞的基本结构。'}
            ],summary:'理解细胞的结构和功能。'},
            {title:'植物生理',icon:'🌱',knowledgePoints:[
                {title:'光合作用',content:'• 公式：CO₂+H₂O→有机物+O₂<br>• 场所：叶绿体<br>• 条件：光<br>• 意义：制造有机物，释放氧气',
                 examples:[{title:'分析',content:'为什么植物在黑暗中不能进行光合作用？',analysis:'光合作用需要光作为条件，黑暗中没有光'}],
                 summary:'理解光合作用的过程和意义。'}
            ],summary:'掌握植物的基本生理过程。'}
        ]);
        
        this.register('shengwu', 8, [
            {title:'生命的延续',icon:'🧬',knowledgePoints:[
                {title:'生殖和发育',content:'• 有性生殖：经过两性生殖细胞结合<br>• 无性生殖：不经过两性生殖细胞结合<br>• 完全变态：卵→幼虫→蛹→成虫',
                 examples:[{title:'比较',content:'家蚕和蝗虫的发育有什么不同？',analysis:'家蚕是完全变态(有蛹期)，蝗虫是不完全变态(无蛹期)'}],
                 summary:'理解生物的生殖和发育。'}
            ],summary:'掌握生命的延续过程。'},
            {title:'生物的进化',icon:'🦕',knowledgePoints:[
                {title:'进化理论',content:'• 达尔文自然选择学说<br>• 适者生存，不适者被淘汰<br>• 化石是进化的直接证据',
                 examples:[{title:'解释',content:'为什么长颈鹿的脖子很长？',analysis:'自然选择的结果，脖子长的个体更容易获取食物，生存机会大'}],
                 summary:'理解生物进化的基本原理。'}
            ],summary:'认识生物的进化和多样性。'}
        ]);
        
        // ========== 历史 7-8年级 ==========
        this.register('lishi', 7, [
            {title:'古代中国一',icon:'🏛️',knowledgePoints:[
                {title:'夏商周',content:'• 夏朝：约公元前2070年，禹建立<br>• 商朝：青铜器发达，甲骨文<br>• 西周：分封制',
                 examples:[{title:'选择',content:'我国历史上第一个王朝是？<br>A. 商朝 B. 夏朝 C. 西周',analysis:'选B，夏朝是第一个王朝'}],
                 summary:'认识早期国家的产生和发展。'}
            ],summary:'了解中国古代早期历史。'},
            {title:'文化与科技',icon:'📜',knowledgePoints:[
                {title:'先秦文化',content:'• 孔子：儒家学派创始人<br>• 老子：道家学派创始人<br>• 都江堰：李冰父子修建',
                 examples:[{title:'连线',content:'孔子—？<br>A. 道家 B. 儒家 C. 法家',analysis:'选B，孔子是儒家学派创始人'}],
                 summary:'认识先秦时期的文化和科技成就。'}
            ],summary:'掌握先秦时期的文化科技。'}
        ]);
        
        this.register('lishi', 8, [
            {title:'近代探索一',icon:'⚔️',knowledgePoints:[
                {title:'鸦片战争',content:'• 时间：1840-1842年<br>• 原因：英国打开中国市场<br>• 结果：《南京条约》',
                 examples:[{title:'影响',content:'鸦片战争对中国的影响是？',analysis:'中国开始沦为半殖民地半封建社会，是中国近代史的开端'}],
                 summary:'认识鸦片战争的背景和影响。'}
            ],summary:'了解中国近代史的开端。'},
            {title:'近代探索二',icon:'🔄',knowledgePoints:[
                {title:'洋务运动',content:'• 时间：19世纪60-90年代<br>• 目的：自强求富<br>• 代表人物：曾国藩、李鸿章<br>• 局限：只学技术，不改制度',
                 examples:[{title:'评价',content:'洋务运动的局限性在于？',analysis:'只学习西方技术，不改变封建制度'}],
                 summary:'认识洋务运动的背景和局限。'}
            ],summary:'理解近代化的早期探索。'}
        ]);
        
        // ========== 地理 7-8年级 ==========
        this.register('dili', 7, [
            {title:'地球与地图',icon:'🌍',knowledgePoints:[
                {title:'地球形状',content:'• 地球是一个两极稍扁、赤道略鼓的不规则球体<br>• 平均半径：6371千米<br>• 赤道周长：约4万千米',
                 examples:[{title:'计算',content:'赤道周长约为4万千米，绕地球一圈需要多少时间？(假设每小时走10千米)',analysis:'40000÷10=4000小时'}],
                 summary:'认识地球的基本数据。'}
            ],summary:'掌握地球与地图的基础知识。'},
            {title:'气候与天气',icon:'🌤️',knowledgePoints:[
                {title:'天气与气候',content:'• 天气：短时间内的大气状况<br>• 气候：长时间的天气平均状况<br>• 主要气候类型：热带、温带、寒带',
                 examples:[{title:'区分',content:'下列描述天气的是？<br>A. 昆明四季如春 B. 明天大风降温 C. 极地寒冷干燥',analysis:'选B，天气是短时间的，A和C是气候'}],
                 summary:'区分天气和气候的概念。'}
            ],summary:'理解天气和气候的区别。'}
        ]);
        
        this.register('dili', 8, [
            {title:'中国地理',icon:'🇨🇳',knowledgePoints:[
                {title:'地理位置',content:'• 位于东半球、北半球<br>• 亚洲东部，太平洋西岸<br>• 纬度范围：约4°N-53°N',
                 examples:[{title:'判断',content:'中国位于哪个大洲？<br>A. 非洲 B. 欧洲 C. 亚洲',analysis:'选C，中国在亚洲东部'}],
                 summary:'认识中国的地理位置。'}
            ],summary:'掌握中国地理的基本情况。'},
            {title:'中国气候',icon:'🌡️',knowledgePoints:[
                {title:'气候类型',content:'• 温带季风气候：夏季高温多雨，冬季寒冷干燥<br>• 亚热带季风气候：夏季高温多雨，冬季温和少雨<br>• 热带季风气候：全年高温，分旱雨两季',
                 examples:[{title:'选择',content:'北京属于什么气候？<br>A. 温带季风 B. 亚热带季风 C. 热带季风',analysis:'选A，北京是温带季风气候'}],
                 summary:'了解中国主要气候类型。'}
            ],summary:'理解中国的气候特征。'}
        ]);
        
        // ========== 道德与法治 1-9年级 ==========
        this.register('dao zhi', 1, [
            {title:'规则意识',icon:'📏',knowledgePoints:[
                {title:'生活中的规则',content:'• 交通规则：红灯停，绿灯行<br>• 学校规则：按时上学，遵守纪律<br>• 公共规则：排队等候，不大声喧哗',
                 examples:[{title:'判断',content:'过马路时，即使没有车也应该等绿灯，原因是？',analysis:'遵守交通规则，保护自己和他人的安全'}],
                 summary:'认识生活中的各种规则。'}
            ],summary:'培养规则意识和安全意识。'},
            {title:'友谊与交往',icon:'🤝',knowledgePoints:[
                {title:'如何交朋友',content:'• 真诚待人<br>• 互相帮助<br>• 尊重他人<br>• 分享快乐',
                 examples:[{title:'情境',content:'同学不小心摔倒了，你应该？',analysis:'主动扶起同学，关心询问是否受伤'}],
                 summary:'学习正确的交往方式。'}
            ],summary:'学会与同学友好相处。'}
        ]);
        
        this.register('dao zhi', 2, [
            {title:'安全教育',icon:'🛡️',knowledgePoints:[
                {title:'安全知识',content:'• 不跟陌生人走<br>• 记住家长电话<br>• 发生火灾拨打119<br>• 遇到危险拨打110',
                 examples:[{title:'选择',content:'陌生人给你糖果，你应该？<br>A. 接受 B. 拒绝 C. 谢谢他',analysis:'选B，不接受陌生人的食物'}],
                 summary:'掌握基本的安全知识。'}
            ],summary:'提高自我保护意识。'},
            {title:'爱护自然',icon:'🌿',knowledgePoints:[
                {title:'保护环境',content:'• 不乱扔垃圾<br>• 节约用水用电<br>• 保护动植物<br>• 垃圾分类',
                 examples:[{title:'做法',content:'下列哪种做法有利于保护环境？<br>A. 随手关灯 B. 浪费纸张 C. 随地吐痰',analysis:'选A，随手关灯节约能源'}],
                 summary:'养成爱护环境的好习惯。'}
            ],summary:'培养环保意识和责任感。'}
        ]);
        
        this.register('dao zhi', 3, [
            {title:'法律初识',icon:'⚖️',knowledgePoints:[
                {title:'法律的作用',content:'• 法律规范人们的行为<br>• 法律保护人们的合法权益<br>• 违反法律要承担法律责任',
                 examples:[{title:'判断',content:'小学生也需要学习法律，因为？<br>A. 法律只约束大人 B. 法律保护每个人 C. 小学生不会违法',analysis:'选B，法律保护每个人的权益'}],
                 summary:'初步认识法律的作用。'}
            ],summary:'了解法律的基本知识。'},
            {title:'传统文化',icon:'🏮',knowledgePoints:[
                {title:'传统节日',content:'• 春节：团圆、拜年<br>• 中秋节：赏月、吃月饼<br>• 端午节：赛龙舟、吃粽子',
                 examples:[{title:'连线',content:'端午节对应？<br>A. 吃月饼 B. 赛龙舟 C. 贴春联',analysis:'选B，端午节赛龙舟吃粽子'}],
                 summary:'认识中国传统节日和文化。'}
            ],summary:'传承中华优秀传统文化。'}
        ]);
        
        this.register('dao zhi', 4, [
            {title:'历史故事',icon:'📜',knowledgePoints:[
                {title:'爱国故事',content:'• 岳飞精忠报国<br>• 林则徐虎门销烟<br>• 鲁迅弃医从文',
                 examples:[{title:'思考',content:'岳飞的故事告诉我们什么？',analysis:'要热爱祖国，忠于祖国'}],
                 summary:'学习爱国英雄的事迹。'}
            ],summary:'学习爱国英雄的事迹。'},
            {title:'民族文化',icon:'🎭',knowledgePoints:[
                {title:'民族文化多样性',content:'• 汉族：春节、中秋节<br>• 藏族：雪顿节<br>• 苗族：苗年<br>• 各民族共同组成中华民族大家庭',
                 examples:[{title:'选择',content:'我国有多少个民族？<br>A. 55个 B. 56个 C. 57个',analysis:'选B，我国有56个民族'}],
                 summary:'了解中华民族的多样性。'}
            ],summary:'认识民族文化和历史。'}
        ]);
        
        this.register('dao zhi', 5, [
            {title:'爱国主义',icon:'🇨🇳',knowledgePoints:[
                {title:'爱国主义内涵',content:'• 热爱祖国的大好河山<br>• 热爱祖国的历史文化<br>• 热爱祖国的各族人民<br>• 维护国家统一和民族团结',
                 examples:[{title:'做法',content:'下列体现爱国主义的是？<br>A. 破坏公共设施 B. 认真学习报效祖国 C. 嘲笑外国同学',analysis:'选B，认真学习是为祖国做贡献'}],
                 summary:'理解爱国主义的含义。'}
            ],summary:'理解爱国主义的含义。'},
            {title:'民主法治',icon:'⚖️',knowledgePoints:[
                {title:'民主意识',content:'• 班级民主：班委选举<br>• 学校民主：学生会选举<br>• 国家民主：人民代表大会',
                 examples:[{title:'参与',content:'班级选班长，体现了什么？<br>A. 专制 B. 民主 C. 独裁',analysis:'选B，选举班长是民主的表现'}],
                 summary:'培养民主法治意识。'}
            ],summary:'增强爱国主义和民主法治观念。'}
        ]);
        
        this.register('dao zhi', 6, [
            {title:'小学复习一',icon:'📚',knowledgePoints:[
                {title:'道德与法治回顾',content:'• 个人品德：诚实、守信、友善<br>• 家庭美德：孝敬父母、尊敬长辈<br>• 社会公德：文明礼貌、助人为乐<br>• 职业道德：爱岗敬业、诚实守信',
                 examples:[{title:'综合',content:'下列属于社会公德的是？<br>A. 孝敬父母 B. 尊老爱幼 C. 勤奋学习',analysis:'选B，尊老爱幼是社会公德'}],
                 summary:'系统复习小学道德与法治知识。'}
            ],summary:'全面回顾小学道德与法治内容。'},
            {title:'小学复习二',icon:'📖',knowledgePoints:[
                {title:'法律知识回顾',content:'• 宪法是国家的根本法<br>• 公民的基本权利和义务<br>• 未成年人保护法<br>• 预防未成年人犯罪法',
                 examples:[{title:'选择',content:'我国的根本法是？<br>A. 刑法 B. 民法 C. 宪法',analysis:'选C，宪法是国家的根本法'}],
                 summary:'复习小学法律知识。'}
            ],summary:'系统复习小学法律知识。'}
        ]);
        
        this.register('dao zhi', 7, [
            {title:'宪法与法律',icon:'⚖️',knowledgePoints:[
                {title:'宪法地位',content:'• 宪法是国家的根本法<br>• 具有最高的法律效力<br>• 规定国家最根本、最重要的问题',
                 examples:[{title:'判断',content:'宪法与普通法律的关系是？<br>A. 宪法是普通法律的总和<br>B. 普通法律不得与宪法相抵触<br>C. 宪法和普通法律效力相同',analysis:'选B，宪法是根本法，普通法律不得与其抵触'}],
                 summary:'理解宪法的地位和作用。'}
            ],summary:'认识宪法和法律的基本知识。'},
            {title:'经济与消费',icon:'💰',knowledgePoints:[
                {title:'市场经济',content:'• 商品交换的基本原则：等价交换<br>• 消费者权益：知情权、选择权、安全权等',
                 examples:[{title:'情境',content:'买到假冒伪劣产品，消费者可以？<br>A. 自认倒霉 B. 向消协投诉 C. 放弃维权',analysis:'选B，消费者有权向消协投诉维权'}],
                 summary:'了解经济和消费的基本知识。'}
            ],summary:'理解经济消费中的法律知识。'}
        ]);
        
        this.register('dao zhi', 8, [
            {title:'法律基础',icon:'📜',knowledgePoints:[
                {title:'法律特征',content:'• 由国家制定或认可<br>• 靠国家强制力保证实施<br>• 对全体社会成员具有普遍约束力',
                 examples:[{title:'区分',content:'法律与道德的主要区别是？<br>A. 法律更严格<br>B. 法律靠国家强制力实施<br>C. 道德更重要',analysis:'选B，法律靠国家强制力保证实施'}],
                 summary:'认识法律的基本特征。'}
            ],summary:'掌握法律基础知识。'},
            {title:'国家政策',icon:'🏛️',knowledgePoints:[
                {title:'改革开放',content:'• 开始时间：1978年<br>• 意义：强国之路<br>• 成就：经济快速发展，综合国力增强',
                 examples:[{title:'选择',content:'改革开放开始的会议是？<br>A. 中共七大 B. 中共十一届三中全会 C. 中共十九大',analysis:'选B，1978年十一届三中全会作出改革开放决策'}],
                 summary:'理解改革开放的重要意义。'}
            ],summary:'了解国家政策和发展成就。'}
        ]);
        
        this.register('dao zhi', 9, [
            {title:'法治与社会',icon:'⚖️',knowledgePoints:[
                {title:'依法治国',content:'• 依法治国是党领导人民治理国家的基本方略<br>• 法律面前人人平等<br>• 建设社会主义法治国家',
                 examples:[{title:'理解',content:'为什么说法律面前人人平等？',analysis:'因为任何人都没有超越法律的特权，违法行为都要受到法律制裁'}],
                 summary:'理解依法治国的基本理念。'}
            ],summary:'理解依法治国和基本法治理念。'},
            {title:'中考复习',icon:'📚',knowledgePoints:[
                {title:'道德与法治中考要点',content:'• 公民的基本权利和义务<br>• 宪法的基本原则<br>• 社会主义核心价值观<br>• 社会责任与担当',
                 examples:[{title:'综合',content:'如何践行社会主义核心价值观？',analysis:'从身边小事做起，爱国、敬业、诚信、友善'}],
                 summary:'系统复习中考道德与法治考点。'}
            ],summary:'全面复习中考道德与法治考点。'}
        ]);
        
        // ========== 科学 1-6年级 ==========
        this.register('kexue', 1, [
            {title:'植物',icon:'🌿',knowledgePoints:[
                {title:'植物的组成',content:'• 根、茎、叶、花、果实、种子<br>• 光合作用：植物利用阳光制造养料<br>• 蒸腾作用：水分从叶片散发',
                 examples:[{title:'观察',content:'植物的根有什么作用？',analysis:'吸收水分和无机盐，固定植物体'}],
                 summary:'认识植物的基本结构和功能。'}
            ],summary:'了解植物的基本知识和生长条件。'},
            {title:'动物',icon:'🐾',knowledgePoints:[
                {title:'动物的分类',content:'• 脊椎动物：鱼、两栖、爬行、鸟、哺乳<br>• 无脊椎动物：昆虫、软体、环节等<br>• 特征：能运动、需要食物、能繁殖',
                 examples:[{title:'判断',content:'下列属于哺乳动物的是？<br>A. 青蛙 B. 蛇 C. 猫',analysis:'选C，猫是哺乳动物，胎生哺乳'}],
                 summary:'认识动物的基本分类和特征。'}
            ],summary:'了解动物的基本知识和分类。'}
        ]);
        
        this.register('kexue', 2, [
            {title:'生命世界',icon:'🌱',knowledgePoints:[
                {title:'生命周期',content:'• 动物：卵生→孵化→成长→繁殖→衰老→死亡<br>• 植物：种子→发芽→成长→开花→结果→衰老',
                 examples:[{title:'举例',content:'蝴蝶的生命周期经过哪些阶段？',analysis:'卵→幼虫→蛹→成虫，属于完全变态发育'}],
                 summary:'理解生物的生命周期。'}
            ],summary:'认识生命世界的基本规律。'},
            {title:'地球与宇宙',icon:'🌍',knowledgePoints:[
                {title:'地球的形状',content:'• 地球是一个球体<br>• 昼夜交替：地球自转<br>• 四季变化：地球公转',
                 examples:[{title:'解释',content:'为什么会有白天和黑夜？',analysis:'地球自转，面向太阳的一面是白天，背向太阳的一面是黑夜'}],
                 summary:'了解地球和宇宙的基本知识。'}
            ],summary:'认识地球与宇宙的基本现象。'}
        ]);
        
        this.register('kexue', 3, [
            {title:'物质的变化',icon:'🧪',knowledgePoints:[
                {title:'物理变化和化学变化',content:'• 物理变化：没有新物质生成，如冰融化<br>• 化学变化：有新物质生成，如铁生锈<br>• 区别：是否有新物质生成',
                 examples:[{title:'判断',content:'下列属于化学变化的是？<br>A. 水结冰 B. 铁生锈 C. 玻璃破碎',analysis:'选B，铁生锈生成了新物质氧化铁'}],
                 summary:'区分物理变化和化学变化。'}
            ],summary:'了解物质的基本变化和性质。'},
            {title:'力',icon:'💪',knowledgePoints:[
                {title:'力的作用',content:'• 力可以使物体运动或停止<br>• 力可以使物体变形<br>• 力的单位：牛顿(N)',
                 examples:[{title:'举例',content:'推桌子时，桌子动了，说明力改变了物体的什么？',analysis:'力改变了物体的运动状态'}],
                 summary:'理解力的基本概念和作用。'}
            ],summary:'认识力和运动的基本关系。'}
        ]);
        
        this.register('kexue', 4, [
            {title:'能量与运动',icon:'⚡',knowledgePoints:[
                {title:'能量的形式',content:'• 动能：运动的物体具有的能量<br>• 势能：被举高的物体具有的能量<br>• 热能、电能、光能等',
                 examples:[{title:'分析',content:'从高处滚下的球，能量如何转化？',analysis:'势能转化为动能，高度降低速度增加'}],
                 summary:'了解能量的基本形式和转化。'}
            ],summary:'理解能量与运动的关系。'},
            {title:'地球表面',icon:'🏔️',knowledgePoints:[
                {title:'地形地貌',content:'• 五种基本地形：山地、高原、平原、盆地、丘陵<br>• 地表变化：内力作用(地震、火山)和外力作用(风化、侵蚀)',
                 examples:[{title:'判断',content:'珠穆朗玛峰属于哪种地形？<br>A. 平原 B. 山地 C. 盆地',analysis:'选B，珠峰是世界最高峰，属于山地'}],
                 summary:'认识地球表面的主要地形。'}
            ],summary:'掌握地球表面的基本特征。'}
        ]);
        
        this.register('kexue', 5, [
            {title:'细胞',icon:'🔬',knowledgePoints:[
                {title:'细胞的基本知识',content:'• 细胞是生物体结构和功能的基本单位<br>• 动物细胞：细胞膜、细胞质、细胞核<br>• 植物细胞：还有细胞壁、液泡、叶绿体',
                 examples:[{title:'比较',content:'植物细胞和动物细胞的主要区别是？',analysis:'植物细胞有细胞壁、液泡和叶绿体'}],
                 summary:'认识细胞的基本结构和功能。'}
            ],summary:'了解细胞的基本知识。'},
            {title:'生态系统',icon:'🌳',knowledgePoints:[
                {title:'生态系统的组成',content:'• 生产者：植物<br>• 消费者：动物<br>• 分解者：细菌、真菌<br>• 非生物部分：阳光、空气、水等',
                 examples:[{title:'分析',content:'在一个池塘生态系统中，生产者主要是？',analysis:'水草、藻类等绿色植物，能进行光合作用'}],
                 summary:'理解生态系统的基本组成。'}
            ],summary:'认识生态系统的结构和功能。'}
        ]);
        
        this.register('kexue', 6, [
            {title:'小学复习一',icon:'📚',knowledgePoints:[
                {title:'生命科学回顾',content:'• 生物的特征：需要营养、能呼吸、能排泄、能对外界刺激作出反应、能繁殖<br>• 细胞是生物体基本单位<br>• 生态系统：生物与环境形成的统一整体',
                 examples:[{title:'综合',content:'下列哪项不是生物的特征？<br>A. 能运动 B. 能生长繁殖 C. 需要营养',analysis:'选A，不是所有生物都能运动，如植物'}],
                 summary:'复习生命科学基础知识。'}
            ],summary:'系统复习生命科学内容。'},
            {title:'小学复习二',icon:'🔬',knowledgePoints:[
                {title:'物质科学回顾',content:'• 物质的三态：固态、液态、气态<br>• 物理变化vs化学变化<br>• 力与运动的关系',
                 examples:[{title:'判断',content:'水结冰是什么变化？<br>A. 物理变化 B. 化学变化',analysis:'选A，只是状态变化，没有新物质生成'}],
                 summary:'复习物质科学基础知识。'}
            ],summary:'系统复习物质科学内容。'}
        ]);

    }
};
