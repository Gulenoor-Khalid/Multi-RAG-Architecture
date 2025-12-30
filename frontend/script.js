// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// State
let currentModel = null;
let isProcessing = false;

// DOM Elements
const elements = {
    modelSelect: document.getElementById('modelSelect'),
    loadModelBtn: document.getElementById('loadModelBtn'),
    useRAG: document.getElementById('useRAG'),
    temperature: document.getElementById('temperature'),
    tempValue: document.getElementById('tempValue'),
    maxTokens: document.getElementById('maxTokens'),
    tokensValue: document.getElementById('tokensValue'),
    fileInput: document.getElementById('fileInput'),
    uploadBtn: document.getElementById('uploadBtn'),
    uploadStatus: document.getElementById('uploadStatus'),
    clearDocsBtn: document.getElementById('clearDocsBtn'),
    chatMessages: document.getElementById('chatMessages'),
    chatInput: document.getElementById('chatInput'),
    sendBtn: document.getElementById('sendBtn'),
    sendBtnText: document.getElementById('sendBtnText'),
    currentModel: document.getElementById('currentModel'),
    docCount: document.getElementById('docCount'),
    systemStatus: document.getElementById('systemStatus'),
    systemPromptBtn: document.getElementById('systemPromptBtn'),
    promptModal: document.getElementById('promptModal'),
    systemPromptInput: document.getElementById('systemPromptInput'),
    savePromptBtn: document.getElementById('savePromptBtn'),
    cancelPromptBtn: document.getElementById('cancelPromptBtn')
};

// Initialize
async function init() {
    await loadModels();
    await updateStats();
    setupEventListeners();
}

// Load available models
async function loadModels() {
    try {
        const response = await fetch(`${API_BASE_URL}/models`);
        const data = await response.json();
        
        currentModel = data.current_model;
        
        // Populate model select
        elements.modelSelect.innerHTML = '';
        data.available_models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model.split('/').pop();
            if (model === currentModel) {
                option.selected = true;
            }
            elements.modelSelect.appendChild(option);
        });
        
        updateStats();
    } catch (error) {
        console.error('Error loading models:', error);
        showStatus(elements.uploadStatus, 'Failed to load models', 'error');
    }
}

// Update system stats
async function updateStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        elements.currentModel.textContent = currentModel ? currentModel.split('/').pop() : '-';
        elements.docCount.textContent = data.documents_count || 0;
        elements.systemStatus.textContent = data.status === 'healthy' ? '✅ Online' : '❌ Offline';
        elements.systemStatus.style.color = data.status === 'healthy' ? 'var(--success-color)' : 'var(--danger-color)';
    } catch (error) {
        console.error('Error updating stats:', error);
        elements.systemStatus.textContent = '❌ Error';
        elements.systemStatus.style.color = 'var(--danger-color)';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Temperature slider
    elements.temperature.addEventListener('input', (e) => {
        elements.tempValue.textContent = e.target.value;
    });
    
    // Max tokens slider
    elements.maxTokens.addEventListener('input', (e) => {
        elements.tokensValue.textContent = e.target.value;
    });
    
    // Load model button
    elements.loadModelBtn.addEventListener('click', loadSelectedModel);
    
    // Upload button
    elements.uploadBtn.addEventListener('click', uploadDocuments);
    
    // Clear documents button
    elements.clearDocsBtn.addEventListener('click', clearDocuments);
    
    // Send button
    elements.sendBtn.addEventListener('click', sendMessage);
    
    // System Prompt button
    elements.systemPromptBtn.addEventListener('click', openPromptModal);
    
    // Modal close buttons
    elements.cancelPromptBtn.addEventListener('click', closePromptModal);
    elements.savePromptBtn.addEventListener('click', saveSystemPrompt);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.promptModal) {
            closePromptModal();
        }
    });
    
    // Close button (X)
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePromptModal);
    }
    
    // Template buttons
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const template = e.target.dataset.template;
            loadTemplate(template);
        });
    });
    
    // Enter to send (Shift+Enter for new line)
    elements.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Load selected model
async function loadSelectedModel() {
    const modelName = elements.modelSelect.value;
    if (!modelName) return;
    
    elements.loadModelBtn.disabled = true;
    elements.loadModelBtn.textContent = 'Loading...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/models/load?model_name=${encodeURIComponent(modelName)}`, {
            method: 'POST'
        });
        
        if (!response.ok) throw new Error('Failed to load model');
        
        currentModel = modelName;
        showStatus(elements.uploadStatus, `Model ${modelName.split('/').pop()} loaded!`, 'success');
        await updateStats();
    } catch (error) {
        console.error('Error loading model:', error);
        showStatus(elements.uploadStatus, 'Failed to load model', 'error');
    } finally {
        elements.loadModelBtn.disabled = false;
        elements.loadModelBtn.textContent = 'Load Model';
    }
}

// Upload documents
async function uploadDocuments() {
    const files = elements.fileInput.files;
    if (files.length === 0) {
        showStatus(elements.uploadStatus, 'Please select files', 'error');
        return;
    }
    
    elements.uploadBtn.disabled = true;
    elements.uploadBtn.textContent = 'Uploading...';
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error('Upload failed');
            
            successCount++;
        } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
            errorCount++;
        }
    }
    
    // Show results
    if (errorCount === 0) {
        showStatus(elements.uploadStatus, `✅ Uploaded ${successCount} file(s)`, 'success');
    } else {
        showStatus(elements.uploadStatus, `⚠️ Uploaded ${successCount}, failed ${errorCount}`, 'error');
    }
    
    // Reset
    elements.fileInput.value = '';
    elements.uploadBtn.disabled = false;
    elements.uploadBtn.textContent = 'Upload';
    await updateStats();
}

