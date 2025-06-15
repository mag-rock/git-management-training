// TODOアプリの機能
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// DOM要素の取得
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const completedCount = document.getElementById('completedCount');
const totalCount = document.getElementById('totalCount');

// 初期表示
renderTodos();
updateStats();

// タスク追加機能
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(todo);
    saveTodos();
    renderTodos();
    updateStats();
    
    todoInput.value = '';
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

// タスク一覧の表示
function renderTodos() {
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" 
                   class="todo-checkbox" 
                   ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">削除</button>
        `;
        
        todoList.appendChild(li);
    });
}

// 統計情報の更新
function updateStats() {
    const completed = todos.filter(todo => todo.completed).length;
    const total = todos.length;
    
    completedCount.textContent = completed;
    totalCount.textContent = total;
}

// ローカルストレージに保存
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
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

// サンプルデータの追加（開発用）
function addSampleTodos() {
    const sampleTodos = [
        'Gitの基本を学ぶ',
        'ブランチを作成する',
        'コミットを実行する',
        'マージを練習する',
        'コンフリクトを解決する'
    ];
    
    sampleTodos.forEach(text => {
        const todo = {
            id: Date.now() + Math.random(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        todos.push(todo);
    });
    
    saveTodos();
    renderTodos();
    updateStats();
} 