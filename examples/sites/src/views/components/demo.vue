<template>
  <div :id="demo.demoId" class="ti-b-a ti-br-sm ti-wp100" :class="currDemoId === demo.demoId ? 'b-a-success' : ''">
    <div class="ti-px24 ti-py20">
      <!-- DEMO 的标题 + 说明desc+  示例wcTag -->
      <div class="ti-f-r ti-f-pos-between ti-f-box-end ti-pb20">
        <div class="ti-f18 ti-cur-hand">{{ demo.name[langKey] }}</div>
        <div>
          <tiny-tooltip placement="top" :append-to-body="false" :content="copyTip">
            <i
              :class="copyIcon"
              class="h:c-success ti-w16 ti-h16 ti-cur-hand"
              @click="copyCode(demo)"
              @mouseout="resetTip()"
            />
          </tiny-tooltip>
          <tiny-tooltip
            placement="top"
            :append-to-body="false"
            :content="demo.isOpen ? i18nByKey('hideCode') : i18nByKey('showCode')"
          >
            <i
              :class="!!demo.isOpen ? 'i-ti-codeslash' : 'i-ti-code'"
              class="ti-ml8 h:c-success ti-w16 ti-h16 ti-cur-hand"
              @click="toggleDemoCode(demo)"
            />
          </tiny-tooltip>
          <tiny-tooltip placement="top" :append-to-body="false" :content="i18nByKey('playground')">
            <i class="i-ti-playground ml8 h:c-success ti-w16 ti-h16 ti-cur-hand" @click="openPlayground(demo)" />
          </tiny-tooltip>
        </div>
      </div>
      <component :is="getDescMd(demo)" class="ti-mb16 ti-f14" />

      <div v-if="isMobileFirst" class="pc-demo-container">
        <tiny-button @click="openPlayground(demo, false)">多端预览</tiny-button>
      </div>
      <div v-else-if="demoConfig.isMobile" class="phone-container">
        <div class="mobile-view-container">
          <component :is="cmp" />
        </div>
      </div>
      <div v-else class="pc-demo-container">
        <div class="pc-demo">
          <component :is="cmp" />
        </div>
      </div>
    </div>
    <!-- demo 打开后的示例代码  细滚动时，width:fit-content; -->
    <div v-if="demo.isOpen" class="ti-px24 ti-py20 ti-b-t-lightless">
      <div>
        <tiny-tabs v-model="tabValue" class="code-tabs">
          <tiny-tab-item
            v-for="(file, idx) in demo.files"
            :key="file.fileName"
            :name="'tab' + idx"
            :title="file.fileName"
          >
            <async-highlight :code="file.code"></async-highlight>
          </tiny-tab-item>
        </tiny-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="jsx">
import { defineComponent, reactive, computed, toRefs, shallowRef, onMounted, watch, nextTick, inject } from 'vue'
import { i18nByKey, getWord } from '@/i18n'
import { $split, appData, fetchDemosFile } from '@/tools'
import { Tooltip as TinyTooltip, Tabs as TinyTabs, TabItem as TinyTabItem, Button as TinyButton } from '@opentiny/vue'
import { languageMap, vueComponents, getWebdocPath, staticDemoPath } from './cmpConfig'
import { router } from '@/router.js'
import demoConfig from '@demos/config.js'
import { useApiMode, useTemplateMode } from '@/tools'
import useTheme from '@/tools/useTheme'
import AsyncHighlight from './async-highlight.vue'

const { apiModeState, apiModeFn } = useApiMode()

