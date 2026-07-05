function showToast(msg, duration=2000) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.updateNav();
});

window.App = App;
window.Quiz = Quiz;
window.Exam = Exam;
window.WrongBook = WrongBook;
window.Stats = Stats;
window.SUBJECTS = SUBJECTS;
window.GRADE_NAMES = GRADE_NAMES;
window.GRADE_LABELS = GRADE_LABELS;
window.BADGE_CLASSES = BADGE_CLASSES;
