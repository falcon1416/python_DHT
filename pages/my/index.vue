<template>
	<scroll-view scroll-y class="page">
		
	<swiper class="screen-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
		 :autoplay="true" interval="5000" duration="500">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
				<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
			</swiper-item>
		</swiper>
        
        
		<button v-if="isLogin==false" :loading="isLoading" class="margin-top bg-red" open-type="getUserInfo" @getuserinfo="handleUserInfo">获取用户信息</button>

		<view v-else class="cu-list menu margin-top">
			<view @click="toShop" class="cu-item arrow">
				<view class="content">
					<text class="cuIcon-warn text-green"></text>
					<text class="text-grey">提交的店铺</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{shopInfo.pass_count}}/{{shopInfo.wait_count+shopInfo.pass_count}}</text>
				</view>
			</view>
			<view v-if="isAdmin" @click="toAuditShop" class="cu-item arrow">
				<view class="content">
					<text class="cuIcon-warn text-green"></text>
					<text class="text-grey">审核店铺</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{shopInfo.all_wait_count}}</text>
				</view>
			</view>
		</view>
		
	</scroll-view>
</template>

<script>
	import {
		Code2Session
	} from "@/api/app/index.js"
	import {
		Register,
		Login,
		MyInfo
	} from "@/api/user/index.js"
	export default {
		data() {
			return {
				isLogin: false,
				isLoading: false,
				
				isAdmin:false,

				shopInfo: {
					pass_count: 0,
					wait_count: 0
				},
                swiperList: [{
                	id: 0,
                	type: 'image',
                	url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572835030740&di=95e09b6c7cc86942c98cbce96dfc2f4a&imgtype=0&src=http%3A%2F%2Fwww.hanfudian.com%2FStorage%2Fgallery%2F201505%2F20150501103344_0781.jpg'
                }, {
                	id: 1,
                	type: 'image',
                	url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571636052810&di=a72e718e89843b26bd55500779466e2f&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fad547b7090e0ba0ff5729b5809d40742186e033ff624-sC1wHP_fw658',
                }],
			};
		},
		created() {
			this.initView();
		},
		methods: {
			initView(){
				const uid = this.$store.getters.uid
				if (uid > 0) {
					this.isLogin = true;
					this.loadData();
				}
				this.isAdmin=this.$store.getters.isAdmin
			},
			loadData() {
				const uid = this.$store.getters.uid
				MyInfo(uid,info => {
					this.shopInfo = info.shop
				})
			},
			handleUserInfo(e) {
				let data=e.detail.rawData?e.detail.rawData:e.detail.data
				const info = JSON.parse(data)
				this.login(info)
			},
			login(info) {
				const avatar = info.avatarUrl;
				const sex = info.gender;
				const name = info.nickName;
				// #ifdef MP-WEIXIN || MP-QQ
				this.isLoading = true;
				//获取openid
				uni.login({
					success: res => {
						Code2Session(res.code, info => {
							const openid = info.openid;
							Register(openid, name, avatar, sex, info => {
								//重新登录
								Login(openid,info=>{
									const uid=info.id;
									this.$store.dispatch('user/setUID', uid)
									if(uid>0){
										this.$store.dispatch('user/setName', info.name)
										this.$store.dispatch('user/setAvatar', info.avatar)
										this.$store.dispatch('user/setSex', info.sex)
										this.$store.dispatch('user/setAdmin', info.is_admin)
									}
									
									this.isLoading = false;
									this.initView();
								});
								

							})
						})
					}
				});


				// #endif	

			},
			toShop() {
				uni.navigateTo({
					url: "/pages/my/shop/list"
				})
			},
			toAuditShop() {
				uni.navigateTo({
					url: "/pages/my/shop/auditList"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
 .cuIcon-warn { font-size:40rpx;margin-right:20rpx;}
</style>
