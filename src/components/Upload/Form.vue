<script>
export default {
    data() {
        return {
            formData: {
                title: "",
                categoryId: null,
                description: "",
                authorId: null,
                status: 0,
            },
            Categories: [
                { id: 1, name: "Kinh tế" },
                { id: 2, name: "Luận văn" },
                { id: 3, name: "Giáo dục" },
                { id: 4, name: "Khoa học" },
                { id: 5, name: "Sức khỏe" },
            ],
            authorName: localStorage.getItem("username") || "Ẩn danh",
            isLoading: false,
            selectedFile: null,
            showModal: false,
        };
    },

    methods: {
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0];
            if (!this.selectedFile) {
                alert("Vui lòng chọn một file hợp lệ.");
                return;
            }
            const allowedTypes = ["application/pdf"];
            if (!allowedTypes.includes(this.selectedFile.type)) {
                alert("Chỉ cho phép upload file PDF.");
                this.selectedFile = null;
                event.target.value = "";
                return;
            }

            console.log("File được chọn:", this.selectedFile);
        },
        submitForm() {
            this.isLoading = true;
            setTimeout(() => {
                const newCard = {
                    id: Date.now(),
                    title: this.formData.title,
                    thumbnail: "/default.png",
                    views: 0,
                    ratingAvg: 0,
                    authorName: this.authorName,
                    description: this.formData.description,
                };

                let storedCards = JSON.parse(localStorage.getItem("newCards") || "[]");

                storedCards.push(newCard);

                localStorage.setItem("newCards", JSON.stringify(storedCards));
                this.$emit("add-card", newCard);
                this.showModal = true;
                this.isLoading = false;
                this.formData = {
                    title: "",
                    categoryId: null,
                    description: "",
                    authorId: null,
                    status: 0,
                };
                this.selectedFile = null;
            }, 1000);
        },
        closeModal() {
            this.showModal = false;
        }
    },
};
</script>

<template>
    <div class="apply-course">
        <div class="wrapper">
            <form @submit.prevent="submitForm" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-12 mb-3">
                        <label for="title" class="form-label">Tiêu đề</label>
                        <input id="title" type="text" class="form-control" placeholder="Nhập tiêu đề"
                            v-model="formData.title" required />
                    </div>
                    <div class="col-12 d-grid gap-1 mb-3">
                        <label>Danh mục</label>
                        <select class="select-category" name="categoryId" id="categories" v-model="formData.categoryId"
                            required>
                            <option v-for="item in Categories" :value="item.id">
                                {{ item.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-12 mb-3">
                        <label for="formFile" class="form-label">Upload file</label>
                        <input class="upload form-control" type="file" id="formFile" @change="handleFileUpload"
                            required />
                    </div>
                    <div class="col-12 mb-3">
                        <label class="form-label">Mô tả</label>
                        <textarea class="description form-control" type="text" placeholder="Nhập mô tả"
                            name="description" v-model="formData.description"></textarea>
                    </div>
                    <div class="col-12 text-center pt-4">
                        <button class="btn-apply" type="submit" :disabled="isLoading">
                            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"
                                aria-hidden="true"></span>
                            Lưu thông tin
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div v-if="showModal" class="modal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <p>Tài liệu đã được upload thành công!</p>
            <div class="d-flex justify-content-around">
                <router-link to="/">
                    <button class="btn btn-outline-primary">
                        Về trang chủ
                    </button>
                </router-link>
                <button @click="closeModal" class="btn btn-outline-danger">Đóng</button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.apply-course .wrapper {
    font-size: 17px;
    padding: 40px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.select-category {
    width: 100%;
    border: none;
    background-color: #e9ecef;
    padding: 10px 20px;
}

.btn-apply {
    background-color: #1976d2;
    border: 2px solid #fff;
    padding: 10px 20px;
    color: #fff;
    border-radius: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    text-transform: uppercase;
    transition: all 0.3s ease 0s;

    &:hover {
        background-color: #0e1a61;
    }
}

.description {
    background: #e9ecef;
    height: 100px;
    border: 0;
    font-size: 14px;
    width: 100%;
    padding: 10px 20px;
}

.upload {
    background: #e9ecef;
}

.spinner-border {
    margin-right: 5px;
    width: 1rem;
    height: 1rem;
    border-width: 0.2em;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
    text-align: center;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 30px;
    cursor: pointer;
}
</style>
