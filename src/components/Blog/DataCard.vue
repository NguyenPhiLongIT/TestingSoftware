<style lang="scss" scoped>
	.container {
		.page-title {
			padding: 50px 0;
			width: 100%;
			div {
				justify-content: center;
				h1 {
					border-bottom: 1px solid #bcbcbc;
					padding-bottom: 30px;
				}
			}
		}
	}
</style>

<template>
	<div class="container">
		<div class="page-title container">
			<div class="d-flex">
				<h1 class="col-12 text-center">{{ title }}</h1>
			</div>
		</div>
		<section
			class="contents-wrap"
			id="cards-list">
			<div class="row">
				<div
					v-for="(card, index) in cards"
					:key="index"
					class='ncard col-md-6 col-lg-4 mb-5'>
					<DataCardItem
						:cardContent="card"/>
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
	import DataCardItem from './DataCardItem.vue';
	import { DataCard } from './Card';

	export default {
		name: 'DataCard',
		components: { DataCardItem },
		props: {
			title: { type: String, default: 'Danh sách thẻ' },
			cards: {
				type: Array<DataCard>,
				default: [],
			}, // This is from server, 10 each page
		},
		methods: {},
		watch: {
			cards(newCards) {
				// console.log('Cards:', newCards);  // Kiểm tra dữ liệu cards nhận được
			}
		}
	};
</script>