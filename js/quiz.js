const Quiz = {
    currentQuestions: [],
    currentIndex: 0,
    score: 0,
    answered: false,
    wrongAnswers: [],
    startTime: null,
    
    start(subject, grade) {
        const questions = getSubjectQuestions(subject, grade);
        if (!questions || questions.length === 0) {
            showToast('暂无题目，请先学习知识点');
            return;
        }
        this.currentQuestions = shuffle(questions).slice(0, Math.min(10, questions.length));
        this.currentIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.startTime = Date.now();
        this.renderQuestion();
        App.showPage('quiz', {subject, grade});
        App.updateHeader(SUBJECTS[subject]?.icon + ' ' + SUBJECTS[subject]?.name + ' - 在线答题');
    },
    
    startRandom() {
        const all = getAllQuestions();
        const shuffled = shuffle(all);
        this.currentQuestions = shuffled.slice(0, 15);
        this.currentIndex = 0;
        this.score = 0;
        this.wrongAnswers = [];
        this.startTime = Date.now();
        this.renderQuestion();
        App.showPage('quiz', {subject:'all', grade:0});
        App.updateHeader('🎯 综合练习');
    },
    
    renderQuestion() {
        const container = document.getElementById('page-quiz');
        if (this.currentIndex >= this.currentQuestions.length) {
            this.showResults();
            return;
        }
        
        const q = this.currentQuestions[this.currentIndex];
        const total = this.currentQuestions.length;
        const num = this.currentIndex + 1;
        const badgeClass = BADGE_CLASSES[q.subject] || 'badge-shuxue';
        const subjectName = SUBJECTS[q.subject]?.name || '综合';
        const gradeLabel = q.grade ? GRADE_LABELS[q.grade] || '' : '';
        
        this.answered = false;
        
        let html = '<div class="quiz-area">';
        html += '<div class="question-card">';
        html += '<div class="question-header">';
        html += '<span class="question-number">第 ' + num + '/' + total + ' 题</span>';
        html += '<span class="question-badge ' + badgeClass + '">' + subjectName + (gradeLabel ? ' '+gradeLabel+'年级' : '') + '</span>';
        html += '</div>';
        html += '<div class="progress-bar"><div class="progress-fill progress-blue" style="width:' + (num/total*100) + '%"></div></div>';
        html += '<div class="question-text">' + num + '. ' + q.q + '</div>';
        html += '<ul class="options">';
        
        const letters = ['A','B','C','D'];
        q.options.forEach((opt, i) => {
            html += '<li class="option" data-index="' + i + '" onclick="Quiz.selectOption(' + i + ')">';
            html += '<span class="option-letter">' + letters[i] + '</span>';
            html += '<span>' + opt + '</span></li>';
        });
        html += '</ul>';
        html += '<div class="explanation" id="explanation">';
        html += '<h4>💡 解析</h4><p>' + q.explanation + '</p></div>';
        html += '</div>';
        
        html += '<div class="quiz-actions">';
        html += '<button class="btn btn-outline" id="prevBtn" onclick="Quiz.prev()"' + (num===1?' disabled':'') + '>← 上一题</button>';
        html += '<button class="btn btn-primary" id="nextBtn" onclick="Quiz.next()" disabled>下一题 →</button>';
        html += '</div>';
        html += '</div>';
        
        container.innerHTML = html;
    },
    
    selectOption(index) {
        if (this.answered) return;
        this.answered = true;
        
        const q = this.currentQuestions[this.currentIndex];
        const options = document.querySelectorAll('.option');
        const isCorrect = index === q.answer;
        
        options.forEach((opt, i) => {
            opt.style.pointerEvents = 'none';
            if (i === q.answer) opt.classList.add('correct');
            if (i === index && !isCorrect) opt.classList.add('wrong');
        });
        
        if (isCorrect) {
            this.score++;
            showToast('✅ 回答正确！');
        } else {
            showToast('❌ 回答错误');
            this.wrongAnswers.push({...q, userAnswer: index, correctAnswer: q.answer});
            WrongBook.add({...q, userAnswer: index, correctAnswer: q.answer});
        }
        
        document.getElementById('explanation').classList.add('show');
        document.getElementById('nextBtn').disabled = false;
        
        const isLast = this.currentIndex >= this.currentQuestions.length - 1;
        document.getElementById('nextBtn').textContent = isLast ? '查看结果 →' : '下一题 →';
    },
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderQuestion();
        }
    },
    
    next() {
        this.currentIndex++;
        this.renderQuestion();
    },
    
    showResults() {
        const container = document.getElementById('page-quiz');
        const total = this.currentQuestions.length;
        const score = Math.round(this.score / total * 100);
        const timeUsed = Math.round((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(timeUsed / 60);
        const seconds = timeUsed % 60;
        
        let html = '<div class="score-display"><div class="card">';
        html += '<div class="card-title">📊 答题结果</div>';
        html += '<div class="score-circle">' + score + '分</div>';
        html += '<div class="stats-grid">';
        html += '<div class="stat-card"><div class="stat-value">' + this.score + '/' + total + '</div><div class="stat-label">正确题数</div></div>';
        html += '<div class="stat-card"><div class="stat-value">' + score + '%</div><div class="stat-label">正确率</div></div>';
        html += '<div class="stat-card"><div class="stat-value">' + this.wrongAnswers.length + '</div><div class="stat-label">错题数</div></div>';
        html += '<div class="stat-card"><div class="stat-value">' + minutes + '分' + seconds + '秒</div><div class="stat-label">用时</div></div>';
        html += '</div>';
        
        if (this.wrongAnswers.length > 0) {
            html += '<h4 style="margin:1.5rem 0 1rem">❌ 错题回顾</h4>';
            this.wrongAnswers.forEach((wa, i) => {
                html += '<div class="wrong-book-item">';
                html += '<div class="q-preview"><strong>第' + (i+1) + '题:</strong> ' + wa.q + '</div>';
                html += '<div class="meta">';
                html += '<span>你的答案: ' + wa.options[wa.userAnswer] + '</span>';
                html += '<span>正确答案: ' + wa.options[wa.correctAnswer] + '</span>';
                html += '</div>';
                html += '<div style="margin-top:.5rem;font-size:.85rem;color:var(--text-secondary)">💡 ' + wa.explanation + '</div>';
                html += '</div>';
            });
        }
        
        const subj = this.currentQuestions[0]?.subject || 'shuxue';
        const grd = this.currentQuestions[0]?.grade || 7;
        html += '<div class="quiz-actions" style="justify-content:center;margin-top:1.5rem">';
        html += '<button class="btn btn-primary" onclick="Quiz.start(\'' + subj + '\', ' + grd + ')">🔄 再来一次</button>';
        html += '<button class="btn btn-success" onclick="WrongBook.show()">📕 查看错题本</button>';
        html += '<button class="btn btn-outline" onclick="App.showPage(\'home\')">🏠 返回首页</button>';
        html += '</div>';
        html += '</div></div>';
        container.innerHTML = html;
        
        Stats.recordAnswer({subject: this.currentQuestions[0]?.subject||'all', correct: this.score, total: total, time: timeUsed});
    }
};
