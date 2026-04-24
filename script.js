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

    // ฟังก์ชันเซฟรูปลง Cloud (ทุกคนจะเห็นรูปนี้)
window.saveNewPhoto = async () => {
    const file = document.getElementById("img-input").files[0];
    const title = document.getElementById("title-input").value;
    const detail = document.getElementById("detail-input").value;

    if (!file) return alert("เลือกรูปก่อนนะ!");

    // 1. อัปโหลดรูปไปที่ Firebase Storage
    const storageRef = ref(window.storage, 'memories/' + Date.now() + "_" + file.name);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 2. บันทึกข้อมูลลง Firestore (Database)
    await addDoc(collection(window.db, "photos"), {
        src: downloadURL,
        title: title || "ความทรงจำ",
        detail: detail || "",
        category: currentCategory,
        createdAt: new Date()
    });

    closeModal();
    alert("ลงรูปสำเร็จ! เพื่อนๆ เห็นแล้วนะ");
};

// ฟังก์ชันดึงรูปจาก Cloud แบบ Real-time (ใครลงรูปปุ๊บ เด้งขึ้นปั๊บ)
function listenToPhotos() {
    const q = query(collection(window.db, "photos"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
        allPhotos = []; // เก็บรูปทั้งหมดไว้แสดงผล
        snapshot.forEach((doc) => {
            allPhotos.push({ id: doc.id, ...doc.data() });
        });
        render(); // เรียกฟังก์ชันวาดหน้าจอเดิมที่มีอยู่
    });
}

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
