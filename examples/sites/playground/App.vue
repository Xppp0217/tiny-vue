<script setup>
import { onMounted, reactive, nextTick } from 'vue'
import { Repl, useStore, File } from '@opentiny/vue-repl'
import '@opentiny/vue-repl/dist/style.css'

import Editor from '@vue/repl/codemirror-editor'
import {
  ButtonGroup as TinyButtonGroup,
  Select as TinySelect,
  Option as TinyOption,
  Switch as TinySwitch,
  Notify
} from '@opentiny/vue'
import { staticDemoPath, getWebdocPath } from '@/views/components/cmpConfig'
import { fetchDemosFile } from '@/tools/utils'
import logoUrl from './assets/opentiny-logo.svg?url'
import GitHub from './icons/Github.vue'
import Share from './icons/Share.vue'

const VERSION = 'tiny-vue-version-3.12'
const LAYOUT = 'playground-layout'
const LAYOUT_REVERSE = 'playground-layout-reverse'

const versions = ['3.12', '3.11', '3.10', '3.9', '3.8']
const latestVersion = localStorage.getItem(VERSION) || versions[0]
const cdnHost = localStorage.getItem('setting-cdn')
const getRuntime = (version) => `${cdnHost}/@opentiny/vue@${version}/runtime/`

const searchObj = new URLSearchParams(location.search)
const tinyMode = searchObj.get('mode')
const tinyTheme = tinyMode === 'saas' ? 'aurora' : searchObj.get('theme')
const isMobileFirst = tinyMode === 'mobile-first'

const createImportMap = (version) => {
  const imports = {
    '@opentiny/vue': `${getRuntime(version)}tiny-vue.mjs`,
    '@opentiny/vue-icon': `${getRuntime(version)}tiny-vue-icon.mjs`,
    '@opentiny/vue-locale': `${getRuntime(version)}tiny-vue-locale.mjs`,
    '@opentiny/vue-common': `${getRuntime(version)}tiny-vue-common.mjs`,
    '@opentiny/vue-theme/': `${cdnHost}/@opentiny/vue-theme@${version}/`,
    '@opentiny/vue-renderless/': `${cdnHost}/@opentiny/vue-renderless@${version}/`,
    'sortablejs': `${cdnHost}/sortablejs@1.15.0/modular/sortable.esm.js`
  }
  if (['aurora', 'smb'].includes(tinyTheme)) {
    imports[`@opentiny/vue-design-${tinyTheme}`] = `${cdnHost}/@opentiny/vue-design-${tinyTheme}@${version}/index.js`
  }
  if (isMobileFirst) {
    imports['@opentiny/vue-icon'] = `${getRuntime(version)}tiny-vue-icon-saas.mjs`
  }
  return {
    imports
  }
}

const getTinyTheme = (version) => {
  if (isMobileFirst) {
    return `${getRuntime(version)}tailwind.css`
  }
  let theme = tinyMode === 'saas' ? 'saas' : tinyTheme
  if (!['smb', 'default', 'aurora', 'saas'].includes(theme)) {
    theme = 'default'
  }
  const tinyThemeMap = {
    default: `${cdnHost}/@opentiny/vue-theme@${version}/index.css`,
    smb: `${cdnHost}/@opentiny/vue-theme@${version}/index.css`,
    aurora: `${cdnHost}/@opentiny/vue-theme@${version}/index.css`,
    saas: `${cdnHost}/@opentiny/vue-theme-saas@${version}/index.css`
  }
  return tinyThemeMap[theme]
}

// 如果hash有效，它格式为： 3.8.4|eNqIVV9p.............
const hash = location.hash.slice(1)
const shareData = hash.split('|')

const store = new useStore({
  serializedState: shareData.length === 2 ? shareData[1] : '',
  showOutput: true,
  outputMode: 'preview',
  versions: {
    vue: '3.2.47',
    opentiny: '3.9.1',
    typescript: '5.1.3'
  }
})

// repl 属性
const state = reactive({
  layout: localStorage.getItem(LAYOUT) || 'horizon',
  // 默认为反转，所以需要判断是否为'false'后取反
  layoutReverse: !(localStorage.getItem(LAYOUT_REVERSE) === 'false'),
  layoutOptions: [
    { value: 'horizon', text: '水平' },
    { value: 'vertical', text: '垂直' }
  ],
  // 版本切换
  versions: versions.map((item) => ({ value: item })),
  selectVersion: shareData.length === 2 ? shareData[0] : latestVersion,
  previewOptions: {}
})

const designThemeMap = {
  aurora: 'tinyAuroraTheme',
  infinity: 'tinyInfinityTheme',
  smb: 'tinySmbTheme'
}

function setTinyDesign() {
  let importCode = ''
  let useCode = ''

  if (isMobileFirst) {
    useCode += 'app.provide("TinyMode", "mobile-first");\n'
  }
  // 目前只有aurora和smb有design包
  if (['aurora', 'smb'].includes(tinyTheme)) {
    importCode += `import designConfig from '@opentiny/vue-design-${tinyTheme}';
      import { design } from '@opentiny/vue-common';\n`
    useCode += 'app.provide(design.configKey, designConfig);\n'
  }

  if (['aurora', 'infinity', 'smb'].includes(tinyTheme)) {
    const designTheme = designThemeMap[tinyTheme]
    importCode += `import TinyThemeTool from '@opentiny/vue-theme/theme-tool';
      import { ${designTheme} } from '@opentiny/vue-theme/theme';\n`
    useCode += `const theme = new TinyThemeTool(${designTheme});\n`
  }

  state.previewOptions.customCode = {
    importCode,
    useCode
  }
}

