<style lang="scss">
.fit-image {
	height: 100%;
	-o-object-fit: cover;
	object-fit: cover;
	-o-object-position: center;
	object-position: center;
	width: 100%;
}

.card-wrap {
	color: #666;
	font-size: 15px;
	font-style: normal;
	font-weight: 400;
	position: relative;
	visibility: visible;
	font-family: Arial, Helvetica, sans-serif;
}

.ncard .card-wrap {
	margin-bottom: -5px;
	padding: 0;

	.card-thumbnail {
		.card-link {
			display: block;
			position: relative;

			img {
				height: 215px;
				overflow: hidden;
			}

			&:hover::before {
				opacity: 1;
				transform: scaleX(1);
				visibility: visible;
			}

			&::before {
				background-color: rgba(0, 0, 0, 0.3);
				content: '';
				height: 100%;
				left: 0;
				opacity: 0;
				position: absolute;
				top: 0;
				transform: scaleX(0);
				transition: 0.4s;
				visibility: hidden;
				width: 100%;
				z-index: 2;
			}
		}
	}

	.card-content-wrap {
		border-left: 1px solid #bcbcbc;
		border-bottom: 1px solid #bcbcbc;
		border-right: 1px solid #bcbcbc;
		padding: 5px 25px;
		font-size: 16px;

		.title {
			height: 54px;
			line-height: 1.3;
			color: #1976d2;
			font-size: 20px;
			font-weight: 600;
			overflow: hidden;
			word-wrap: break-word;
			text-transform: capitalize;

			.card-link {
				color: #1976d2;
			}
		}

		.sumary-content {
			text-align: justify;
			font-size: 15px;
			height: 60px;
			overflow: hidden;
			word-wrap: break-word;
			line-height: 20px;
		}
	}
}

.tcard-wrap {
	box-shadow: 0 0 20px 0 #00000040;
	padding: 0;
	margin: 0 1px;

	.card-content-wrap {
		padding: 0 1.5rem;

		.title {
			min-height: 60px;
			line-height: 1.3;
			color: #1976d2;
			font-size: 23px;
			font-weight: 600;

			.card-link {
				color: #1976d2;

				&:hover {
					color: #122179;
					transition: all 0.3s ease 0s;
				}
			}
		}

		.sumary-content {
			text-align: justify;
			font-size: 13px;
			height: 60px;
			overflow: hidden;
			word-wrap: break-word;
			line-height: 20px;
		}

		.card-meta {
			text-align: right;
			padding-right: 10px;
			font-size: 12px;

			a {
				margin-left: 5px;

				i {
					font-size: 20px;
				}
			}
		}
	}
}
</style>

<template>
	<div class="card-wrap" :class="isTopCard ? 'row tcard-wrap' : ''">
		<div class="card-thumbnail" :class="isTopCard ? 'col-lg-6 col-xl-7 ps-0' : ''">
			<router-link :to="`/documents/${cardContent.id}`" class="card-link">
				<img class="fit-image" :src="cardContent.thumbnail" />
			</router-link>
		</div>
		<div class="card-content-wrap" :class="isTopCard ? 'col-lg-6 col-xl-5 m-auto' : 'pt-4'">
			<h3 class="title">
				<router-link :to="`/documents/${cardContent.id}`" class="card-link">
					{{ cardContent.title }}
				</router-link>
			</h3>
			<p class="sumary-content fw-bold d-grid gap-1">
				<div class="d-flex justify-content-between">
					<span style="color: #666;">{{ cardContent.authorName }}</span>

					<div class="d-flex gap-2">
						<span>{{ cardContent.views }} views</span>
						-
						<span>{{ cardContent.ratingAvg }} <i class="bi bi-star-fill" style="color:darkgoldenrod;"></i></span>
					</div>
				</div>
				<span style="font-size: small;">{{ cardContent.description }}</span>
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { DataCard } from './Card';

export default {
	name: 'DataCardItem',
	props: {
		cardContent: {
			type: Object as PropType<DataCard>,
			required: true,
		},
		isTopCard: { type: Boolean, default: false },
	},
	data() {
		return {
			authorId: this.cardContent.authorId,
			authorName: "",
		}
	},
	methods: {
		getCurrentLink() {
			return window.location.origin;
		},
	},
};
</script>