const Stats = {
    getRecords() {
        try { return JSON.parse(localStorage.getItem('study_records') || '[]'); }
        catch(e) { return []; }
    },
    
    saveRecords(records) {
        localStorage.setItem('study_records', JSON.stringify(records));
    },
    
    recordAnswer(record) {
        const records = this.getRecords();
        records.push({
            ...record,
            date: new Date().toISOString(),
            timestamp: Date.now()
        });
        if (records.length > 1000) records.splice(0, records.length - 1000);
        this.saveRecords(records);
    },
    
    getStats() {
        const records = this.getRecords();
        let totalQuestions = 0;
        let totalCorrect = 0;
        
        const bySubject = {};
        records.forEach(r => {
            const subj = r.subject || '综合';
            if (!bySubject[subj]) bySubject[subj] = {total: 0, correct: 0};
            bySubject[subj].total += r.total || 0;
            bySubject[subj].correct += r.correct || 0;
            totalQuestions += r.total || 0;
            totalCorrect += r.correct || 0;
        });
        const accuracy = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0;
        
        const today = new Date();
        const weekly = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const ds = d.toISOString().split('T')[0];
            const dayRecords = records.filter(r => r.date && r.date.startsWith(ds));
            let dayTotal = 0, dayCorrect = 0;
            dayRecords.forEach(dr => {
                dayTotal += dr.total || 0;
                dayCorrect += dr.correct || 0;
            });
            weekly.push({date: ds, total: dayTotal, correct: dayCorrect, accuracy: dayTotal > 0 ? Math.round(dayCorrect/dayTotal*100) : 0});
        }
        
        const recent = records.slice(-10).reverse();
        
        return {total: totalQuestions, correct: totalCorrect, accuracy, bySubject, weekly, recent};
    },
    
    show() {
        App.showPage('stats');
        App.updateHeader('📈 学习统计');
        const container = document.getElementById('page-stats');
        const stats = this.getStats();
        
        let html = '<div class="card"><div class="card-title">📈 学习统计</div>';
        
        html += '<div class="stats-grid">';
        html += '<div class="stat-card"><div class="stat-value">' + stats.total + '</div><div class="stat-label">总答题数</div></div>';
        html += '<div class="stat-card"><div class="stat-value">' + stats.correct + '</div><div class="stat-label">正确数</div></div>';
        html += '<div class="stat-card"><div class="stat-value">' + stats.accuracy + '%</div><div class="stat-label">正确率</div></div>';
        html += '<div class="stat-card"><div class="stat-value">' + Object.keys(stats.bySubject).length + '</div><div class="stat-label">涉及学科</div></div>';
        html += '</div>';
        
        html += '<div style="margin:1rem 0">';
        html += '<div style="display:flex;justify-content:space-between;font-size:.85rem"><span>总体正确率</span><span>' + stats.accuracy + '%</span></div>';
        const barColor = stats.accuracy >= 80 ? 'progress-green' : stats.accuracy >= 60 ? 'progress-orange' : 'progress-red';
        html += '<div class="progress-bar"><div class="progress-fill ' + barColor + '" style="width:' + stats.accuracy + '%"></div></div>';
        html += '</div>';
        
        if (Object.keys(stats.bySubject).length > 0) {
            html += '<h4 style="margin:1.5rem 0 1rem">📊 各学科统计</h4>';
            html += '<div class="grid grid-2">';
            for (const [subj, data] of Object.entries(stats.bySubject)) {
                const sName = SUBJECTS[subj]?.name || subj;
                const acc = data.total > 0 ? Math.round(data.correct/data.total*100) : 0;
                html += '<div class="stat-card" style="text-align:left">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center"><strong>' + sName + '</strong><span>' + acc + '%</span></div>';
                html += '<div style="font-size:.8rem;color:var(--text-secondary);margin:.3rem 0">' + data.correct + '/' + data.total + ' 正确</div>';
                html += '<div class="progress-bar"><div class="progress-fill ' + (acc>=80?'progress-green':acc>=60?'progress-orange':'progress-red') + '" style="width:' + acc + '%"></div></div>';
            }
            html += '</div></div>';
        }
        
        html += '<h4 style="margin:1.5rem 0 1rem">📅 近7天趋势</h4>';
        html += '<div style="overflow-x:auto"><div style="min-width:400px">';
        html += '<div style="display:flex;align-items:end;height:100px;gap:4px;border-bottom:2px solid var(--border);padding-bottom:20px">';
        const maxTotal = Math.max(...stats.weekly.map(w=>w.total), 1);
        stats.weekly.forEach(w => {
            const h = w.total > 0 ? Math.max(w.total/maxTotal*80, 4) : 4;
            const color = w.accuracy >= 80 ? '#27ae60' : w.accuracy >= 60 ? '#f39c12' : '#e74c3c';
            html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">';
            html += '<div style="width:100%;max-width:30px;height:' + h + 'px;background:' + color + ';border-radius:0;min-height:4px"></div>';
            html += '<div style="font-size:.65rem;color:var(--text-secondary)">' + (w.date||'').slice(5) + '</div>';
            html += '</div>';
        });
        html += '</div></div></div>';
        
        if (stats.recent.length > 0) {
            html += '<h4 style="margin:1.5rem 0 1rem">📋 最近答题记录</h4>';
            html += '<div style="max-height:200px;overflow-y:auto">';
            stats.recent.reverse().forEach(r => {
                const subj = SUBJECTS[r.subject]?.name || r.subject || '综合';
                const acc = r.total > 0 ? Math.round(r.correct/r.total*100) : 0;
                const dt = r.date ? new Date(r.date).toLocaleString() : '';
                html += '<div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border);font-size:.85rem">';
                html += '<span>' + subj + '</span>';
                html += '<span>' + r.correct + '/' + r.total + '</span>';
                html += '<span style="color:' + (acc>=80?'var(--success)':acc>=60?'var(--warning)':'var(--danger)') + '">' + acc + '%</span>';
                html += '<span style="color:var(--text-secondary)">' + dt + '</span>';
                html += '</div>';
            });
            html += '</div>';
        }
        
        html += '<div style="margin-top:1rem"><button class="btn btn-outline" onclick="if(confirm(\'确定清空所有记录吗？\')){localStorage.removeItem(\'study_records\');Stats.show();}" style="padding:.5rem 1rem;font-size:.8rem">🗑 清空记录</button></div>';
        html += '</div>';
        
        container.innerHTML = html;
    }
};
