<template>
  <div>
    <div class="demo-top mb10">
      <tiny-switch v-model="type" true-value="line" false-value="dot"> </tiny-switch>
      <span>当前类型：{{ type }}</span>
    </div>
    <tiny-anchor :links="links" :type="type"></tiny-anchor>
  </div>
</template>

<script>
import { Anchor, Switch } from '@opentiny/vue'

export default {
  components: {
    TinyAnchor: Anchor,
    TinySwitch: Switch
  },
  data() {
    return {
      links: [
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
      ],
      type: 'dot'
    }
  }
}
</script>

<style scoped>
.demo-top {
  display: flex;
  align-items: center;
}
</style>
