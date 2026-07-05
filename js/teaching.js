// ==================== 课堂教学模式 ====================
const TeachingMode = {
    mode: 'home',          // home | blackboard | rollcall | pk | quiz | summary
    students: [],          // 学生名单
    groups: [],            // 小组列表
    scores: {},            // 小组积分
    currentQuiz: null,     // 随堂测验数据
    blackboardHistory: [], // 板书历史
    startTime: null,
    subject: '',
    grade: 0,
    
    enter() {
        this.subject = '';
        this.grade = 0;
        this.mode = 'home';
        this.students = this.loadStudents();
        this.groups = this.loadGroups();
        this.scores = this.loadScores();
        this.blackboardHistory = this.loadBlackboard();
        this.startTime = Date.now();
        App.showPage('teaching');
        App.updateHeader('👨‍🏫 课堂教学');
        this.renderHome();
    },
    
    // ===== 学生管理 =====
    loadStudents() {
        try { return JSON.parse(localStorage.getItem('tm_students') || '[]'); }
        catch(e) { return []; }
    },
    
    saveStudents(list) {
        localStorage.setItem('tm_students', JSON.stringify(list));
        this.students = list;
    },
    
    addStudent(name) {
        if (!name.trim()) return;
        const list = this.loadStudents();
        if (list.includes(name.trim())) {
            showToast('该学生已在名单中');
            return;
        }
        list.push(name.trim());
        this.saveStudents(list);
        this.renderHome();
        showToast('✅ 已添加：' + name.trim());
    },
    
    removeStudent(name) {
        const list = this.students.filter(s => s !== name);
        this.saveStudents(list);
        this.renderHome();
    },
    
    randomStudent() {
        if (this.students.length === 0) {
            showToast('请先添加学生名单');
            return null;
        }
        const name = this.students[Math.floor(Math.random() * this.students.length)];
        showToast('🎯 请回答：' + name);
        return name;
    },
    
    // ===== 小组管理 =====
    loadGroups() {
        try { return JSON.parse(localStorage.getItem('tm_groups') || '[]'); }
        catch(e) { return []; }
    },
    
    saveGroups(list) {
        localStorage.setItem('tm_groups', JSON.stringify(list));
        this.groups = list;
    },
    
    autoGroup(count) {
        if (this.students.length < count) {
            showToast('学生人数不足，至少需要 ' + count + ' 人');
            return;
        }
        const shuffled = shuffle([...this.students]);
        const groups = [];
        const size = Math.ceil(shuffled.length / count);
        for (let i = 0; i < count; i++) {
            groups.push({
                name: '第' + (i+1) + '组',
                members: shuffled.slice(i*size, (i+1)*size)
            });
        }
        this.saveGroups(groups);
        this.scores = {};
        groups.forEach(g => this.scores[g.name] = 0);
        this.saveScores(this.scores);
        this.renderHome();
        showToast('✅ 已分成 ' + count + ' 组');
    },
    
    addScore(groupName) {
        if (!this.scores[groupName]) this.scores[groupName] = 0;
        this.scores[groupName]++;
        this.saveScores(this.scores);
        this.renderPK();
    },
    
    deductScore(groupName) {
        if (!this.scores[groupName]) this.scores[groupName] = 0;
        this.scores[groupName] = Math.max(0, this.scores[groupName] - 1);
        this.saveScores(this.scores);
        this.renderPK();
    },
    
    saveScores(obj) {
        localStorage.setItem('tm_scores', JSON.stringify(obj));
    },
    
    loadScores() {
        try { return JSON.parse(localStorage.getItem('tm_scores') || '{}'); }
        catch(e) { return {}; }
    },
    
    // ===== 随堂测验 =====
    startQuiz() {
        if (this.students.length === 0) {
            showToast('请先添加学生名单');
            return;
        }
        const q = this.generateQuizQuestion();
        this.currentQuiz = q;
        this.mode = 'quiz';
        this.renderQuiz();
    },
    
    generateQuizQuestion() {
        const qtypes = [
            {q:'请说出 3+5 的结果', answer:'8', type:'填空'},
            {q:'水的化学式是什么', answer:'H₂O', type:'填空'},
            {q:'中国的首都是哪里', answer:'北京', type:'填空'},
            {q:'12×13=？', answer:'156', type:'填空'},
            {q:'光的三原色是什么', answer:'红绿蓝', type:'填空'},
            {q:'请写出 "apple" 的复数形式', answer:'apples', type:'填空'},
            {q:'三角形内角和是多少度', answer:'180', type:'填空'},
            {q:'谁写了《静夜思》', answer:'李白', type:'填空'},
            {q:'地球绕太阳一圈多少天', answer:'365', type:'填空'},
            {q:'1千克等于多少克', answer:'1000', type:'填空'}
        ];
        return qtypes[Math.floor(Math.random()*qtypes.length)];
    },
    
    submitQuizAnswer(studentName, answer) {
        if (!this.currentQuiz) return;
        const correct = answer.trim().toLowerCase() === this.currentQuiz.answer.trim().toLowerCase();
        return {student: studentName, answer: answer.trim(), correct: correct};
    },
    
    // ===== 板书管理 =====
    loadBlackboard() {
        try { return JSON.parse(localStorage.getItem('tm_blackboard') || '[]'); }
        catch(e) { return []; }
    },
    
    saveBlackboard(content) {
        const history = this.loadBlackboard();
        history.unshift({
            content: content,
            time: new Date().toLocaleString(),
            id: Date.now()
        });
        if (history.length > 20) history.length = 20;
        localStorage.setItem('tm_blackboard', JSON.stringify(history));
        this.blackboardHistory = history;
    },
    
    clearBlackboard() {
        if (confirm('确定清空当前板书内容吗？')) {
            localStorage.removeItem('tm_blackboard');
            this.blackboardHistory = [];
            this.renderBlackboard();
        }
    },
    
    // ===== 渲染：主页 =====
    renderHome() {
        App.showPage('teaching');
        App.updateHeader('👨‍🏫 课堂教学');
        const container = document.getElementById('page-teaching');
        
        let html = '<div class="teaching-home">';
        
        // 设置区
        html += '<div class="card"><div class="card-title">⚙️ 课堂设置</div>';
        html += '<div style="display:flex;gap:0.8rem;flex-wrap:wrap;margin-bottom:0.8rem">';
        html += '<select id="teachSubject" class="search-input" style="flex:none;width:120px">';
        for (const [key, s] of Object.entries(SUBJECTS)) {
            html += '<option value="' + key + '">' + s.icon + ' ' + s.name + '</option>';
        }
        html += '</select>';
        html += '<select id="teachGrade" class="search-input" style="flex:none;width:100px">';
        for (let g = 1; g <= 9; g++) {
            html += '<option value="' + g + '">' + GRADE_LABELS[g] + '年级</option>';
        }
        html += '</select>';
        html += '<button class="btn btn-primary" onclick="TeachingMode.saveSettings()">保存设置</button>';
        html += '</div>';
        html += '</div>';
        
        // 学生管理
        html += '<div class="card"><div class="card-title">👤 学生名单 (' + this.students.length + ' 人)</div>';
        html += '<div style="display:flex;gap:0.5rem;margin-bottom:0.8rem">';
        html += '<input type="text" class="search-input" id="studentInput" placeholder="输入学生姓名" onkeypress="if(event.key==\'Enter\')TeachingMode.addStudent(document.getElementById(\'studentInput\').value)">';
        html += '<button class="btn btn-primary" onclick="TeachingMode.addStudent(document.getElementById(\'studentInput\').value)">添加</button>';
        html += '</div>';
        if (this.students.length > 0) {
            html += '<div style="display:flex;flex-wrap:wrap;gap:0.4rem">';
            this.students.forEach(s => {
                html += '<span class="student-tag">' + s + '<button onclick="TeachingMode.removeStudent(\'' + s.replace(/'/g,"\\'") + '\')" style="margin-left:4px;color:var(--danger);cursor:pointer;border:none;background:none;font-size:0.9rem">×</button></span>';
            });
            html += '</div>';
        }
        html += '</div>';
        
        // 分组管理
        html += '<div class="card"><div class="card-title">👥 分组管理 (' + this.groups.length + ' 组)</div>';
        html += '<div style="display:flex;gap:0.5rem;margin-bottom:0.8rem">';
        html += '<input type="number" class="search-input" id="groupCount" min="2" max="8" value="4" style="flex:none;width:80px">';
        html += '<button class="btn btn-primary" onclick="TeachingMode.autoGroup(parseInt(document.getElementById(\'groupCount\').value))">自动分组</button>';
        html += '</div>';
        if (this.groups.length > 0) {
            this.groups.forEach(g => {
                html += '<div class="group-summary"><strong>' + g.name + '</strong>：' + g.members.join('、') + '</div>';
            });
        }
        html += '</div>';
        
        // 快捷入口
        html += '<div class="card"><div class="card-title">🚀 快捷入口</div>';
        html += '<div class="grid grid-3">';
        html += '<div class="teach-action-card" onclick="TeachingMode.renderRollCall()"><div class="icon">🎯</div><div class="label">随机点名</div></div>';
        html += '<div class="teach-action-card" onclick="TeachingMode.startQuiz()"><div class="icon">📝</div><div class="label">随堂测验</div></div>';
        html += '<div class="teach-action-card" onclick="TeachingMode.renderBlackboard()"><div class="icon">✏️</div><div class="label">电子板书</div></div>';
        html += '<div class="teach-action-card" onclick="TeachingMode.renderPK()"><div class="icon">⚔️</div><div class="label">小组PK</div></div>';
        html += '<div class="teach-action-card" onclick="TeachingMode.renderSummary()"><div class="icon">📊</div><div class="label">课堂总结</div></div>';
        html += '</div></div>';
        
        html += '</div>';
        container.innerHTML = html;
    },
    
    saveSettings() {
        const subj = document.getElementById('teachSubject').value;
        const grd = parseInt(document.getElementById('teachGrade').value);
        localStorage.setItem('tm_settings', JSON.stringify({subject: subj, grade: grd}));
        this.subject = subj;
        this.grade = grd;
        showToast('✅ 设置已保存');
    },
    
    // ===== 随机点名 =====
    renderRollCall() {
        this.mode = 'rollcall';
        const container = document.getElementById('page-teaching');
        let html = '<div class="card" style="text-align:center;padding:3rem 1rem">';
        html += '<div class="card-title">🎯 随机点名</div>';
        html += '<div class="rollcall-display" id="rollcallDisplay">点击按钮开始点名</div>';
        html += '<div style="margin-top:1.5rem;display:flex;gap:0.8rem;justify-content:center">';
        html += '<button class="btn btn-primary" onclick="TeachingMode.doRollCall()" id="rollcallBtn">🎲 点名</button>';
        html += '<button class="btn btn-outline" onclick="TeachingMode.renderHome()">返回主页</button>';
        html += '</div></div>';
        container.innerHTML = html;
    },
    
    doRollCall() {
        if (this.students.length === 0) {
            showToast('请先添加学生名单');
            return;
        }
        const btn = document.getElementById('rollcallBtn');
        const display = document.getElementById('rollcallDisplay');
        btn.disabled = true;
        
        let count = 0;
        const total = 20;
        const interval = setInterval(() => {
            display.textContent = this.students[Math.floor(Math.random()*this.students.length)];
            display.style.transform = 'scale(1.1)';
            setTimeout(() => display.style.transform = 'scale(1)', 150);
            count++;
            if (count >= total) {
                clearInterval(interval);
                const winner = this.students[Math.floor(Math.random()*this.students.length)];
                display.textContent = '🎯 ' + winner;
                display.style.fontSize = '3rem';
                display.style.color = 'var(--primary)';
                display.style.fontWeight = '700';
                btn.disabled = false;
            }
        }, 80);
    },
    
    // ===== 随堂测验 =====
    renderQuiz() {
        if (!this.currentQuiz) this.startQuiz();
        const q = this.currentQuiz;
        const container = document.getElementById('page-teaching');
        
        let html = '<div class="card"><div class="card-title">📝 随堂测验（' + q.type + '）</div>';
        html += '<div class="quiz-display" style="text-align:center;padding:2rem 1rem">';
        html += '<div class="question-text" style="font-size:1.3rem;margin-bottom:1.5rem">' + q.q + '</div>';
        html += '<div style="margin:1rem 0">';
        html += '<input type="text" class="search-input" id="quizStudent" placeholder="学生姓名" style="width:150px;display:inline-block">';
        html += '<input type="text" class="search-input" id="quizAnswer" placeholder="输入答案" style="width:200px;display:inline-block" onkeypress="if(event.key===\'Enter\')TeachingMode.submitAnswer()">';
        html += '<button class="btn btn-primary" onclick="TeachingMode.submitAnswer()">提交</button>';
        html += '</div>';
        html += '<div id="quizResults" style="margin-top:1rem;text-align:left"></div>';
        html += '</div>';
        html += '<div style="margin-top:1rem;display:flex;gap:0.8rem;justify-content:center">';
        html += '<button class="btn btn-outline" onclick="TeachingMode.newQuestion()">🔄 换一题</button>';
        html += '<button class="btn btn-outline" onclick="TeachingMode.renderHome()">返回主页</button>';
        html += '</div></div>';
        container.innerHTML = html;
    },
    
    submitAnswer() {
        const student = document.getElementById('quizStudent').value.trim();
        const answer = document.getElementById('quizAnswer').value.trim();
        if (!student) { showToast('请输入学生姓名'); return; }
        if (!answer) { showToast('请输入答案'); return; }
        
        const result = this.submitQuizAnswer(student, answer);
        const div = document.getElementById('quizResults');
        const icon = result.correct ? '✅' : '❌';
        const color = result.correct ? 'var(--success)' : 'var(--danger)';
        div.innerHTML += '<div style="padding:0.5rem;border:1px solid var(--border);margin:0.3rem 0;display:flex;justify-content:space-between"><span>' + icon + ' ' + student + ': ' + answer + '</span><span style="color:' + color + ';font-weight:700">' + (result.correct ? '正确' : '错误') + '</span></div>';
        
        document.getElementById('quizAnswer').value = '';
    },
    
    newQuestion() {
        this.currentQuiz = this.generateQuizQuestion();
        document.getElementById('quizResults').innerHTML = '';
        const q = this.currentQuiz;
        document.querySelector('.question-text').textContent = q.q;
    },
    
    // ===== 电子板书 =====
    renderBlackboard() {
        this.mode = 'blackboard';
        const container = document.getElementById('page-teaching');
        
        let html = '<div class="card"><div class="card-title">✏️ 电子板书</div>';
        html += '<div class="blackboard-area">';
        html += '<textarea id="blackboardInput" class="blackboard-textarea" placeholder="在此输入板书内容..." rows="8"></textarea>';
        html += '<div style="margin-top:0.8rem;display:flex;gap:0.5rem">';
        html += '<button class="btn btn-primary" onclick="TeachingMode.saveBoard()">保存板书</button>';
        html += '<button class="btn btn-danger" onclick="TeachingMode.clearBlackboard()">清空</button>';
        html += '<button class="btn btn-outline" onclick="TeachingMode.renderHome()">返回主页</button>';
        html += '</div></div>';
        
        // 历史板书
        if (this.blackboardHistory.length > 0) {
            html += '<h4 style="margin:1rem 0 0.5rem">📋 历史板书</h4>';
            this.blackboardHistory.forEach(b => {
                html += '<div class="blackboard-history"><div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.3rem">' + b.time + '</div><div style="white-space:pre-wrap">' + b.content + '</div></div>';
            });
        }
        
        html += '</div>';
        container.innerHTML = html;
    },
    
    saveBoard() {
        const content = document.getElementById('blackboardInput').value;
        if (!content.trim()) { showToast('板书内容为空'); return; }
        this.saveBlackboard(content);
        showToast('✅ 板书已保存');
        this.renderBlackboard();
    },
    
    // ===== 小组PK =====
    renderPK() {
        this.mode = 'pk';
        const container = document.getElementById('page-teaching');
        
        if (this.groups.length === 0) {
            container.innerHTML = '<div class="card"><p>请先在主页设置分组</p><button class="btn btn-outline" onclick="TeachingMode.renderHome()">返回</button></div>';
            return;
        }
        
        let html = '<div class="card"><div class="card-title">⚔️ 小组PK积分榜</div>';
        html += '<div class="pk-grid">';
        
        this.groups.forEach(g => {
            const score = this.scores[g.name] || 0;
            html += '<div class="pk-card">';
            html += '<div class="pk-name">' + g.name + '</div>';
            html += '<div class="pk-score" id="pkScore_' + g.name.replace(/[^a-zA-Z]/g,'_') + '">' + score + '</div>';
            html += '<div class="pk-members">' + g.members.join('、') + '</div>';
            html += '<div style="margin-top:0.5rem;display:flex;gap:0.3rem">';
            html += '<button class="btn btn-success" style="padding:0.3rem 0.8rem" onclick="TeachingMode.addScore(\'' + g.name.replace(/'/g,"\\'") + '\')">+1</button>';
            html += '<button class="btn btn-danger" style="padding:0.3rem 0.8rem" onclick="TeachingMode.deductScore(\'' + g.name.replace(/'/g,"\\'") + '\')">-1</button>';
            html += '</div></div>';
        });
        
        html += '</div>';
        html += '<div style="margin-top:1rem;display:flex;gap:0.5rem">';
        html += '<button class="btn btn-outline" onclick="TeachingMode.resetScores()">重置积分</button>';
        html += '<button class="btn btn-outline" onclick="TeachingMode.renderHome()">返回主页</button>';
        html += '</div></div>';
        container.innerHTML = html;
    },
    
    resetScores() {
        this.groups.forEach(g => this.scores[g.name] = 0);
        this.saveScores(this.scores);
        this.renderPK();
    },
    
    // ===== 课堂总结 =====
    renderSummary() {
        this.mode = 'summary';
        const container = document.getElementById('page-teaching');
        const duration = Math.round((Date.now() - this.startTime) / 60000);
        
        let html = '<div class="card"><div class="card-title">📊 课堂总结</div>';
        html += '<div class="summary-grid">';
        html += '<div class="summary-item"><div class="label">课堂时长</div><div class="value">' + duration + ' 分钟</div></div>';
        html += '<div class="summary-item"><div class="label">学生人数</div><div class="value">' + this.students.length + ' 人</div></div>';
        html += '<div class="summary-item"><div class="label">分组数量</div><div class="value">' + this.groups.length + ' 组</div></div>';
        html += '<div class="summary-item"><div class="label">板书次数</div><div class="value">' + this.blackboardHistory.length + ' 次</div></div>';
        html += '</div>';
        
        if (this.groups.length > 0) {
            html += '<h4 style="margin:1.5rem 0 0.5rem">🏆 小组排名</h4>';
            const sorted = this.groups.slice().sort((a,b) => (this.scores[b.name]||0) - (this.scores[a.name]||0));
            sorted.forEach((g, i) => {
                const score = this.scores[g.name] || 0;
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
                html += '<div class="rank-item"><span>' + medal + ' ' + g.name + '</span><span style="font-weight:700">' + score + ' 分</span></div>';
            });
        }
        
        html += '<div style="margin-top:1.5rem"><button class="btn btn-primary" onclick="TeachingMode.exportSummary()">📤 导出总结</button></div>';
        html += '</div>';
        container.innerHTML = html;
    },
    
    exportSummary() {
        const duration = Math.round((Date.now() - this.startTime) / 60000);
        let text = '=== 课堂总结 ===\n';
        text += '时间：' + new Date().toLocaleString() + '\n';
        text += '时长：' + duration + ' 分钟\n';
        text += '学生：' + this.students.length + ' 人\n';
        text += '分组：' + this.groups.length + ' 组\n\n';
        
        if (this.groups.length > 0) {
            text += '小组排名：\n';
            const sorted = this.groups.slice().sort((a,b) => (this.scores[b.name]||0) - (this.scores[a.name]||0));
            sorted.forEach((g, i) => {
                text += (i+1) + '. ' + g.name + '：' + (this.scores[g.name]||0) + ' 分\n';
            });
        }
        
        text += '\n板书记录：\n';
        this.blackboardHistory.forEach(b => {
            text += '[' + b.time + '] ' + b.content.substring(0,50) + '\n';
        });
        
        const blob = new Blob([text], {type:'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '课堂总结_' + new Date().toISOString().slice(0,10) + '.txt';
        a.click();
        showToast('✅ 总结已导出');
    }
};

// 学生标签样式注入
const studentTagStyle = document.createElement('style');
studentTagStyle.textContent = '.student-tag{display:inline-flex;align-items:center;padding:0.3rem 0.6rem;border:1px solid var(--border);background:#fff;font-size:0.85rem;margin:0.15rem}.teach-action-card{border:1px solid var(--border);padding:1.5rem;text-align:center;cursor:pointer;transition:0.2s}.teach-action-card:hover{border-color:var(--primary);background:#fef2f2}.teach-action-card .icon{font-size:2rem;margin-bottom:0.5rem}.teach-action-card .label{font-weight:700;color:var(--primary)}.rollcall-display{font-size:2.5rem;font-weight:700;color:var(--primary);margin:2rem 0;transition:0.15s}.quiz-display{padding:1rem}.blackboard-area{margin:0.5rem 0}.blackboard-textarea{width:100%;padding:1rem;border:2px solid var(--primary);font-family:inherit;font-size:1rem;resize:vertical;background:#fff}.blackboard-history{border:1px solid var(--border);padding:0.8rem;margin:0.5rem 0;background:#fafafa}.pk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;margin:1rem 0}.pk-card{border:2px solid var(--border);padding:1rem;text-align:center}.pk-name{font-weight:700;color:var(--primary);font-size:1.1rem}.pk-score{font-size:2.5rem;font-weight:700;color:var(--primary);margin:0.5rem 0}.pk-members{font-size:0.8rem;color:var(--text-secondary)}.summary-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1rem;margin:1rem 0}.summary-item{border:1px solid var(--border);padding:1rem;text-align:center}.summary-item .label{font-size:0.8rem;color:var(--text-secondary)}.summary-item .value{font-size:1.5rem;font-weight:700;color:var(--primary);margin-top:0.3rem}.rank-item{display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--border)}';
document.head.appendChild(studentTagStyle);
