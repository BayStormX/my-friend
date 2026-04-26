document.addEventListener("DOMContentLoaded", () => {
    let memories = JSON.parse(localStorage.getItem("bay_crush_log")) || [];
    const memoryFeed = document.getElementById("memory-feed");
    const uploadModal = document.getElementById("upload-modal");

    window.openModal = () => {
        uploadModal.style.display = "block";
        // ตั้งค่าเวลาปัจจุบันให้อัตโนมัติ
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById("memory-datetime").value = now.toISOString().slice(0, 16);
    };
    window.closeModal = () => uploadModal.style.display = "none";

    window.saveNewMemory = () => {
        const datetime = document.getElementById("memory-datetime").value;
        const mediaInput = document.getElementById("media-input").files[0];
        const reason = document.getElementById("memory-reason").value;
        const story = document.getElementById("memory-story").value;

        if (!datetime || (!reason && !story)) return alert("กรุณาใส่วันที่และเขียนอะไรสักหน่อยนะครับ");

        if (mediaInput) {
            // ถ้ามีการแนบไฟล์
            const reader = new FileReader();
            reader.onload = (e) => {
                saveData(e.target.result, mediaInput.type.startsWith('video') ? 'video' : 'image');
            };
            reader.readAsDataURL(mediaInput);
        } else {
            // ถ้าเป็นบันทึกข้อความอย่างเดียว
            saveData(null, 'text');
        }

        function saveData(src, type) {
            const memory = {
                id: Date.now(),
                type: type,
                src: src,
                datetime: datetime,
                reason: reason || "อัปเดตประจำวัน",
                story: story || ""
            };
            memories.unshift(memory);
            localStorage.setItem("bay_crush_log", JSON.stringify(memories));
            renderFeed();
            closeModal();
            // Clear inputs
            document.getElementById("media-input").value = "";
            document.getElementById("memory-reason").value = "";
            document.getElementById("memory-story").value = "";
        }
    };

    window.deleteMemory = (id) => {
        if(confirm("ลบบันทึกนี้ใช่ไหม?")) {
            memories = memories.filter(m => m.id !== id);
            localStorage.setItem("bay_crush_log", JSON.stringify(memories));
            renderFeed();
        }
    };

    function renderFeed() {
        memoryFeed.innerHTML = "";
        if (memories.length === 0) {
            memoryFeed.innerHTML = `<div style="text-align:center; padding: 80px; color: #ccc;">ยังไม่มีการอัปเดต... เริ่มเขียนเรื่องราวดีๆ วันนี้เลย ✨</div>`;
            return;
        }

        memories.forEach(m => {
            const card = document.createElement("div");
            card.className = `memory-card ${m.type === 'text' ? 'text-only-card' : ''}`;
            
            const d = new Date(m.datetime);
            const dateStr = d.toLocaleDateString('th-TH', { 
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            });

            let mediaHTML = "";
            if (m.type === 'video') mediaHTML = `<video src="${m.src}" controls class="memory-media"></video>`;
            else if (m.type === 'image') mediaHTML = `<img src="${m.src}" class="memory-media">`;

            card.innerHTML = `
                <button class="delete-btn" onclick="deleteMemory(${m.id})">×</button>
                <span class="memory-time">📅 ${dateStr} น.</span>
                <span class="label-tag">${m.type === 'text' ? '📝 Daily Update' : '📸 Moment'}</span>
                ${mediaHTML}
                <h3>${m.reason}</h3>
                <p>${m.story}</p>
            `;
            memoryFeed.appendChild(card);
        });
    }

    renderFeed();
});
