<template>
  <div class="wrap">
    <div class="demo-top mb10">
      <tiny-switch v-model="isAffix"></tiny-switch>
      <span>{{ isAffix ? '关闭固定模式' : '打开固定模式' }}</span>
    </div>
    <tiny-anchor :links="links" :is-affix="isAffix"></tiny-anchor>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Anchor as TinyAnchor, Switch as TinySwitch } from '@opentiny/vue'

const isAffix = ref(false)
const links = ref([
  {
    key: 'demonstrate',
    link: '#demonstrate',
    title: '演示',
    children: [
      {
        key: 'basic-usage',
        link: '#basic-usage',
        title: 'Basic Usage'
      },
      {
        key: 'is-affix',
        link: '#is-affix',
        title: 'Is Affix'
      },
      {
        key: 'set-container',
        link: '#set-container',
        title: 'Set Container'
      },
      {
        key: 'on-change',
        link: '#on-change',
        title: 'On Change'
      }
    ]
  },
  {
    key: 'api',
    link: '#api',
    title: 'Api'
  }
])
</script>

<style scoped>
.wrap {
  min-height: 180px;
}
.demo-top {
  display: flex;
  align-items: center;
}
</style>
