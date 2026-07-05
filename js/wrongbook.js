const WrongBook = {
    getWrongBooks() {
        try {
            return JSON.parse(localStorage.getItem('wrong_books') || '[]');
        } catch(e) { return []; }
    },
    
    saveWrongBooks(wb) {
        localStorage.setItem('wrong_books', JSON.stringify(wb));
    },
    
    add(question) {
        const wb = this.getWrongBooks();
        const existing = wb.find(w => w.q === question.q);
        if (existing) {
            existing.count = (existing.count || 1) + 1;
            existing.lastTime = new Date().toLocaleString();
        } else {
            wb.unshift({
                ...question,
                count: 1,
                firstTime: new Date().toLocaleString(),
                lastTime: new Date().toLocaleString(),
                id: Date.now()
            });
        }
        if (wb.length > 200) wb.length = 200;
        this.saveWrongBooks(wb);
    },
    
    remove(id) {
        let wb = this.getWrongBooks();
        wb = wb.filter(w => w.id !== id);
        this.saveWrongBooks(wb);
        this.show();
    },
    
    clearAll() {
        if (confirm('确定要清空所有错题吗？')) {
            this.saveWrongBooks([]);
            this.show();
        }
    },
    
    show() {
        App.showPage('wrongbook');
        App.updateHeader('📕 错题本');
        const container = document.getElementById('page-wrongbook');
        const wb = this.getWrongBooks();
        
        let html = '<div class="card"><div class="card-title">📕 错题本 (' + wb.length + ' 道错题)</div>';
        
        if (wb.length === 0) {
            html += '<div class="empty-state"><div class="icon">🎉</div><p>太棒了！还没有错题！</p><p>去做几道题试试吧</p></div>';
        } else {
            html += '<div class="filter-bar">';
            html += '<input type="text" class="search-input" placeholder="搜索错题..." oninput="WrongBook.filter(this.value)">';
            html += '<button class="btn btn-danger" onclick="WrongBook.clearAll()" style="padding:.5rem 1rem;font-size:.8rem">清空全部</button>';
            html += '</div>';
            html += '<div id="wrongBookList">';
            wb.forEach(w => {
                const subjectName = SUBJECTS[w.subject]?.name || '综合';
                const badgeClass = BADGE_CLASSES[w.subject] || 'badge-shuxue';
                html += '<div class="wrong-book-item" data-subject="' + (w.subject||'') + '">';
                html += '<div class="q-preview"><span class="question-badge ' + badgeClass + '" style="margin-right:.5rem">' + subjectName + '</span>' + w.q + '</div>';
                html += '<div class="meta">';
                html += '<span class="wrong-count">错' + (w.count||1) + '次</span>';
                html += '<span>首次: ' + (w.firstTime||'') + '</span>';
                html += '<span>最近: ' + (w.lastTime||'') + '</span>';
                html += '</div>';
                html += '<div style="margin-top:.5rem;font-size:.85rem">';
                html += '<span style="color:var(--danger)">你的答案: ' + (w.options[w.userAnswer]||'未作答') + '</span>';
                html += ' | <span style="color:var(--success)">正确答案: ' + w.options[w.correctAnswer] + '</span>';
                html += '</div>';
                html += '<div style="margin-top:.5rem;font-size:.85rem;color:var(--text-secondary)">💡 ' + (w.explanation||'') + '</div>';
                html += '<div style="margin-top:.5rem"><button class="btn btn-outline" style="padding:.3rem .8rem;font-size:.75rem" onclick="WrongBook.remove(' + w.id + ')">移除</button></div>';
                html += '</div>';
            });
            html += '</div>';
        }
        
        html += '</div>';
        container.innerHTML = html;
    },
    
    filter(keyword) {
        const items = document.querySelectorAll('#wrongBookList .wrong-book-item');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(keyword.toLowerCase()) ? '' : 'none';
        });
    }
};