// Clear all documents
async function clearDocuments() {
    if (!confirm('Are you sure you want to clear all documents?')) return;
    
    elements.clearDocsBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/documents`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to clear documents');
        
        showStatus(elements.uploadStatus, '🗑️ All documents cleared', 'success');
        await updateStats();
    } catch (error) {
        console.error('Error clearing documents:', error);
        showStatus(elements.uploadStatus, 'Failed to clear documents', 'error');
    } finally {
        elements.clearDocsBtn.disabled = false;
    }
}

// Send message
async function sendMessage() {
    const query = elements.chatInput.value.trim();
    if (!query || isProcessing) return;
    
    // Add user message
    addMessage(query, 'user');
    elements.chatInput.value = '';
    
    // Disable input
    isProcessing = true;
    elements.sendBtn.disabled = true;
    elements.sendBtnText.textContent = 'Processing...';
    
    // Create bot message placeholder
    const botMessageDiv = addMessage('', 'bot');
    const contentDiv = botMessageDiv.querySelector('.message-content');
    
    try {
        const response = await fetch(`${API_BASE_URL}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                use_rag: elements.useRAG.checked,
                max_tokens: parseInt(elements.maxTokens.value),
                temperature: parseFloat(elements.temperature.value)
            })
        });
        
        if (!response.ok) throw new Error('Query failed');
        
        const data = await response.json();
        
        // Update bot message
        contentDiv.innerHTML = `<p>${formatText(data.answer)}</p>`;
        
        // Add sources if available
        if (data.sources && data.sources.length > 0) {
            const sourcesDiv = document.createElement('div');
            sourcesDiv.className = 'sources';
            sourcesDiv.innerHTML = '<strong>📚 Sources:</strong> ' + 
                data.sources.map(s => `<em>${s}</em>`).join(', ');
            contentDiv.appendChild(sourcesDiv);
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        contentDiv.innerHTML = '<p style="color: var(--danger-color);">❌ Error: Failed to get response</p>';
    } finally {
        isProcessing = false;
        elements.sendBtn.disabled = false;
        elements.sendBtnText.textContent = 'Gửi';
        
        // Scroll to bottom
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }
}

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<p>${formatText(text)}</p>`;
    
    messageDiv.appendChild(contentDiv);
    elements.chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    
    return messageDiv;
}

// Format text with line breaks
function formatText(text) {
    return text
        .replace(/\n/g, '<br>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
}

// Show status message
function showStatus(element, message, type) {
    element.textContent = message;
    element.className = `status-message ${type}`;
    
    setTimeout(() => {
        element.textContent = '';
        element.className = 'status-message';
    }, 3000);
}

// System Prompt Functions
async function openPromptModal() {
    try {
        const response = await fetch(`${API_BASE_URL}/system-prompt`);
        const data = await response.json();
        elements.systemPromptInput.value = data.system_prompt;
        elements.promptModal.classList.add('show');
    } catch (error) {
        console.error('Error loading system prompt:', error);
        elements.systemPromptInput.value = '';
        elements.promptModal.classList.add('show');
    }
}

function closePromptModal() {
    elements.promptModal.classList.remove('show');
}

async function saveSystemPrompt() {
    const prompt = elements.systemPromptInput.value.trim();
    if (!prompt) {
        alert('System prompt không được để trống!');
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('prompt', prompt);
        
        const response = await fetch(`${API_BASE_URL}/system-prompt`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Failed to update system prompt');
        
        showStatus(elements.uploadStatus, '✅ System prompt đã được cập nhật!', 'success');
        closePromptModal();
    } catch (error) {
        console.error('Error saving system prompt:', error);
        alert('Lỗi khi lưu system prompt!');
    }
}

function loadTemplate(templateName) {
    const templates = {
        default: 'Bạn là trợ lý AI thông minh và hữu ích. Hãy trả lời câu hỏi một cách chính xác và rõ ràng.',
        
        fashion: `Bạn là tư vấn viên bán quần áo chuyên nghiệp và thân thiện tại một cửa hàng thời trang. 

Nhiệm vụ của bạn:
- Giúp khách hàng tìm trang phục phù hợp với nhu cầu, phong cách và ngân sách
- Tư vấn về xu hướng thời trang hiện đại
- Đề xuất cách phối đồ hài hòa
- Giải đáp thắc mắc về chất liệu, size, cách bảo quản
- Luôn nhiệt tình, am hiểu và đưa ra gợi ý cụ thể

Phong cách giao tiếp: Thân thiện, chuyên nghiệp, tạo cảm giác thoải mái cho khách hàng.`,
        
        support: `Bạn là nhân viên chăm sóc khách hàng chuyên nghiệp.

Nguyên tắc làm việc:
- Lắng nghe và thấu hiểu vấn đề của khách hàng
- Giải quyết vấn đề nhanh chóng và hiệu quả
- Luôn lịch sự, kiên nhẫn và tích cực
- Cung cấp thông tin chính xác và đầy đủ
- Theo dõi và đảm bảo khách hàng hài lòng

Phong cách: Chuyên nghiệp, thân thiện, empathy.`,
        
        teacher: `Bạn là một gia sư giỏi và tận tâm.

Phương pháp giảng dạy:
- Giải thích khái niệm một cách đơn giản, dễ hiểu
- Sử dụng ví dụ thực tế để minh họa
- Khuyến khích học sinh tư duy và đặt câu hỏi
- Kiên nhẫn giải đáp mọi thắc mắc
- Điều chỉnh cách giảng dạy phù hợp với từng học sinh

Mục tiêu: Giúp học sinh hiểu bài và yêu thích môn học.`
    };
    
    elements.systemPromptInput.value = templates[templateName] || templates.default;
}

// Initialize on load
init();
