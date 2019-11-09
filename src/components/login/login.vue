<template>
  <div class="container">
    <div class="close" @click="close"></div>
    <p class="title">手机号登录</p>

    <div class="weui-cell weui-cell_vcode">
        <div class="weui-cell__hd">
            <label class="weui-label">手机号</label>
        </div>
        <div class="weui-cell__bd">
            <input class="weui-input" maxlength="11" type="tel" pattern="^\d{11}$" placeholder="请输入手机号" v-model="phoneNum">
        </div>
        <div class="weui-cell__ft">
            <button v-show="timeCode == 60" class="weui-vcode-btn" @click="getCode">获取验证码</button>
            <div v-show="timeCode != 60" class="time-code weui-vcode-btn">{{timeCode}}s</div>
        </div>
    </div>

    <div class="weui-cell weui-cell_vcode vcode-input scale-1px">
        <div class="weui-cell__hd"><label class="weui-label">手机验证码</label></div>
        <div class="weui-cell__bd">
            <input v-model="code" class="weui-input" type="number" placeholder="请输入验证码">
        </div>

    </div>
    <div v-if="needCaptcha" class="weui-cell weui-cell_vcode captcha-code">
        <div class="weui-cell__hd"><label class="weui-label">图形验证码</label></div>
        <div class="weui-cell__bd">
            <input v-model="captcha" class="weui-input" type="number" placeholder="请输入验证码"/>
        </div>
        <div class="weui-cell__ft">
            <img class="weui-vcode-img" :src="captchaUrl" @click="reloadCaptcha"/>
        </div>
    </div>
    <a class="weui-btn weui-btn_primary" href="javascript:" @click="signUp">确定</a>

  </div>
</template>
<!-- 引入饿了么组件库 -->
<script src="/Users/jamlee/we_together/wetogether/public/lib/weui/weui.min.js"></script>
<script>
import service from '@/utils/service'
// import { getCookie } from '@/utils/cookie'
export default {
  name: 'login',
  props: {
    data: Object
  },
  data () {
    return {
      phoneNum: '',
      code: '',
      captcha: '',
      timeCode: 60,
      captchaUrl: service.baseURL + 'users/captcha',
      needCaptcha: false// getCookie('captcha') || false
    }
  },
  methods: {
    close () {
      this.$router.go(-1)
    },
    async getCode () {
      if (!/^\d{11}$/.test(this.phoneNum)) {
        weui.topTips('请输入正确手机号')
        return
      }
      if (this.phoneNum) {
        // 发送获取验证码请求
        let resp = await service.get('users/phonecode', {
          phonenum: this.phoneNum
        })

        if (resp.code === 0) {
          this.code = resp.data
          // 动态倒计时
          this.countTimeCode()
        }
      }
    },
    async signUp () {
      // 慕课网提示
      if (window.navigator.userAgent.indexOf('mukewang') > -1) {
        weui.topTips('体验登录后完整功能，点击右上角使用浏览器打开哦')
        return
      }
      // 判断手机号和验证码都有值才发送请求
      if (this.phoneNum && this.code) {
        // // 验证手机号是否合法
        if (!/^\d{11}$/.test(this.phoneNum)) {
          weui.topTips('请输入正确手机号')
          return
        }
        // 发送登录请求
        let resp = await service.post('users/signup', {
          phonenum: this.phoneNum,
          code: this.code,
          captcha: this.captcha
        })
        if (resp.code === 0) {
          if (resp.data.code === 'needCaptcha') {
            this.needCaptcha = true
            weui.topTips('操作频繁，请输入图形验证码')
            return
          }
          alert(resp.data)
          // 登录成功后，将当前用户的数据存入store，以便后续使用
          this.$store.dispatch('setUser', resp.data)
          this.$router.go(-1)
        }
      } else {
        weui.topTips('请输入验证码或手机号码')
      }
    },
    countTimeCode () {
      this.clearFlag = setInterval(() => {
        // 倒计时结束后，重制标志位
        if (this.timeCode == 0) {
          this.timeCode = 60
          clearInterval(this.clearFlag)
          return
        }
        // 秒数每次减1
        this.timeCode--
      }, 1000)// 1s调用1次
    },
    /*
    * 刷新验证码
    */
    reloadCaptcha () {
      this.captchaUrl = service.baseURL + 'users/captcha?' + Date.now()
    }
  },
  computed: {
  },
  beforeDestroy () {
    clearInterval(this.clearFlag)
  }
}
</script>
