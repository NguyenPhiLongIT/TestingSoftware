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
            this.cards = [
                {
                    id: 1,
                    title: "Giáo trình Nhập môn trí tuệ nhân tạo",
                    thumbnail: "/default.png",
                    views: 1200,
                    ratingAvg: 4.5,
                    authorName: "Nguyễn Văn A",
                    description: "Giáo trình nhập môn trí tuệ nhân tạo của PTIT"
                },
                {
                    id: 2,
                    title: "Toán rời rạc",
                    thumbnail: "/default.png",
                    views: 800,
                    ratingAvg: 4.7,
                    authorName: "Trần Thị B",
                },
                {
                    id: 3,
                    title: "Xác suất thống kê",
                    thumbnail: "/default.png",
                    views: 1500,
                    ratingAvg: 4.8,
                    authorName: "Lê Văn C",
                },
            ];

            const newCards = JSON.parse(localStorage.getItem("newCards") || "[]");
            this.cards = [...this.cards, ...newCards];
        },
    },
};
</script>
