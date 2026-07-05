const App = {
    currentPage: 'home',
    pageStack: [],
    currentSubject: null,
    currentGrade: null,
    currentChapter: null,
    currentTopic: null,
    
    init() {
        this.renderSubjectGrid();
        this.renderNav();
        this.updateHeader('全学段学习助手');
    },
    
    updateHeader(title) {
        document.getElementById('headerTitle').textContent = title;
    },
    
    showPage(pageId, data) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const el = document.getElementById('page-' + pageId);
        if (el) { el.classList.add('active'); }
        
        if (pageId !== 'home') {
            this.pageStack.push(this.currentPage);
            document.getElementById('backBtn').classList.add('visible');
        } else {
            this.pageStack = [];
            document.getElementById('backBtn').classList.remove('visible');
        }
        
        this.currentPage = pageId;
        if (data) this['render_' + pageId]?.(data);
    },
    
    goBack() {
        if (this.pageStack.length === 0) return;
        const prev = this.pageStack.pop();
        this.showPage(prev);
        this.updateNav();
    },
    
    updateNav() {
        const nav = document.getElementById('mainNav');
        let html = '<button class="nav-btn' + (this.currentPage==='home'?' active':'') + '" onclick="App.showPage(\'home\')">🏠 首页</button>';
        if (this.currentSubject) {
            const sName = SUBJECTS[this.currentSubject]?.name || '';
            html += '<button class="nav-btn active">' + (SUBJECTS[this.currentSubject]?.icon||'') + ' ' + sName + '</button>';
        }
        if (this.currentGrade) {
            html += '<button class="nav-btn active">第' + GRADE_LABELS[this.currentGrade] + '年级</button>';
        }
        nav.innerHTML = html;
    },
    
    renderSubjectGrid() {
        const grid = document.getElementById('subjectGrid');
        let html = '';
        for (const [key, s] of Object.entries(SUBJECTS)) {
            const gradeRange = s.grades.length > 1 ? s.grades[0]+'-'+s.grades[s.grades.length-1]+'年级' : s.grades[0]+'年级';
            html += '<div class="subject-card" onclick="App.selectSubject(\'' + key + '\')" data-subject="' + key + '">';
            html += '<div class="icon">' + s.icon + '</div>';
            html += '<div class="name">' + s.name + '</div>';
            html += '<div class="desc">' + gradeRange + '</div>';
            html += '</div>';
        }
        grid.innerHTML = html;
    },
    
    selectSubject(subject) {
        this.currentSubject = subject;
        this.showPage('grade', subject);
        this.updateNav();
    },
    
    render_grade(subject) {
        const s = SUBJECTS[subject];
        const container = document.getElementById('page-grade');
        let html = '<div class="breadcrumb"><a onclick="App.showPage(\'home\')">🏠 首页</a> <span>›</span> <span>' + s.icon + ' ' + s.name + '</span></div>';
        html += '<div class="card"><div class="card-title">' + s.icon + ' ' + s.name + ' - 选择年级</div>';
        html += '<div class="grade-selector">';
        s.grades.forEach(g => {
            html += '<button class="grade-btn' + (this.currentGrade===g?' active':'') + '" onclick="App.selectGrade(' + g + ')">' + GRADE_LABELS[g] + '年级</button>';
        });
        html += '</div></div>';
        container.innerHTML = html;
    },
    
    selectGrade(grade) {
        this.currentGrade = grade;
        this.showPage('chapter', {subject: this.currentSubject, grade});
        this.updateNav();
    },
    
    render_chapter(data) {
        const {subject, grade} = data;
        const s = SUBJECTS[subject];
        const container = document.getElementById('page-chapter');
        const gradeLabel = GRADE_LABELS[grade];
        
        let chapters = [];
        if (subject === 'shuxue') {
            chapters = this.getMathChapters(grade);
        } else if (subject === 'wuli') {
            chapters = grade === 7 ? [{id:'motion',name:'机械运动'},{id:'sound',name:'声现象'},{id:'light',name:'光现象'},{id:'mass',name:'质量与密度'},{id:'force',name:'力和运动'}] :
                       grade === 8 ? [{id:'force',name:'力和力学'},{id:'pressure',name:'压强'},{id:'buoyancy',name:'浮力'},{id:'work',name:'功和机械能'}] :
                       [{id:'electricity',name:'电学基础'},{id:'magnetism',name:'磁现象'},{id:'energy',name:'能量与能源'}];
        } else if (subject === 'huaxue') {
            chapters = grade === 8 ? [{id:'basics',name:'化学入门'},{id:'air',name:'空气与氧气'},{id:'water',name:'水与溶液'}] :
                       [{id:'atom',name:'微粒构成物质'},{id:'equation',name:'化学方程式'},{id:'metal',name:'金属与矿物'},{id:'acid_base',name:'酸碱盐'}];
        } else if (subject === 'yingyu') {
            chapters = grade <= 6 ? [{id:'basics',name:'基础词汇'},{id:'grammar',name:'语法基础'},{id:'dialogue',name:'日常对话'},{id:'reading',name:'阅读理解'}] :
                       [{id:'grammar',name:'语法进阶'},{id:'vocabulary',name:'核心词汇'},{id:'listening',name:'听力训练'},{id:'writing',name:'写作训练'}];
        } else if (subject === 'yuwen') {
            chapters = grade <= 6 ? [{id:'pinyin',name:'拼音'},{id:'characters',name:'识字写字'},{id:'reading',name:'阅读理解'},{id:'writing',name:'作文写作'},{id:'poetry',name:'古诗词'}] :
                       [{id:'classical',name:'文言文'},{id:'modern',name:'现代文阅读'},{id:'writing',name:'作文'},{id:'poetry',name:'古诗词鉴赏'},{id:'language',name:'语言运用'}];
        } else if (subject === 'shengwu') {
            chapters = grade === 7 ? [{id:'cell',name:'细胞'},{id:'plant',name:'植物'},{id:'animal',name:'动物'},{id:'ecology',name:'生态系统'}] :
                       [{id:'reproduction',name:'生殖发育'},{id:'genetics',name:'遗传变异'},{id:'evolution',name:'进化'},{id:'health',name:'健康生活'}];
        } else if (subject === 'lishi') {
            chapters = grade === 7 ? [{id:'ancient',name:'古代史'},{id:'culture',name:'文化科技'}] :
                       [{id:'modern',name:'近代史'},{id:'contemporary',name:'现代史'}];
        } else if (subject === 'dili') {
            chapters = grade === 7 ? [{id:'earth',name:'地球与地图'},{id:'climate',name:'天气与气候'},{id:'water',name:'水资源'}] :
                       [{id:'china_loc',name:'疆域人口'},{id:'terrain',name:'地形气候'},{id:'river',name:'河流湖泊'},{id:'resource',name:'自然资源'}];
        } else if (subject === 'daozhi') {
            chapters = grade <= 6 ? [{id:'morality',name:'道德规范'},{id:'rule',name:'规则意识'},{id:'emotion',name:'情感培养'},{id:'life',name:'热爱生活'}] :
                       [{id:'constitution',name:'宪法法律'},{id:'rights',name:'权利义务'},{id:'society',name:'社会生活'},{id:'country',name:'国家认知'}];
        } else if (subject === 'kexue') {
            chapters = [{id:'nature',name:'自然界'},{id:'life',name:'生命科学'},{id:'matter',name:'物质科学'},{id:'energy',name:'能量世界'},{id:'earth',name:'地球宇宙'}];
        }
        
        let html = '<div class="breadcrumb"><a onclick="App.showPage(\'home\')">🏠 首页</a> <span>›</span> <a onclick="App.selectSubject(\'' + subject + '\')">' + s.icon + ' ' + s.name + '</a> <span>›</span> <span>' + gradeLabel + '年级</span></div>';
        html += '<div class="card"><div class="card-title">' + s.icon + ' ' + s.name + ' ' + gradeLabel + '年级 - 选择章节</div>';
        html += '<div class="topic-list">';
        chapters.forEach((ch, i) => {
            html += '<div class="topic-item" onclick="App.selectChapter(\'' + ch.id + '\')">';
            html += '<span>' + (i+1) + '. ' + ch.name + '</span>';
            html += '<span class="arrow">›</span></div>';
        });
        html += '</div></div>';
        
        // 答题入口
        html += '<div class="card" style="margin-top:0.8rem"><div class="card-title">🎯 在线答题</div>';
        html += '<div class="topic-item" onclick="Quiz.start(\'' + subject + '\', ' + grade + ')"><span>开始答题（随机出题）</span><span class="arrow">›</span></div>';
        html += '</div>';
        
        // 考试入口
        html += '<div class="card" style="margin-top:0.8rem"><div class="card-title">📝 模拟考试</div>';
        html += '<div class="topic-item" onclick="Exam.start(\'' + subject + '\', ' + grade + ')"><span>进入考试模式（带倒计时和暂停）</span><span class="arrow">›</span></div>';
        html += '</div>';
        
        container.innerHTML = html;
    },
    
    getMathChapters(grade) {
        const map = {
            1: [{id:'numbers',name:'数的认识'},{id:'calc',name:'加减法'},{id:'shapes',name:'图形认识'}],
            2: [{id:'multiply',name:'乘法口诀'},{id:'measure',name:'测量单位'},{id:'shapes',name:'图形与位置'}],
            3: [{id:'mult_div',name:'乘除法'},{id:'fraction',name:'分数初步'},{id:'area',name:'面积和周长'}],
            4: [{id:'large_num',name:'大数的认识'},{id:'op_laws',name:'运算定律'},{id:'geometry',name:'几何图形'}],
            5: [{id:'decimal',name:'小数'},{id:'fraction2',name:'分数运算'},{id:'equation',name:'简易方程'}],
            6: [{id:'ratio',name:'比和比例'},{id:'percentage',name:'百分数'},{id:'circle',name:'圆的认识'}],
            7: [{id:'rational',name:'有理数'},{id:'equation',name:'方程'},{id:'geometry',name:'几何初步'}],
            8: [{id:'linear_eq',name:'一次方程组'},{id:'function',name:'函数初步'},{id:'triangle',name:'三角形'}],
            9: [{id:'quadratic',name:'二次函数'},{id:'inequality',name:'不等式'},{id:'probability',name:'概率统计'}]
        };
        return map[grade] || [{id:'general',name:'综合复习'}];
    },
    
    selectChapter(chapterId) {
        this.currentChapter = chapterId;
        this.showPage('knowledge', {subject: this.currentSubject, grade: this.currentGrade, chapter: chapterId});
        this.updateNav();
    },
    
    render_knowledge(data) {
        const {subject, grade, chapter} = data;
        const s = SUBJECTS[subject];
        const container = document.getElementById('page-knowledge');
        const gradeLabel = GRADE_LABELS[grade];
        
        let topics = this.generateKnowledgePoints(subject, grade, chapter);
        
        let html = '<div class="breadcrumb"><a onclick="App.showPage(\'home\')">🏠 首页</a> <span>›</span> <a onclick="App.selectSubject(\'' + subject + '\')">' + s.icon + ' ' + s.name + '</a> <span>›</span> <span>' + gradeLabel + '年级</span> <span>›</span> <span>' + (topics.name||'知识点') + '</span></div>';
        html += '<div class="card"><div class="card-title">📖 ' + s.icon + ' ' + s.name + ' ' + gradeLabel + '年级 - ' + (topics.name||'知识点') + '</div>';
        
        if (topics.highFreq) {
            html += '<div class="high-frequency"><h4>🔥 高频考点</h4><ul>';
            topics.highFreq.forEach(h => html += '<li>' + h + '</li>');
            html += '</ul></div>';
        }
        
        if (topics.points) {
            topics.points.forEach(p => {
                html += '<div class="knowledge-point">';
                html += '<h4>' + p.title + '</h4>';
                html += '<p>' + p.content + '</p>';
                if (p.formula) html += '<div class="formula">📐 ' + p.formula + '</div>';
                if (p.keys) {
                    html += '<div class="key">💡 核心要点：';
                    p.keys.forEach(k => html += k + '；');
                    html += '</div>';
                }
                if (p.tips) {
                    html += '<div class="tip">⚠️ 注意事项：';
                    p.tips.forEach(t => html += t + '；');
                    html += '</div>';
                }
                html += '</div>';
            });
        }
        
        html += '<div style="margin-top:1rem"><button class="btn btn-primary" onclick="Quiz.start(\'' + subject + '\', ' + grade + ')">🎯 本章练习</button></div>';
        html += '</div>';
        container.innerHTML = html;
    },
    
    generateKnowledgePoints(subject, grade, chapter) {
        const kp = {name: '', points: []};
        
        if (subject === 'shuxue') {
            const mathKP = {
                1: {name:'数的认识与运算', points:[
                    {title:'100以内数的认识',content:'能正确读写100以内的数，理解数位概念。',formula:'百位|十位|个位',tips:['从高位读起','数位顺序：个、十、百'],keys:['读数和写数都从高位开始']},
                    {title:'20以内加减法',content:'掌握进位加法和退位减法。',formula:'凑十法：看大数，分小数，凑成十，加剩数',tips:['8+5=8+2+3=13','13-5=10-5+3=8'],keys:['凑十法和破十法是核心方法']}
                ]},
                7: {name:'有理数与方程', points:[
                    {title:'有理数的概念',content:'正整数、负整数、正分数、负分数和零统称有理数。',formula:'有理数=整数∪分数',tips:['数轴三要素：原点、正方向、单位长度'],keys:['绝对值|a|≥0']},
                    {title:'有理数运算',content:'掌握有理数的加减乘除和乘方。',formula:'同号得正，异号得负',tips:['奇数个负号结果为负','偶数个负号结果为正'],keys:['运算顺序：先乘方→乘除→加减']},
                    {title:'一元一次方程',content:'只含一个未知数，次数为1。',formula:'ax+b=0(a≠0)',steps:['去分母','去括号','移项','合并同类项','系数化为1'],keys:['解方程五步法是标准流程']}
                ]},
                9: {name:'二次函数与不等式', points:[
                    {title:'二次函数',content:'形如y=ax²+bx+c(a≠0)。',formula:'顶点式y=a(x-h)²+k',tips:['a>0开口向上,a<0开口向下'],keys:['对称轴x=-b/(2a)','Δ=b²-4ac决定与x轴交点个数']},
                    {title:'一元二次不等式',content:'形如ax²+bx+c>0或<0。',formula:'先求对应方程的根',tips:['a>0时，>0取两边，<0取中间'],keys:['数形结合是解题关键']}
                ]}
            };
            const data = mathKP[grade] || mathKP[1];
            kp.name = data.name;
            kp.points = data.points;
        } else if (subject === 'wuli') {
            const phyKP = {
                7: {name:'机械运动', points:[
                    {title:'运动的描述',content:'判断物体是否运动取决于参照物。',formula:'v=s/t',tips:['运动是相对的','选择不同的参照物结果可能不同'],keys:['速度单位换算：1m/s=3.6km/h']},
                    {title:'长度和时间的测量',content:'使用刻度尺和停表进行测量。',formula:'误差=测量值-真实值',tips:['误差不可避免，错误可以避免','多次测量取平均值减小误差'],keys:['测量要估读到分度值的下一位']}
                ]},
                8: {name:'力学基础', points:[
                    {title:'力和运动',content:'力是物体对物体的作用。',formula:'F=ma',tips:['力的三要素：大小、方向、作用点','力的作用是相互的'],keys:['牛顿第一定律：惯性定律']},
                    {title:'压强',content:'单位面积上的压力。',formula:'p=F/S（固体）, p=ρgh（液体）',tips:['增大压强：增大压力或减小受力面积','液体压强与深度和密度有关'],keys:['标准大气压≈1.01×10⁵Pa']}
                ]},
                9: {name:'功和能', points:[
                    {title:'功和功率',content:'力使物体在力的方向上移动距离。',formula:'W=Fs, P=W/t',tips:['做功的两个必要因素','功率表示做功快慢'],keys:['任何机械都不省功']},
                    {title:'机械能',content:'动能和势能的总和。',formula:'Ek=½mv², Ep=mgh',tips:['动能和势能可以相互转化','机械能守恒条件'],keys:['水电站利用重力势能转化为电能']}
                ]}
            };
            const data = phyKP[grade] || phyKP[7];
            kp.name = data.name;
            kp.points = data.points;
        } else if (subject === 'huaxue') {
            const chemKP = {
                8: {name:'化学入门', points:[
                    {title:'物理变化和化学变化',content:'物理变化没有新物质生成，化学变化有新物质生成。',formula:'化学变化的本质特征：有新物质生成',tips:['伴随发光发热变色等现象的不一定是化学变化'],keys:['化学变化中一定伴随物理变化']},
                    {title:'物质的性质',content:'物理性质不需要化学变化就能表现。',formula:'物理性质vs化学性质',tips:['颜色状态气味密度熔沸点沸点硬度溶解性导电性是物理性质','可燃性氧化性还原性是化学性质'],keys:['性质决定用途，用途反映性质']}
                ]},
                9: {name:'化学反应与物质', points:[
                    {title:'空气的成分',content:'氮气78%，氧气21%，稀有气体0.94%，CO₂0.03%。',formula:'空气中氧气含量测定实验',tips:['拉瓦锡最早得出空气组成','氮气性质稳定用作保护气'],keys:['工业制氧气是物理变化']},
                    {title:'质量守恒定律',content:'参加反应各物质质量总和等于生成各物质质量总和。',formula:'反应前总质量=反应后总质量',tips:['原子种类、数目、质量不变是守恒原因'],keys:['化学方程式配平依据质量守恒']}
                ]}
            };
            const data = chemKP[grade] || chemKP[8];
            kp.name = data.name;
            kp.points = data.points;
        } else if (subject === 'yingyu') {
            kp.name = '英语语法与词汇';
            kp.points = [
                {title:'一般现在时',content:'表示经常发生的动作或存在的状态。',formula:'主语+动词原形/三单',tips:['第三人称单数加s/es','频率副词：always, usually, often'],keys:['否定用don\'t/doesn\'t，疑问用Do/Does']},
                {title:'现在进行时',content:'表示正在进行的动作。',formula:'am/is/are+doing',tips:['标志词：now, look!, listen!','be动词不能遗漏'],keys:['有些动词不用进行时：like, love, want, need']},
                {title:'一般过去时',content:'表示过去发生的动作或状态。',formula:'主语+动词过去式',tips:['标志词：yesterday, last..., ...ago','不规则动词过去式需背诵'],keys:['否定用didn\'t+动词原形']},
                {title:'现在完成时',content:'表示过去动作对现在的影响或持续到现在的动作。',formula:'have/has+过去分词',tips:['since+时间点, for+时间段','已经/还/刚刚：already, yet, just'],keys:['have been to去过, have gone to去了']},
                {title:'被动语态',content:'主语是动作的承受者。',formula:'be+过去分词',tips:['各种时态的被动语态','及物动词才有被动语态'],keys:['by引出动作执行者（可省略）']}
            ];
            kp.highFreq = ['一般现在时三单变化','现在进行时结构','被动语态构成','宾语从句陈述语序','定语从句关系代词'];
        } else if (subject === 'yuwen') {
            kp.name = '语文核心知识';
            kp.points = [
                {title:'古诗词默写',content:'按要求准确默写古诗词名句。',formula:'注意易错字：已/己/巳, 侯/候',tips:['理解记忆优于死记硬背','中考要求背诵篇目全部掌握'],keys:['默写不能出现错别字']},
                {title:'阅读理解方法',content:'掌握不同文体的阅读方法。',formula:'记叙文六要素：时间地点人物起因经过结果',tips:['抓住中心句和关键句','注意段落首尾句'],keys:['答题模板：手法+内容+情感']},
                {title:'作文写作技巧',content:'合理安排文章结构，运用多种写作技巧。',formula:'常见结构：总分总、并列式、递进式',tips:['开头引人入胜','结尾呼应开头升华主题'],keys:['记叙文要有细节描写','议论文要有充分论据']}
            ];
            kp.highFreq = ['古诗词默写零失分','阅读理解答题模板','作文审题立意','作文结构安排','语言运用题'];
        } else {
            kp.name = '核心知识点';
            kp.points = [
                {title:'基础知识',content:'掌握本年级本学科的核心基础知识。',formula:'',tips:['认真浏览每个知识点','做好笔记和标记'],keys:['基础知识是解题的根本']},
                {title:'重点难点',content:'理解并掌握重点和难点内容。',formula:'',tips:['多做练习题巩固','不懂的地方及时查阅资料'],keys:['重难点是考试的高频考点']}
            ];
        }
        return kp;
    },
    
    render_wrongbook() {},
    
    render_review() {
        const container = document.getElementById('page-review');
        let html = '<div class="card"><div class="card-title">🧠 AI考点总结</div>';
        html += '<p style="color:var(--text-secondary);margin-bottom:1rem;font-size:0.88rem">以下是各学科高频考点和最优解法总结：</p>';
        
        const subjects = [
            {icon:'🔢',name:'数学',items:['七年级：有理数运算（同号得正异号得负）、一元一次方程五步法','八年级：一次函数y=kx+b图像性质（k定方向b定截距）、勾股定理','九年级：二次函数顶点式y=a(x-h)²+k、韦达定理x₁+x₂=-b/a','最优解法：数形结合、分类讨论、转化思想']},
            {icon:'⚡',name:'物理',items:['力学：牛顿第一定律（惯性只与质量有关）、压强公式p=F/S和p=ρgh','电学：欧姆定律I=U/R、串并联电路特点','能量：功W=Fs、功率P=W/t、机械能守恒','最优解法：画图分析、控制变量法、等效替代法']},
            {icon:'🧪',name:'化学',items:['质量守恒定律：反应前后质量不变（原子三不变）','化学方程式配平：最小公倍数法、观察法','氧气制取：三种方法（高锰酸钾、氯酸钾、过氧化氢）','最优解法：微观分析、守恒思想、实验验证']},
            {icon:'🔤',name:'英语',items:['时态：一般现在时(三单)、现在进行时(be doing)、一般过去时(ved)、现在完成时(has done)','被动语态：be+过去分词','宾语从句：陈述语序+时态呼应','最优解法：语境分析法、排除法、语法结构拆解']},
            {icon:'📝',name:'语文',items:['古诗词：默写零失分、鉴赏答题模板（手法+内容+情感）','记叙文：六要素、人物描写方法、线索分析','作文：审题立意、结构安排、细节描写','最优解法：文本细读、联系背景、多角度思考']},
            {icon:'🌿',name:'生物',items:['细胞结构：植物特有(细胞壁、叶绿体、液泡)、动物特有(中心体)','光合作用：CO₂+H₂O→有机物+O₂，场所叶绿体','呼吸作用：有机物+O₂→CO₂+H₂O+能量，场所线粒体','遗传变异：DNA→基因→染色体，完全变态vs不完全变态']},
            {icon:'📜',name:'历史',items:['中国古代：夏商周→秦汉→三国两晋南北朝→隋唐→宋元明清','重要改革：商鞅变法、孝文帝改革、王安石变法','近代史：鸦片战争→太平天国→洋务运动→戊戌变法→辛亥革命→五四运动','解题技巧：时间线法、对比法、因果分析法']},
            {icon:'🌍',name:'地理',items:['地球运动：自转(昼夜交替)vs公转(四季变化)','中国地形：西高东低三级阶梯，主要山脉走向','气候类型：热带季风、亚热带季风、温带季风、温带大陆性、高原山地','解题技巧：读图分析、空间定位、比较归纳']},
            {icon:'⚖️',name:'道法',items:['宪法：根本法、最高效力、公民基本权利和义务','法律体系：宪法→法律→行政法规→地方性法规','核心价值观：国家(富强民主文明和谐)、社会(自由平等公正法治)、个人(爱国敬业诚信友善)','解题技巧：联系实际、多角度分析、规范表述']},
            {icon:'🔬',name:'科学',items:['生命科学：生物特征、细胞结构、生态系统','物质科学：物质的三态、混合物与纯净物、物理变化与化学变化','能量世界：力与运动、简单机械、能量转化','地球宇宙：太阳系、八大行星、月相变化、日食月食','解题技巧：观察实验、分类比较、逻辑推理']}
        ];
        
        subjects.forEach(sub => {
            html += '<div class="high-frequency"><h4>' + sub.icon + ' ' + sub.name + '高频考点</h4><ul>';
            sub.items.forEach(item => html += '<li>' + item + '</li>');
            html += '</ul></div>';
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
};

function goBack() { App.goBack(); }
function showPage(pageId) {
    if (pageId === 'wrongbook') { WrongBook.show(); return; }
    if (pageId === 'stats') { Stats.show(); return; }
    if (pageId === 'review') { App.render_review(); App.showPage('review'); return; }
}
function startQuickQuiz(type) {
    if (type === 'all') { Quiz.startRandom(); }
}
