<template>
  <div>
    <tiny-button @click="handleClick(!showNum)" style="max-width: unset"
      >设置 show-number 值为{{ !showNum }}</tiny-button
    >
    <tiny-milestone
      :data="milestoneData"
      :milestones-status="statusMap"
      :show-number="showNum"
      :start="1"
    ></tiny-milestone>
  </div>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import { Milestone as TinyMilestone, Button as TinyButton } from '@opentiny/vue'

const showNum = ref(true)
const statusMap = ref({
  completed: 'var(--ti-common-color-line-active)',
  doing: '#7ED321',
  back: '#f5222d',
  end: '#faad14',
  cancel: '#d9d9d9'
})
const milestoneData = ref([
  {
    name: 'completed 完成状态',
    time: '2018-9-7',
    status: 'completed'
  },
  {
    name: 'completed 完成状态',
    time: '2018-9-8',
    status: 'completed'
  },
  {
    name: 'doing 未完成状态',
    time: '2018-9-10',
    status: 'doing'
  },
  {
    name: 'cancel 未完成状态',
    time: '2018-9-9',
    status: 'cancel'
  },
  {
    name: 'back 未完成状态',
    time: '2018-9-11',
    status: 'back'
  },
  {
    name: 'end 未完成状态',
    time: '2018-9-9',
    status: 'end'
  }
])

function handleClick(value) {
  showNum.value = value
}
</script>
