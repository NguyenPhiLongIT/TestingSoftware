<template>
    <div>
        <MainContent :title="title" :cards="cards" ref="pageRef" />
    </div>
</template>

<script lang="ts">
import { DataCard } from "@/components/Blog/Card";
import { defineAsyncComponent } from "vue";

export default {
    components: {
        MainContent: defineAsyncComponent(() => import("@/components/Blog/DataCard.vue")),
    },
    data() {
        return {
            title: "Tài liệu",
            cards: [] as DataCard[],
        };
    },
    created() {
        this.fetchData();
    },
    watch: {
        "$route.query.refresh"(newVal) {
            if (newVal) {
                this.fetchData();
            }
        },
    },
    methods: {
        fetchData() {
            // Giả lập lấy dữ liệu từ server hoặc localStorage
            this.cards = [
                {
                    id: 1,
                    title: "Giáo trình Nhập môn trí tuệ nhân tạo",
                    thumbnail: "https://example.com/vue-thumbnail.jpg",
                    views: 1200,
                    ratingAvg: 4.5,
                    authorName: "Nguyễn Văn A",
                    href: "/vue-js",
                },
                {
                    id: 2,
                    title: "Toán rời rạc",
                    thumbnail: "https://example.com/ts-thumbnail.jpg",
                    views: 800,
                    ratingAvg: 4.7,
                    authorName: "Trần Thị B",
                    href: "/typescript",
                },
                {
                    id: 3,
                    title: "Xác suất thống kê",
                    thumbnail: "https://example.com/js-thumbnail.jpg",
                    views: 1500,
                    ratingAvg: 4.8,
                    authorName: "Lê Văn C",
                    href: "/javascript",
                },
            ];

            // Kiểm tra nếu có tài liệu mới từ localStorage
            const newCards = JSON.parse(localStorage.getItem("newCards") || "[]");
            this.cards = [...this.cards, ...newCards];
        },
    },
};
</script>
