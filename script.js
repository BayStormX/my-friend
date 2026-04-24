document.addEventListener("DOMContentLoaded", () => {
    let memories = JSON.parse(localStorage.getItem("bay_memories_v3")) || [];
    let currentCategory = "";

    const albumPage = document.getElementById("album-page");
    const galleryPage = document.getElementById("gallery-page");
    const galleryContainer = document.getElementById("gallery-container");
    const albumTitle = document.getElementById("album-title-display");
    const uploadModal = document.getElementById("upload-modal");

    // เปิดอัลบั้ม
    window.openAlbum = (cat, title) => {
        currentCategory = cat;
        albumTitle.innerText = title;
        albumPage.style.display = "none";
        galleryPage.style.display = "block";
        render();
    };

    // ย้อนกลับ
    window.goBack = () => {
        albumPage.style.display = "block";
        galleryPage.style.display = "none";
    };

    // เปิด-ปิด Modal
    window.openModal = () => uploadModal.style.display = "block";
    window.closeModal = () => uploadModal.style.display = "none";

    // เซฟรูปใหม่ (ชื่อฟังก์ชันตรงกับ HTML)
    window.saveNewPhoto = () => {
        const fileInput = document.getElementById("img-input");
        const titleInput = document.getElementById("title-input").value;
        const detailInput = document.getElementById("detail-input").value;

        if (!fileInput.files[0]) return alert("เลือกรูปก่อนนะเจ้าทาส 🐱");

        const reader = new FileReader();
        reader.onload = (e) => {
            memories.push({
                id: Date.now(),
                category: currentCategory,
                src: e.target.result,
                title: titleInput || "ความทรงจำใหม่",
                detail: detailInput || ""
            });
            localStorage.setItem("bay_memories_v3", JSON.stringify(memories));
            render();
            closeModal();
            // ล้างค่าในช่องกรอก
            fileInput.value = "";
            document.getElementById("title-input").value = "";
            document.getElementById("detail-input").value = "";
        };
        reader.readAsDataURL(fileInput.files[0]);
    };

    // ลบรูป
    window.deletePhoto = (id) => {
        if (confirm("ลบรูปนี้ใช่ไหม? 🥺")) {
            memories = memories.filter(m => m.id !== id);
            localStorage.setItem("bay_memories_v3", JSON.stringify(memories));
            render();
        }
    };

    // วาดรูปในหน้า Gallery
    function render() {
        galleryContainer.innerHTML = "";
        const data = memories.filter(m => m.category === currentCategory);

        if (data.length === 0) {
            galleryContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 100px; color: #888;">อัลบั้มนี้ยังว่างอยู่ เพิ่มรูปกันเลย! ✨</p>`;
            return;
        }

        data.forEach(item => {
            const container = document.createElement("div");
            container.className = "card-container";
            container.innerHTML = `
                <div class="card">
                    <div class="card-front">
                        <img src="${item.src}">
                        <div style="position: absolute; bottom: 0; background: rgba(0,0,0,0.5); color: white; width: 100%; padding: 10px; text-align: center;">${item.title}</div>
                    </div>
                    <div class="card-back">
                        <h3>${item.title}</h3>
                        <p>${item.detail}</p>
                        <button class="btn-delete" onclick="event.stopPropagation(); deletePhoto(${item.id})">🗑️ ลบรูปนี้</button>
                    </div>
                </div>
            `;
            container.onclick = () => openLightbox(item.src, item.title);
            galleryContainer.appendChild(container);
        });
    }

    // ดูรูปใหญ่
    window.openLightbox = (src, title) => {
        const lightbox = document.getElementById("lightbox");
        document.getElementById("lightbox-img").src = src;
        document.getElementById("lightbox-caption").innerText = title;
        lightbox.style.display = "block";
    };

    window.closeLightbox = () => {
        document.getElementById("lightbox").style.display = "none";
    };
});