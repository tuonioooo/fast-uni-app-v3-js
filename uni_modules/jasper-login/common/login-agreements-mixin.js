const agreementsMixin = {
	data() {
		return {
			isMounted: false
		}
	},
	mounted() {
		this.isMounted = true
	},
	computed: {
		needAgreements() {
			if (this.isMounted) {
				if (this.$refs.agreements) {
					return this.$refs.agreements.needAgreements
				} else {
					return false
				}
			}
		},
		agree: {
			get() {
				if (this.isMounted) {
					if (this.$refs.agreements) {
						return this.$refs.agreements.isAgree
					} else {
						return true
					}
				}
			},
			set(agree) {
				if (this.$refs.agreements) {
					this.$refs.agreements.isAgree = agree
				} else {
					console.log('不存在 隐私政策协议组件');
				}
			}
		}
	}
}

export default agreementsMixin
