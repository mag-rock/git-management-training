// TODOアプリの機能
let todos = [];

// ローカルストレージからデータを安全に読み込み
function loadTodos() {
    try {
        const stored = localStorage.getItem('todos');
        if (stored) {
            const parsed = JSON.parse(stored);
            // 配列であることを確認
            if (Array.isArray(parsed)) {
                todos = parsed;
            } else {
                console.warn('ローカルストレージのデータが配列ではありません。初期化します。');
                todos = [];
            }
        } else {
            todos = [];
        }
    } catch (error) {
        console.error('ローカルストレージの読み込みエラー:', error);
        todos = [];
        // 破損したデータをクリア
        localStorage.removeItem('todos');
    }
}

// DOM要素の取得
const todoInput = document.getElementById('todoInput');
const priorityInput = document.getElementById('priorityInput');
const dueDateInput = document.getElementById('dueDateInput');
const todoList = document.getElementById('todoList');
const completedCount = document.getElementById('completedCount');
const totalCount = document.getElementById('totalCount');
const overdueCount = document.getElementById('overdueCount');
const todayDueCount = document.getElementById('todayDueCount');
const highPriorityCount = document.getElementById('highPriorityCount');
const mediumPriorityCount = document.getElementById('mediumPriorityCount');
const lowPriorityCount = document.getElementById('lowPriorityCount');

// 初期化
loadTodos();
renderTodos();
updateStats();

// タスク追加機能
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: priority || null,
        dueDate: dueDate || null,
        createdAt: new Date().toISOString()
    };
    
    todos.push(todo);
    saveTodos();
    renderTodos();
    updateStats();
    
    todoInput.value = '';
    priorityInput.value = '';
    dueDateInput.value = '';
}

// Enterキーでタスク追加
todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// タスクの完了/未完了切り替え
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveTodos();
    renderTodos();
    updateStats();
}

// タスク削除機能
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
}

// 期限の状態をチェック
function getDueDateStatus(dueDate) {
    if (!dueDate) return null;
    
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        
        if (isNaN(due.getTime())) {
            console.warn('無効な日付形式:', dueDate);
            return null;
        }
        
        if (due < today) return 'overdue';
        if (due.getTime() === today.getTime()) return 'today';
        return 'future';
    } catch (error) {
        console.error('日付処理エラー:', error);
        return null;
    }
}

// 期限の表示形式を取得
function formatDueDate(dueDate) {
    if (!dueDate) return '';
    
    try {
        const date = new Date(dueDate);
        if (isNaN(date.getTime())) {
            return '無効な日付';
        }
        
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
    
    // デバッグ用ログ出力
    console.log('formatDueDate called with:', dueDate);
    console.log('Parsed date:', date);
    console.log('Today:', today);
    console.log('Tomorrow:', tomorrow);
        
        if (date.toDateString() === today.toDateString()) {
        console.log('Returning: 今日');
            return '今日';
        } else if (date.toDateString() === tomorrow.toDateString()) {
        console.log('Returning: 明日');
            return '明日';
        } else {
            const formattedDate = date.toLocaleDateString('ja-JP');
        }
    } catch (error) {
        console.error('日付フォーマットエラー:', error);
        return 'エラー';
        console.log('Returning:', formattedDate);
        return formattedDate;
    }
}

// 優先度の表示テキストを取得
function getPriorityText(priority) {
    switch(priority) {
        case 'high': return '高';
        case 'medium': return '中';
        case 'low': return '低';
        default: return '';
    }
}

// 優先度の数値を取得（ソート用）
function getPriorityValue(priority) {
    switch(priority) {
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 0;
    }
}

// タスクのソート
function sortTodos() {
    const sortType = document.getElementById('sortSelect').value;
    
    todos.sort((a, b) => {
        switch(sortType) {
            case 'priority':
                return getPriorityValue(b.priority) - getPriorityValue(a.priority);
            case 'dueDate':
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            case 'created':
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
    
    renderTodos();
}

// タスク一覧の表示
function renderTodos() {
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        const dueStatus = getDueDateStatus(todo.dueDate);
        
        li.className = `todo-item ${todo.completed ? 'completed' : ''} ${dueStatus === 'overdue' ? 'overdue' : ''} ${dueStatus === 'today' ? 'today-due' : ''} ${todo.priority ? 'priority-' + todo.priority : ''}`;
        
        const prioritySpan = todo.priority ? 
            `<span class="todo-priority ${todo.priority}">${getPriorityText(todo.priority)}</span>` : '';
        
        const dueDateSpan = todo.dueDate ? 
            `<span class="todo-due-date ${dueStatus === 'overdue' ? 'overdue' : ''} ${dueStatus === 'today' ? 'today' : ''}">期限: ${formatDueDate(todo.dueDate)}</span>` : '';
        
        li.innerHTML = `
            <input type="checkbox" 
                   class="todo-checkbox" 
                   ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${todo.text}</span>
            ${prioritySpan}
            ${dueDateSpan}
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">削除</button>
        `;
        
        todoList.appendChild(li);
    });
}

// 統計情報の更新
function updateStats() {
    const completed = todos.filter(todo => todo.completed).length;
    const total = todos.length;
    const overdue = todos.filter(todo => !todo.completed && getDueDateStatus(todo.dueDate) === 'overdue').length;
    const todayDue = todos.filter(todo => !todo.completed && getDueDateStatus(todo.dueDate) === 'today').length;
    const highPriority = todos.filter(todo => !todo.completed && todo.priority === 'high').length;
    const mediumPriority = todos.filter(todo => !todo.completed && todo.priority === 'medium').length;
    const lowPriority = todos.filter(todo => !todo.completed && todo.priority === 'low').length;
    
    completedCount.textContent = completed;
    totalCount.textContent = total;
    overdueCount.textContent = overdue;
    todayDueCount.textContent = todayDue;
    highPriorityCount.textContent = highPriority;
    mediumPriorityCount.textContent = mediumPriority;
    lowPriorityCount.textContent = lowPriority;
}

// ローカルストレージに安全に保存
function saveTodos() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
        console.error('ローカルストレージの保存エラー:', error);
        alert('データの保存に失敗しました。ブラウザの設定を確認してください。');
    }
}

// 全タスク削除機能（デバッグ用）
function clearAllTodos() {
    if (confirm('すべてのタスクを削除しますか？')) {
        todos = [];
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// データ修復機能
function repairData() {
    if (confirm('破損したデータを修復しますか？')) {
        loadTodos();
        renderTodos();
        updateStats();
        alert('データ修復が完了しました。');
    }
}

// サンプルデータの追加（開発用）
function addSampleTodos() {
    const sampleTodos = [
        { text: 'Gitの基本を学ぶ', priority: 'high', dueDate: null },
        { text: 'ブランチを作成する', priority: 'medium', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
        { text: 'コミットを実行する', priority: 'high', dueDate: new Date().toISOString().split('T')[0] },
        { text: 'マージを練習する', priority: 'low', dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
        { text: 'コンフリクトを解決する', priority: 'medium', dueDate: null }
    ];
    
    sampleTodos.forEach(item => {
        const todo = {
            id: Date.now() + Math.random(),
            text: item.text,
            completed: false,
            priority: item.priority,
            dueDate: item.dueDate,
            createdAt: new Date().toISOString()
        };
        todos.push(todo);
    });
    
    saveTodos();
    renderTodos();
    updateStats();
}