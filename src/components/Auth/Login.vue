<style scoped lang="scss">
.form {
    background-color: #fff;
    border-radius: 15px;
}

.container {
    max-width: 400px;
    margin: 0 auto;
    padding: 30px;
}

.btn {
    width: 100%;
}
</style>
<template>
    <div class="form container mt-3">
        <h2>Đăng nhập</h2>
        <form @submit.prevent="login">
            <div class="form-group mb-4">
                <label for="username">Tên tài khoản</label>
                <input type="text" class="form-control" id="username" placeholder="Tài khoản" v-model="username"
                    required />
            </div>
            <div class="form-group mb-4">
                <label for="password">Mật khẩu</label>
                <input type="password" class="form-control" id="password" placeholder="Mật khẩu" v-model="password"
                    required />
            </div>
            <div class="d-flex justify-content-between">
                <div class="mb-4 form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                    <label class="form-check-label" for="exampleCheck1">Nhớ tài khoản</label>
                </div>
                <p style="text-decoration: underline">Quên mật khẩu</p>
            </div>
            <div class="message" v-if="message !== null && message !== ''">
                <div v-if="isSuccess" class="alert alert-success">
                    {{ message }}
                </div>
                <div v-else class="alert alert-danger">{{ message }}</div>
            </div>
            <button type="submit" class="btn btn-primary mb-2">
                Đăng nhập
            </button>
            <router-link to="/register">
                <button type="submit" class="btn btn-primary">Đăng Ký</button>
            </router-link>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            password: "",
            message: null,
            isSuccess: false,
        };
    },
    methods: {
        login() {
            const mockUser = {
                username: "admin",
                password: "admin"
            };

            if (this.username === mockUser.username && this.password === mockUser.password) {
                this.message = "Đăng nhập thành công!";
                this.isSuccess = true;
                localStorage.setItem("token", "mock-token");
                localStorage.setItem("username", this.username);
                localStorage.setItem("userId", "1");
                
                setTimeout(() => {
                    window.location.href = "/";
                }, 1200);
            } else {
                this.message = "Tên đăng nhập hoặc mật khẩu không đúng";
                this.isSuccess = false;
            }
        },
    },
};
</script>