export default defineComponent({
  name: 'Demo',
  props: ['demo'],
  components: {
    TinyTooltip,
    TinyTabs,
    TinyTabItem,
    TinyButton,
    AsyncHighlight
  },
  setup(props) {
    const { templateModeState } = useTemplateMode()
    const { currThemeLabel } = useTheme()
    const isMobileFirst = computed(() => {
      return templateModeState.mode === 'mobile-first'
    })

    const getDemoCodeFn = async (demo, forceUpdate) => {
      // 获取code代码文本
      if (!demo.files || forceUpdate) {
        const cmpId = router.currentRoute.value.params.cmpId
        const promises = demo.codeFiles.map(async (fileName) => {
          // 切换option-api和composition-api
          const demoName = apiModeFn.getDemoName(`${getWebdocPath(cmpId)}/${fileName}`)
          let code = ''

          const path = isMobileFirst.value ? `@demos/mobile-first/app/${demoName}` : `${staticDemoPath}/${demoName}`
          code = await fetchDemosFile(path)
            .then((code) => {
              return code
            })
            .catch(() => {
              return `${demoName}示例资源不存在，请检查文件名是否正确？`
            })
          const ext = $split(fileName, '.', -1)
          const language = languageMap[ext] || ''
          return { code, fileName, language }
        })
        demo.files = await Promise.all(promises)
        return demo.files
      }
      return demo.files
    }
    const state = reactive({
      tabValue: 'tab0',
      cmpId: router.currentRoute.value.params.cmpId,
      langKey: getWord('zh-CN', 'en-US'),
      currDemoId: computed(() => {
        let hash = router.currentRoute.value.hash?.slice(1)

        // 兼容/#hashName这种模式
        if (hash.includes('/')) {
          hash = hash.slice(1)
        }
        return hash
      }),
      copyTip: i18nByKey('copyCode'),
      copyIcon: 'i-ti-copy'
    })

    const cmp = shallowRef(null)

    const showPreview = inject('showPreview')

    const fn = {
      getDescMd(demo) {
        // desc字段是一段html
        const desc = demo.desc[state.langKey].trim()
        return <div class="demo-desc" v-html={desc}></div>
      },
      async toggleDemoCode(demo) {
        // 第一次打开时，要请求一下相应的codeFiles .存储到files属性下
        if (!demo.files) {
          await this.getDemoCode(demo)
          demo.isOpen = true
        } else {
          demo.isOpen = !demo.isOpen
        }

        await nextTick()
        window.dispatchEvent(new Event('resize'))
      },
      async copyCode(demo) {
        if (demo.isOpen) {
          const idx = parseInt(state.tabValue.slice(3))

          navigator.clipboard.writeText(demo.files[idx].code)
        } else {
          await this.getDemoCode(demo)

          navigator.clipboard.writeText(demo.files[0].code)
        }
        state.copyTip = i18nByKey('copyCodeOk')
        state.copyIcon = 'i-ti-check'
      },
      resetTip() {
        setTimeout(() => {
          state.copyTip = i18nByKey('copyCode')
          state.copyIcon = 'i-ti-copy'
        }, 300)
      },
      getDemoCode(demo) {
        // 获取code代码文本
        return getDemoCodeFn(demo)
      },
      openPlayground(demo, open = true) {
        const cmpId = router.currentRoute.value.params.cmpId
        const tinyTheme = currThemeLabel.value.split('-')[1]
        const url = `${import.meta.env.VITE_PLAYGROUND_URL}?cmpId=${cmpId}&fileName=${demo.codeFiles[0]}&apiMode=${
          apiModeState.apiMode
        }&mode=${templateModeState.mode}&theme=${tinyTheme}`

        if (open) {
          window.open(url)
        } else {
          showPreview(url)
        }
      }
    }

    onMounted(async () => {
      const demoName = apiModeFn.getDemoName(`${getWebdocPath(state.cmpId)}/${props.demo.codeFiles[0]}`)

      if (vueComponents[demoName]) {
        cmp.value = (await vueComponents[demoName]()).default
      } else {
        const log = `${demoName}示例资源不存在，请检查文件名是否正确？`
        cmp.value = <div>{log}</div>
      }
    })

    watch(
      () => apiModeState.apiMode,
      () => {
        if (props.demo.files?.length > 0) {
          // 强制刷新示例显示格式
          getDemoCodeFn(props.demo, true)
        }
      }
    )

    return { ...toRefs(state), ...fn, appData, vueComponents, demoConfig, cmp, isMobileFirst, i18nByKey }
  }
})
</script>

<style lang="less">
.demo-desc {
  font-size: 16px;
  line-height: 1.7em;
  margin: 12px 0;

  code {
    color: #476582;
    padding: 4px 8px;
    margin: 0 4px;
    font-size: 0.85em;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
  }

  a {
    text-decoration: none;
    color: #5e7ce0;
    cursor: pointer;
  }

  ul,
  ol {
    list-style: disc;
    list-style-position: inside;
  }
}

.theme-dark {
  .demo-desc {
    code {
      background: #333333;
    }
  }
}

.b-a-success {
  animation: border-trans 3s;
}

@keyframes border-trans {
  0% {
    border: 1px solid #5073e5;
    background: none;
  }

  50% {
    background: rgba(255, 95, 85, 0.1);
    border: 1px solid rgba(255, 95, 88, 0.6);
  }

  100% {
    border: 1px solid #5073e5;
    background: none;
  }
}

.pc-demo-container {
  display: flex;
  flex-direction: column;
  .pc-demo {
    flex: 1;
  }
}
.phone-container {
  margin: auto;
  width: 395px;
  height: 773px;
  padding: 20px;
  border: 0;
  position: relative;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYsAAAMFCAYAAACFxdoKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg3MTZDNTAwMTI1MzExRUE5Mzk1OTFBNjdDQ0JBNUQ5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg3MTZDNTAxMTI1MzExRUE5Mzk1OTFBNjdDQ0JBNUQ5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODcxNkM0RkUxMjUzMTFFQTkzOTU5MUE2N0NDQkE1RDkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODcxNkM0RkYxMjUzMTFFQTkzOTU5MUE2N0NDQkE1RDkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7YMDcrAAAcl0lEQVR42uzd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)
    no-repeat center top;
  background-size: contain;

  .mobile-view-container {
    width: 360px;
    height: 613px;
    position: absolute;
    left: 11px;
    top: 79px;
    transform: i18nByKeyX(0);
    overflow: hidden;
  }
}

.code-tabs {
  .tiny-tabs__content {
    padding: 0;
  }
}

.code-preview-box {
  overflow: auto;
  padding: 20px 5px;
  background-color: #f5f6f8;
}
</style>