function selectVersion(version) {
  versionChange(version)
  localStorage.setItem(VERSION, version)
}

function versionChange(version) {
  const importMap = createImportMap(version)
  store.state.files['import-map.json'] = new File('', JSON.stringify(importMap))
  insertStyleDom(version)
}

function insertStyleDom(version) {
  nextTick(() => {
    if (!document.querySelector('iframe')) return

    const iframeWin = document.querySelector('iframe').contentWindow
    const link = iframeWin.document.createElement('link')
    link.id = 'tiny-theme'
    link.rel = 'stylesheet'
    link.href = getTinyTheme(version)
    iframeWin.addEventListener('DOMContentLoaded', () => {
      iframeWin.document.head.append(link)
    })
  })
}

function changeLayout(layout) {
  localStorage.setItem(LAYOUT, layout)
}

function changeReserve(isReserve) {
  insertStyleDom(state.selectVersion)
  localStorage.setItem(LAYOUT_REVERSE, isReserve)
}

function getDemoName(name, apiMode) {
  return name.replace(/\.vue$/, `${apiMode === 'Options' ? '' : '-composition-api'}.vue`)
}

const getDemoCode = async ({ cmpId, fileName, apiMode, mode }) => {
  const demoName = getDemoName(`${getWebdocPath(cmpId)}/${fileName}`, apiMode)
  const path = tinyMode === 'mobile-first' ? `@demos/mobile-first/app/${demoName}` : `${staticDemoPath}/${demoName}`
  const code = await fetchDemosFile(path)
    .then((code) => {
      return code
    })
    .catch(() => {
      return `${demoName}示例资源不存在，请检查文件名是否正确？`
    })

  return code
}

const loadFileCode = async ({ cmpId, fileName, apiMode, mode }) => {
  const code = await getDemoCode({ cmpId, fileName, apiMode, mode })
  store.state.mainFile = fileName
  store.state.activeFile = fileName
  store.addFile(new File(fileName, code, false))
  versionChange(latestVersion)
}

onMounted(() => {
  setTinyDesign()
  // 初始加载,有分享则加载分享，否则加载默认版本的默认文件
  if (shareData.length === 2) {
    const demoFile = Object.values(store.state.files).find(
      (file) =>
        file.filename.startsWith('src/') &&
        file.filename.endsWith('.vue') &&
        file.filename !== 'src/App.vue' &&
        file.filename !== 'src/PlaygroundMain.vue'
    )

    store.state.mainFile = demoFile.filename
    store.state.activeFile = demoFile
    versionChange(shareData[0])
  } else {
    const fileName = searchObj.get('fileName')
    const cmpId = searchObj.get('cmpId')
    const apiMode = searchObj.get('apiMode')
    const mode = searchObj.get('mode')
    if (fileName && cmpId && apiMode) {
      loadFileCode({ cmpId, fileName, apiMode, mode })
    }
  }
})
// 分享功能
function share() {
  const hash = store.serialize()
  const shareUrl =
    location.origin +
    `${import.meta.env.VITE_PLAYGROUND_URL}?mode=${tinyMode}&theme=${tinyTheme}#` +
    state.selectVersion +
    '|' +
    hash

  navigator.clipboard.writeText(shareUrl)
  Notify({
    type: 'success',
    title: '分享',
    message: '当前URL已被复制到剪贴板.',
    duration: 2000
  })
}
</script>

<template>
  <div class="header">
    <div class="title"><img class="logo" :src="logoUrl" /> <span>OpenTiny Vue 演练场</span></div>
    <div>
      <span class="ml20">
        布局方向:
        <tiny-button-group
          :data="state.layoutOptions"
          v-model="state.layout"
          @change="changeLayout"
        ></tiny-button-group>
      </span>
      <span class="ml20">
        布局反转:
        <tiny-switch v-model="state.layoutReverse" mini @change="changeReserve"></tiny-switch>
      </span>
      <span class="ml20">
        OpenTiny Vue 版本:
        <tiny-select v-model="state.selectVersion" @change="selectVersion" style="width: 150px">
          <tiny-option v-for="item in state.versions" :key="item.value" :label="item.value" :value="item.value">
          </tiny-option>
        </tiny-select>
      </span>
      <Share @click="share" title="分享" class="share" />
      <a style="display: flex" href="https://github.com/opentiny/tiny-vue" target="_blank">
        <GitHub class="github" />
      </a>
    </div>
  </div>
  <Repl
    :editor="Editor"
    :store="store"
    :preview-options="state.previewOptions"
    :clear-console="false"
    :layout="state.layout"
    :layout-reverse="state.layoutReverse"
  ></Repl>
</template>

<style>
* {
  box-sizing: border-box;
}

#header {
  display: none;
}
#app {
  padding-top: 0;
}
.header {
  height: 46px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 6px;
  border-bottom: solid 1px #e1e1e1;
}

.header > div {
  display: flex;
  align-items: center;
}

.logo {
  margin-right: 10px;
}

.title {
  font-size: 20px;
}

.ml20 {
  margin-left: 20px;
}

.vue-repl {
  /* 16px 是body默认margin*/
  height: calc(100vh - 36px - 16px) !important;
}

.github,
.share {
  width: 20px;
  margin-right: 10px;
  cursor: pointer;
}

.share {
  margin-left: 10px;
}
</style>
