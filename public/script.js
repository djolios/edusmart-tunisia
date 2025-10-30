document.addEventListener('DOMContentLoaded', () => {
    // === هذه هي المعرفات الصحيحة من ملف index.html الخاص بك ===
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // دالة لإرسال الرسالة وعرض الرد
    const sendMessage = async () => {
        const messageText = userInput.value.trim();
        if (messageText === '') return; // لا ترسل رسالة فارغة

        // 1. إنشاء وعرض رسالة المستخدم
        const userMessageWrapper = document.createElement('div');
        userMessageWrapper.classList.add('message', 'user-message');
        userMessageWrapper.innerHTML = `
            <div class="message-label">أنت</div>
            <div class="message-bubble user-bubble">${messageText}</div>
        `;
        chatMessages.appendChild(userMessageWrapper);

        // تفريغ حقل الإدخال
        userInput.value = '';

        // 2. إرسال الرسالة إلى الخادم وجلب الرد
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                throw new Error('فشل الاتصال بالخادم');
            }

            const data = await response.json();
            const botReply = data.reply;

            // 3. إنشاء وعرض رد "ليسا"
            const botMessageWrapper = document.createElement('div');
            botMessageWrapper.classList.add('message', 'bot-message');
            
            // تحويل النص إلى وسوم HTML لعرض الأسطر الجديدة والتنسيق
            const formattedReply = botReply.replace(/\n/g, '<br>');

            botMessageWrapper.innerHTML = `
                <div class="message-label">Lisa (المساعد الذكي)</div>
                <div class="message-bubble bot-bubble">${formattedReply}</div>
            `;
            chatMessages.appendChild(botMessageWrapper);

        } catch (error) {
            console.error('Error:', error);
            // عرض رسالة خطأ للمستخدم في حال فشل الإرسال
            const errorMessageWrapper = document.createElement('div');
            errorMessageWrapper.classList.add('message', 'bot-message');
            errorMessageWrapper.innerHTML = `
                <div class="message-label">نظام</div>
                <div class="message-bubble bot-bubble">عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.</div>
            `;
            chatMessages.appendChild(errorMessageWrapper);
        }

        // 4. التمرير إلى آخر رسالة تلقائياً
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // ربط الدالة بزر الإرسال
    sendBtn.addEventListener('click', sendMessage);

    // ربط الدالة بالضغط على زر Enter
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});