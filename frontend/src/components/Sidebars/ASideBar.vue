<script setup lang="ts">
// import { Icon } from '@arco-design/web-vue'
//
// const IconFont = Icon.addFromIconFontCn({
//   src: 'https://at.alicdn.com/t/font_180975_ue66sq60vyd.js'
// })
import AFooter from '@/components/Footers/AFooter.vue'
import { useUserStore } from '@/store'
import { useRoute } from 'vue-router'
const userStore = useUserStore()
</script>

<template>
  <div id="a-side-bar">
    <div class="logo border-4">
      <div>
        <!--        <a class="logo-img"></a>-->
        <a
          ><a-image
            class="logo-img"
            src="/images/logo/transparent-white-text.png"
            :fit="'contain'"
            :preview-visible="false"
            width="100%"
            height="100%"
          ></a-image
        ></a>
      </div>
    </div>
    <div class="scroll-content">
      <a-menu
        mode="pop"
        :selected-keys="[$route.meta.key, $route.params.channelName]"
        class="nav-menu"
        :theme="'dark'"
      >
        <a-menu-item key="1" @click="$router.push({ name: 'discover' })">
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>首页</span></div>
          </a>
        </a-menu-item>
        <a-menu-item key="2" @click="$router.push({ name: 'VideoRecommend' })">
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>推荐</span></div>
          </a>
        </a-menu-item>
        <a-menu-item key="3" v-show="!userStore.isAdmin && false">
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>关注</span></div>
          </a></a-menu-item
        >
        <a-menu-item key="4" v-show="!userStore.isAdmin && false">
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text">
              <span>朋友</span>
            </div>
            <div style="position: absolute; transform: translate(75px, 12%)">
              <a-badge
                :count="1"
                :max-count="99"
                :dot-style="{
                  backgroundColor: '#fe2c55',
                  'box-shadow': 'none',
                  opacity: 1
                }"
              />
            </div>
          </a>
        </a-menu-item>
        <a-menu-item key="5" v-show="!userStore.isAdmin && userStore.getCurrentUser">
          <a
            class="nav-a"
            @click="
              $router.push({
                name: 'userProfile',
                params: { user_id: userStore.getCurrentUserNotAdmin.id }
              })
            "
          >
            <div class="nav-icon" />
            <div class="nav-text"><span>我的</span></div>
          </a>
        </a-menu-item>
        <a-menu-item
          key="6"
          v-show="userStore.isUserNotAdmin()"
          @click="$router.push({ name: 'postVideo' })"
        >
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>投稿</span></div>
          </a></a-menu-item
        >
        <a-menu-item disabled>
          <a-divider class="divider" />
        </a-menu-item>

        <a-menu-item key="7" v-show="false">
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>放映厅</span></div>
          </a></a-menu-item
        >
        <a-menu-item
          key="knowledge"
          @click="
            $router.replace({
              name: 'Channel',
              params: {
                channelName: 'knowledge'
              }
            })
          "
        >
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>知识</span></div>
          </a></a-menu-item
        >
        <a-menu-item
          key="hot"
          @click="
            $router.replace({
              name: 'Channel',
              params: {
                channelName: 'hot'
              }
            })
          "
        >
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>热点</span></div>
          </a></a-menu-item
        >
        <a-menu-item
          key="game"
          @click="
            $router.replace({
              name: 'Channel',
              params: {
                channelName: 'game'
              }
            })
          "
        >
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>游戏</span></div>
          </a></a-menu-item
        >
        <a-menu-item
          key="entertainment"
          @click="
            $router.replace({
              name: 'Channel',
              params: {
                channelName: 'entertainment'
              }
            })
          "
        >
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>娱乐</span></div>
          </a>
        </a-menu-item>
        <a-menu-item
          key="ACGN"
          @click="
            $router.replace({
              name: 'Channel',
              params: {
                channelName: 'ACGN'
              }
            })
          "
        >
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>二次元</span></div>
          </a>
        </a-menu-item>
        <a-menu-item
          key="music"
          @click="
            $router.replace({
              name: 'Channel',
              params: {
                channelName: 'music'
              }
            })
          "
        >
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>音乐</span></div>
          </a>
        </a-menu-item>
        <a-menu-item
          key="delicacy"
          @click="
            $router.push({
              name: 'Channel',
              params: {
                channelName: 'delicacy'
              }
            })
          "
        >
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>美食</span></div>
          </a>
        </a-menu-item>
        <a-menu-item
          key="sports"
          @click="
            $router.push({
              name: 'Channel',
              params: {
                channelName: 'sports'
              }
            })
          "
        >
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>体育</span></div>
          </a>
        </a-menu-item>
        <a-menu-item
          key="fashions"
          @click="
            $router.push({
              name: 'Channel',
              params: {
                channelName: 'fashions'
              }
            })
          "
        >
          <a class="nav-a">
            <div class="nav-icon" />
            <div class="nav-text"><span>时尚</span></div>
          </a>
        </a-menu-item>
        <a-menu-item disabled>
          <a-divider class="divider" />
        </a-menu-item>
        <a-sub-menu key="17" class="hide-scroll-bar" :selectable="false">
          <template #icon>
            <div class="nav-icon" style="margin-left: -2px"></div>
          </template>
          <template #title>
            <div class="nav-text"><span>更多</span></div>
          </template>
          <a-menu-item
            key="17_1"
            :disabled="!userStore.isUserNotAdmin()"
            @click="$router.push({ name: 'postVideo' })"
            >创作者中心</a-menu-item
          >
          <a-menu-item
            key="17_2"
            :disabled="!userStore.isAdmin"
            @click="$router.push({ name: 'dashboard' })"
            >后台管理平台</a-menu-item
          >
        </a-sub-menu>
        <a-menu-item disabled>
          <a-divider class="divider" />
        </a-menu-item>
      </a-menu>
      <!-- Footer Copyright Notice -->
      <footer class="side-bar-footer" title="备案号">
        <a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2022029417号</a>
        <br />
        <a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2022029417号-1</a>
      </footer>
      <!-- / Footer Copyright Notice -->
    </div>
  </div>
</template>
