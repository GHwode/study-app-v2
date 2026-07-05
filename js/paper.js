// ==================== 出试卷功能 ====================
// 用户可选单元，系统从对应单元题目中随机组卷
const PaperMaker = {
    // 单元定义 — 按学科/年级组织
    units: {
        yuwen: {
            1: [{id:'g1',name:'识字与写字'},{id:'g2',name:'朗读与背诵'},{id:'r1',name:'看图说话'},{id:'r2',name:'简单阅读'}],
            2: [{id:'g1',name:'字词积累'},{id:'g2',name:'词语运用'},{id:'r1',name:'短文阅读'},{id:'w1',name:'写话练习'}],
            3: [{id:'g1',name:'字词巩固'},{id:'g2',name:'句式变换'},{id:'r1',name:'阅读理解'},{id:'w1',name:'习作入门'}],
            4: [{id:'g1',name:'字词运用'},{id:'g2',name:'句子理解'},{id:'r1',name:'课外阅读'},{id:'w1',name:'记叙文写作'}],
            5: [{id:'g1',name:'字词段篇'},{id:'g2',name:'修辞手法'},{id:'r1',name:'文学阅读'},{id:'w1',name:'作文训练'}],
            6: [{id:'g1',name:'小学复习'},{id:'g2',name:'综合运用'},{id:'r1',name:'深度阅读'},{id:'w1',name:'综合写作'}],
            7: [{id:'g1',name:'古诗词鉴赏'},{id:'g2',name:'文言文阅读'},{id:'r1',name:'现代文阅读'},{id:'w1',name:'写作表达'}],
            8: [{id:'g1',name:'古诗文积累'},{id:'g2',name:'名著阅读'},{id:'r1',name:'议论文阅读'},{id:'w1',name:'审题立意'}],
            9: [{id:'g1',name:'中考复习'},{id:'g2',name:'综合素养'},{id:'r1',name:'拓展阅读'},{id:'w1',name:'考场作文'}]
        },
        shuxue: {
            1: [{id:'num',name:'数的认识'},{id:'calc',name:'加减法'},{id:'shape',name:'图形认识'},{id:'measure',name:'简单测量'}],
            2: [{id:'mult',name:'乘法口诀'},{id:'div',name:'除法初步'},{id:'shape',name:'图形与位置'},{id:'measure',name:'长度单位'}],
            3: [{id:'mult2',name:'乘法进阶'},{id:'div2',name:'除法进阶'},{id:'frac',name:'分数初步'},{id:'shape',name:'长方形正方形'}],
            4: [{id:'big',name:'大数认识'},{id:'mul',name:'三位数乘两位数'},{id:'div3',name:'除数是两位数'},{id:'frac',name:'分数与小数的认识'}],
            5: [{id:'dec',name:'小数加减'},{id:'dec2',name:'小数乘除'},{id:'frac2',name:'分数四则运算'},{id:'shape2',name:'多边形面积'}],
            6: [{id:'ratio',name:'比和比例'},{id:'percent',name:'百分数'},{id:'circle',name:'圆的认识'},{id:'review',name:'总复习'}],
            7: [{id:'rat',name:'有理数'},{id:'expr',name:'整式的加减'},{id:'eq',name:'一元一次方程'},{id:'geo',name:'几何图形初步'}],
            8: [{id:'tri',name:'三角形'},{id:'poly',name:'平行四边形'},{id:'sqrt',name:'实数'},{id:'func',name:'函数初步'}],
            9: [{id:'quad',name:'一元二次方程'},{id:'parabola',name:'二次函数'},{id:'prob',name:'概率与统计'},{id:'sim',name:'相似形'}]
        },
        yingyu: {
            1: [{id:'greet',name:'问候与介绍'},{id:'color',name:'颜色与数字'},{id:'family',name:'家庭成员'},{id:'animal',name:'动物名称'}],
            2: [{id:'food',name:'食物与饮料'},{id:'body',name:'身体部位'},{id:'clothes',name:'衣物'},{id:'weather',name:'天气'}],
            3: [{id:'daily',name:'日常生活'},{id:'season',name:'季节与节日'},{id:'hobby',name:'兴趣爱好'},{id:'place',name:'地点与方向'}],
            4: [{id:'school',name:'学校生活'},{id:'time',name:'时间与日期'},{id:'nature',name:'自然景物'},{id:'emotion',name:'情感表达'}],
            5: [{id:'travel',name:'旅行与交通'},{id:'health',name:'健康与运动'},{id:'culture',name:'文化常识'},{id:'future',name:'将来计划'}],
            6: [{id:'review1',name:'小学复习一'},{id:'review2',name:'小学复习二'},{id:'review3',name:'小学复习三'},{id:'review4',name:'综合提升'}],
            7: [{id:'tense1',name:'一般现在时'},{id:'tense2',name:'现在进行时'},{id:'tense3',name:'一般过去时'},{id:'grammar',name:'基础语法'}],
            8: [{id:'tense4',name:'一般将来时'},{id:'tense5',name:'过去进行时'},{id:'passive',name:'被动语态'},{id:'clause',name:'宾语从句'}],
            9: [{id:'tense6',name:'现在完成时'},{id:'condition',name:'条件状语从句'},{id:'report',name:'直接引语间接引语'},{id:'review',name:'中考复习'}]
        },
        wuli: {
            7: [{id:'motion',name:'运动与力'},{id:'sound',name:'声现象'},{id:'light',name:'光现象'},{id:'measure',name:'测量基础'}],
            8: [{id:'force',name:'力与运动'},{id:'pressure',name:'压强'},{id:'buoyancy',name:'浮力'},{id:'work',name:'功与机械能'}],
            9: [{id:'circuit',name:'电路基础'},{id:'current',name:'欧姆定律'},{id:'electric',name:'电功率'},{id:'electromag',name:'电磁现象'}]
        },
        huaxue: {
            8: [{id:'change',name:'物质的变化'},{id:'air',name:'空气与氧气'},{id:'water',name:'水与溶液'},{id:'atom',name:'原子与分子'}],
            9: [{id:'equation',name:'化学方程式'},{id:'acid',name:'酸碱盐'},{id:'metal',name:'金属与合金'},{id:'organic',name:'有机化学基础'}]
        },
        shengwu: {
            7: [{id:'cell',name:'细胞的结构'},{id:'plant',name:'植物生理'},{id:'organism',name:'生物体的结构层次'},{id:'ecosystem',name:'生态系统'}],
            8: [{id:'life',name:'生命的延续'},{id:'evolution',name:'生物的进化'},{id:'behavior',name:'动物的行为'},{id:'micro',name:'微生物'}]
        },
        lishi: {
            7: [{id:'ancient1',name:'古代中国一'},{id:'ancient2',name:'古代中国二'},{id:'culture',name:'文化与科技'},{id:'foreign1',name:'古代外国'}],
            8: [{id:'modern1',name:'近代探索一'},{id:'modern2',name:'近代探索二'},{id:'revolution',name:'革命运动'},{id:'reform',name:'改革与开放'}]
        },
        dili: {
            7: [{id:'earth',name:'地球与地图'},{id:'climate',name:'气候与天气'},{id:'ocean',name:'海洋与陆地'},{id:'continent',name:'大洲与大洲'}],
            8: [{id:'china_geo',name:'中国地理'},{id:'climate_cn',name:'中国气候'},{id:'river',name:'中国的河流'},{id:'resource',name:'自然资源'}]
        },
        'dao zhi': {
            1: [{id:'rule',name:'规则意识'},{id:'friend',name:'友谊与交往'},{id:'school',name:'校园生活'},{id:'family',name:'家庭与亲情'}],
            2: [{id:'safety',name:'安全教育'},{id:'nature',name:'爱护自然'},{id:'country',name:'爱国教育'},{id:'help',name:'互助友爱'}],
            3: [{id:'law1',name:'法律初识'},{id:'tradition',name:'传统文化'},{id:'community',name:'社区生活'},{id:'responsibility',name:'责任意识'}],
            4: [{id:'history1',name:'历史故事'},{id:'culture2',name:'民族文化'},{id:'society',name:'社会公德'},{id:'rights',name:'权利与义务'}],
            5: [{id:'patriot',name:'爱国主义'},{id:'democracy',name:'民主法治'},{id:'spirit',name:'民族精神'},{id:'global',name:'全球视野'}],
            6: [{id:'review1',name:'小学复习一'},{id:'review2',name:'小学复习二'},{id:'review3',name:'小学复习三'},{id:'review4',name:'综合提升'}],
            7: [{id:'constitution',name:'宪法与法律'},{id:'economy',name:'经济与消费'},{id:'society2',name:'社会发展'},{id:'morality',name:'道德修养'}],
            8: [{id:'law2',name:'法律基础'},{id:'policy',name:'国家政策'},{id:'international',name:'国际关系'},{id:'citizen',name:'公民素养'}],
            9: [{id:'review',name:'中考复习'},{id:'ideology',name:'思想引领'},{id:'practice',name:'社会实践'},{id:'vision',name:'未来规划'}]
        },
        kexue: {
            1: [{id:'plant',name:'植物'},{id:'animal',name:'动物'},{id:'weather1',name:'天气'},{id:'matter',name:'物质'}],
            2: [{id:'life2',name:'生命世界'},{id:'earth',name:'地球与宇宙'},{id:'tech',name:'技术与工程'},{id:'energy',name:'能量'}],
            3: [{id:'matter2',name:'物质的变化'},{id:'force1',name:'力'},{id:'sound2',name:'声音'},{id:'light2',name:'光'}],
            4: [{id:'energy2',name:'能量与运动'},{id:'earth2',name:'地球表面'},{id:'life3',name:'生物与环境'},{id:'tech2',name:'技术与设计'}],
            5: [{id:'cell1',name:'细胞'},{id:'genetics',name:'遗传与变异'},{id:'ecosystem1',name:'生态系统'},{id:'universe',name:'宇宙'}],
            6: [{id:'review1',name:'小学复习一'},{id:'review2',name:'小学复习二'},{id:'review3',name:'小学复习三'},{id:'review4',name:'综合提升'}]
        }
    },

    // 获取题目池
    getQuestionPool(subject, grade, unitIds) {
        const pool = [];
        const keyMap = {
            yuwen: 'CHINESE_Q',
            shuxue: 'MATH_Q',
            yingyu: 'ENGLISH_Q',
            wuli: 'PHYSICS_Q',
            huaxue: 'CHEMISTRY_Q',
            shengwu: 'BIOLOGY_Q',
            lishi: 'HISTORY_Q',
            dili: 'GEOGRAPHY_Q',
            'dao zhi': 'MORAL_Q',
            kexue: 'SCIENCE_Q'
        };
        const globalKey = keyMap[subject];
        
        for (const uid of unitIds) {
            // 优先从 exam_data.js 中按单元筛选（如果有）
            // 否则从全局题库中按 subject/grade 筛选
            if (globalKey && window[globalKey]) {
                const src = window[globalKey];
                if (Array.isArray(src)) {
                    // 全局题库（如 CHINESE_Q, ENGLISH_Q, MORAL_Q）
                    src.forEach(q => {
                        if (q.subject === subject || q.subject === undefined) {
                            pool.push({...q, unitId: uid});
                        }
                    });
                } else if (typeof src === 'object') {
                    // 按年级分类的题库
                    const gradeData = src[grade];
                    if (gradeData && Array.isArray(gradeData)) {
                        gradeData.forEach(q => pool.push({...q, unitId: uid}));
                    }
                }
            }
        }
        return pool;
    },

    // 随机选取 n 道题
    pickRandom(arr, n) {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(n, shuffled.length));
    },

    // 生成试卷
    generate(subject, grade, selectedUnits, options = {}) {
        const unitIds = selectedUnits.map(u => u.id);
        const pool = this.getQuestionPool(subject, grade, unitIds);
        
        if (pool.length === 0) {
            return { error: '该单元暂无题目，请先添加题目数据' };
        }

        const choiceCount = options.choiceCount || Math.min(10, Math.floor(pool.length * 0.3));
        const fillCount = options.fillCount || Math.min(5, Math.floor(pool.length * 0.15));
        const calcCount = options.calcCount || Math.min(3, Math.floor(pool.length * 0.1));
        
        const choices = this.pickRandom(pool.filter(q => q.options), choiceCount);
        const fills = this.pickRandom(pool.filter(q => !q.options), fillCount);
        const calcs = this.pickRandom(pool.filter(q => q.type === 'calc' || q.type === 'solve' || q.type === 'word'), calcCount);

        const paper = {
            id: 'paper_' + Date.now(),
            subject,
            grade,
            units: selectedUnits,
            title: options.title || `${GRADE_NAMES[grade]}${GRADE_LABELS[grade] ? '（' + GRADE_LABELS[grade] + '年级' : ''} ${SUBJECTS[subject]?.name || subject} 单元测试`,
            totalTime: options.totalTime || 60,
            totalScore: options.totalScore || (choices.length * 3) + (fills.length * 4) + (calcs.length * 6),
            createdAt: new Date().toLocaleString('zh-CN'),
            sections: []
        };

        if (choices.length > 0) {
            paper.sections.push({
                title: '一、选择题（每题3分，共' + (choices.length * 3) + '分）',
                type: 'choice',
                questions: choices.map((q, i) => ({...q, num: i + 1}))
            });
        }
        if (fills.length > 0) {
            paper.sections.push({
                title: '二、填空题（每题4分，共' + (fills.length * 4) + '分）',
                type: 'fill',
                questions: fills.map((q, i) => ({...q, num: i + 1}))
            });
        }
        if (calcs.length > 0) {
            paper.sections.push({
                title: '三、解答题（每题6分，共' + (calcs.length * 6) + '分）',
                type: 'calc',
                questions: calcs.map((q, i) => ({...q, num: i + 1}))
            });
        }

        return paper;
    },

    // 渲染试卷选择页面
    renderSelectPage(subject, grade) {
        const container = document.getElementById('page-paper');
        if (!container) return;
        
        const units = this.units[subject]?.[grade] || [];
        const subjectName = SUBJECTS[subject]?.name || subject;
        const gradeLabel = GRADE_NAMES[grade];
        
        // 保存当前选择
        this._pickedSubject = subject;
        this._pickedGrade = grade;
        
        let html = '';
        html += '<div class="breadcrumb">';
        html += '<a onclick="showPage(\'subject\')">选择学科</a> › ';
        html += '<a onclick="showPage(\'grade\')">' + gradeLabel + '</a> › ';
        html += '<span>出试卷</span>';
        html += '</div>';
        
        html += '<div class="card">';
        html += '<div class="card-title">📋 ' + gradeLabel + ' ' + subjectName + ' — 选择考试范围</div>';
        
        // 单元选择
        html += '<p class="subtitle">请勾选要纳入考试的单元（可多选）</p>';
        html += '<div class="unit-select-list">';
        units.forEach((u, i) => {
            html += '<label style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0;border-bottom:1px solid #f0f0f0;cursor:pointer">';
            html += '<input type="checkbox" class="unit-checkbox" value="' + i + '" checked style="width:18px;height:18px;cursor:pointer">';
            html += '<span style="font-size:0.9rem">' + u.name + '</span>';
            html += '</label>';
        });
        html += '</div>';
        
        // 全选/反选
        html += '<div style="display:flex;gap:0.5rem;margin:0.8rem 0">';
        html += '<button class="btn btn-outline" onclick="selectAllUnits(true)">全选</button>';
        html += '<button class="btn btn-outline" onclick="selectAllUnits(false)">反选</button>';
        html += '</div>';
        
        // 试卷设置
        html += '<div class="card" style="margin-top:1rem;border:1px dashed var(--border);background:#fafafa">';
        html += '<div class="card-title" style="font-size:1rem">⚙️ 试卷设置</div>';
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.8rem">';
        
        html += '<div><label style="font-size:0.85rem;color:var(--text-secondary)">试卷名称</label>';
        html += '<input type="text" class="search-input" id="paperTitle" value="' + gradeLabel + subjectName + '单元测试" style="margin-top:0.3rem;width:100%">';
        html += '</div>';
        
        html += '<div><label style="font-size:0.85rem;color:var(--text-secondary)">考试时间（分钟）</label>';
        html += '<input type="number" class="search-input" id="paperTime" value="60" min="15" max="180" style="margin-top:0.3rem;width:100%">';
        html += '</div>';
        
        html += '<div><label style="font-size:0.85rem;color:var(--text-secondary)">选择题数量</label>';
        html += '<input type="number" class="search-input" id="paperChoice" value="10" min="1" max="30" style="margin-top:0.3rem;width:100%">';
        html += '</div>';
        
        html += '<div><label style="font-size:0.85rem;color:var(--text-secondary)">填空题数量</label>';
        html += '<input type="number" class="search-input" id="paperFill" value="5" min="0" max="15" style="margin-top:0.3rem;width:100%">';
        html += '</div>';
        
        html += '<div><label style="font-size:0.85rem;color:var(--text-secondary)">解答题数量</label>';
        html += '<input type="number" class="search-input" id="paperCalc" value="3" min="0" max="10" style="margin-top:0.3rem;width:100%">';
        html += '</div>';
        
        html += '</div></div>';
        
        // 生成按钮
        html += '<div style="display:flex;gap:0.6rem;margin-top:1.2rem;flex-wrap:wrap">';
        html += '<button class="btn btn-primary" onclick="PaperMaker.generateAndShow()">📝 生成试卷</button>';
        html += '<button class="btn btn-outline" onclick="showPage(\'grade\')">返回</button>';
        html += '</div>';
        
        html += '</div>';
        
        container.innerHTML = html;
    },

    // 全选/反选
    toggleSelectAll(select) {
        document.querySelectorAll('.unit-checkbox').forEach(cb => cb.checked = select);
    },

    // 生成并展示试卷
    generateAndShow() {
        // 优先用从首页入口传入的学科/年级，否则用内部状态
        const subject = this._pickedSubject || (App.state?.currentSubject) || 'shuxue';
        const grade = this._pickedGrade || (App.state?.currentGrade) || 1;
        
        // 获取选中的单元
        const checkboxes = document.querySelectorAll('.unit-checkbox:checked');
        const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.value));
        const units = this.units[subject]?.[grade] || [];
        const selectedUnits = selectedIndices.map(i => units[i]);
        
        if (selectedUnits.length === 0) {
            showToast('⚠️ 请至少选择一个单元');
            return;
        }
        
        // 读取设置
        const title = document.getElementById('paperTitle').value;
        const totalTime = parseInt(document.getElementById('paperTime').value) || 60;
        const choiceCount = parseInt(document.getElementById('paperChoice').value) || 10;
        const fillCount = parseInt(document.getElementById('paperFill').value) || 5;
        const calcCount = parseInt(document.getElementById('paperCalc').value) || 3;
        
        const paper = this.generate(subject, grade, selectedUnits, {
            title, totalTime, choiceCount, fillCount, calcCount
        });
        
        if (paper.error) {
            showToast('⚠️ ' + paper.error);
            return;
        }
        
        // 保存到 localStorage
        const papers = JSON.parse(localStorage.getItem('tm_papers') || '[]');
        papers.unshift(paper);
        localStorage.setItem('tm_papers', JSON.stringify(papers));
        
        // 渲染试卷
        this.renderPaper(paper);
    },

    // 渲染试卷
    renderPaper(paper) {
        const container = document.getElementById('page-paper');
        if (!container) return;
        
        let html = '';
        html += '<div class="breadcrumb">';
        html += '<a onclick="PaperMaker.renderSelectPage(\'' + paper.subject + '\',' + paper.grade + ')">选择范围</a> › ';
        html += '<span>试卷预览</span>';
        html += '</div>';
        
        // 试卷头部
        html += '<div class="card" style="text-align:center;border:2px solid var(--primary);padding:2rem 1.5rem">';
        html += '<h2 style="font-size:1.3rem;color:var(--primary);margin-bottom:0.5rem">' + paper.title + '</h2>';
        html += '<p style="font-size:0.85rem;color:var(--text-secondary)">考试时间：' + paper.totalTime + '分钟  满分：' + paper.totalScore + '分</p>';
        html += '<p style="font-size:0.82rem;color:var(--text-secondary);margin-top:0.5rem">生成时间：' + paper.createdAt + ' | 范围：' + paper.units.map(u => u.name).join('、') + '</p>';
        html += '<div style="margin-top:1rem;display:flex;gap:0.6rem;justify-content:center;flex-wrap:wrap">';
        html += '<button class="btn btn-primary" onclick="window.print()">🖨️ 打印试卷</button>';
        html += '<button class="btn btn-outline" onclick="PaperMaker.exportPaper(\'' + paper.id + '\')">📤 导出TXT</button>';
        html += '<button class="btn btn-outline" onclick="PaperMaker.renderSelectPage(\'' + paper.subject + '\',' + paper.grade + ')">🔄 重新生成</button>';
        html += '<button class="btn btn-outline" onclick="showPage(\'grade\')">返回</button>';
        html += '</div>';
        html += '</div>';
        
        // 试卷内容
        paper.sections.forEach(section => {
            html += '<div class="card" style="page-break-after:always">';
            html += '<div class="card-title" style="font-size:1rem">' + section.title + '</div>';
            section.questions.forEach(q => {
                html += '<div style="margin-bottom:1.2rem;padding-bottom:0.8rem;border-bottom:1px dashed #eee">';
                html += '<p style="font-weight:700;margin-bottom:0.5rem">' + q.num + '. ' + q.q + '</p>';
                if (q.options) {
                    const letters = ['A', 'B', 'C', 'D'];
                    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 1.5rem;margin-left:1rem">';
                    q.options.forEach((opt, i) => {
                        html += '<p style="font-size:0.9rem">' + letters[i] + '. ' + opt + '</p>';
                    });
                    html += '</div>';
                }
                html += '</div>';
            });
            html += '</div>';
        });
        
        container.innerHTML = html;
    },

    // 导出试卷为 TXT
    exportPaper(paperId) {
        const papers = JSON.parse(localStorage.getItem('tm_papers') || '[]');
        const paper = papers.find(p => p.id === paperId);
        if (!paper) { showToast('⚠️ 未找到试卷'); return; }
        
        let text = paper.title + '\n';
        text += '考试时间：' + paper.totalTime + '分钟  满分：' + paper.totalScore + '分\n';
        text += '范围：' + paper.units.map(u => u.name).join('、') + '\n\n';
        
        paper.sections.forEach(section => {
            text += section.title + '\n\n';
            section.questions.forEach(q => {
                text += q.num + '. ' + q.q + '\n';
                if (q.options) {
                    const letters = ['A', 'B', 'C', 'D'];
                    q.options.forEach((opt, i) => {
                        text += '  ' + letters[i] + '. ' + opt + '\n';
                    });
                }
                text += '\n';
            });
        });
        
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = paper.title.replace(/[\/\\:*?"<>|]/g, '_') + '.txt';
        a.click();
        URL.revokeObjectURL(url);
        showToast('✅ 试卷已导出');
    },

    // 首页快捷入口 — 弹出学科/年级选择
    showQuickSelect() {
        const container = document.getElementById('page-paper');
        if (!container) return;
        
        let html = '<div class="card"><div class="card-title">📋 出试卷 — 选择学科和年级</div>';
        html += '<p class="subtitle">先选择学科和年级，再从单元中勾选范围</p>';
        
        // 学科选择
        html += '<div style="margin-bottom:1rem"><label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem">学科</label>';
        html += '<div class="grid grid-5" style="grid-template-columns:repeat(auto-fill,minmax(100px,1fr))">';
        for (const [key, s] of Object.entries(SUBJECTS)) {
            html += '<div class="topic-item" onclick="PaperMaker.pickSubject(\'' + key + '\')" style="cursor:pointer">' + s.icon + ' ' + s.name + '</div>';
        }
        html += '</div></div>';
        
        // 年级选择
        html += '<div style="margin-bottom:1rem"><label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem">年级</label>';
        html += '<div class="grade-selector" id="paperGradeSelector">';
        for (let g = 1; g <= 9; g++) {
            html += '<button class="grade-btn" onclick="PaperMaker.pickGrade(' + g + ')">' + GRADE_NAMES[g] + '</button>';
        }
        html += '</div></div>';
        
        html += '<button class="btn btn-outline" onclick="showPage(\'home\')">返回</button>';
        html += '</div>';
        
        container.innerHTML = html;
        App.showPage('paper');
    },

    pickSubject(subject) {
        this._tempSubject = subject;
        // 高亮选中
        document.querySelectorAll('#page-paper .topic-item').forEach(el => {
            el.style.borderColor = el.textContent.includes(SUBJECTS[subject]?.icon) ? 'var(--primary)' : '';
            el.style.background = el.textContent.includes(SUBJECTS[subject]?.icon) ? '#fef2f2' : '';
        });
        // 简化：直接跳到年级选择
        this._pickedSubject = subject;
        showToast('已选 ' + SUBJECTS[subject].name);
    },

    pickGrade(grade) {
        if (!this._pickedSubject) {
            showToast('⚠️ 请先选择学科');
            return;
        }
        this.renderSelectPage(this._pickedSubject, grade);
    }
};
