<template>
  <div>
    <tiny-grid
      :data="tableData"
      ref="basicGrid"
      :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
      :edit-rules="validRules"
    >
      <template #toolbar>
        <tiny-grid-toolbar :buttons="toolbarButtons" @button-click="toolbarButtonClickEvent"></tiny-grid-toolbar>
      </template>
      <tiny-grid-column type="index" width="60"></tiny-grid-column>
      <tiny-grid-column field="name" title="名称" :editor="{ component: 'input' }"></tiny-grid-column>
      <tiny-grid-column field="area" title="区域" :editor="{ component: 'input' }"></tiny-grid-column>
      <tiny-grid-column field="address" title="地址" :editor="{ component: 'input' }"></tiny-grid-column>
      <tiny-grid-column field="introduction" title="公司简介" :editor="{ component: 'input' }"></tiny-grid-column>
    </tiny-grid>
  </div>
</template>

<script>
import { Grid, GridColumn, GridToolbar, Modal as TinyModal } from '@opentiny/vue'

export default {
  components: {
    TinyGrid: Grid,
    TinyGridColumn: GridColumn,
    TinyGridToolbar: GridToolbar
  },
  data() {
    const validRules = {
      name: [
        { required: true, message: '名称必填' },
        { min: 3, max: 50, message: '名称长度在 3 到 50 个字符' }
      ],
      area: {
        type: 'string',
        required: true,
        validator: (rule, value) => ['华东区', '华南区', '华中区'].includes(value),
        message: '区域格式不正确'
      },
      address: {
        type: 'string',
        validator: (rule, value) => {
          return new Promise((resolve, reject) => {
            if (!value) {
              reject(new Error('地址不能为空'))
            } else if (value.length > 10) {
              reject(new Error('地址过长'))
            } else {
              resolve()
            }
          })
        }
      }
    }
    return {
      validRules,
      toolbarButtons: [
        {
          code: 'save',
          name: '提交数据'
        },
        {
          code: 'savePromise',
          name: '保存（Promise）'
        },
        {
          code: 'fullValidate',
          name: '全量数据校验'
        }
      ],
      tableData: [
        {
          id: '1',
          name: 'GFD科技YX公司',
          userId: 421000103624183,
          area: '华东区',
          province: '福建省',
          city: '福州',
          contact: '许生',
          telephone: '1234567890',
          address: '福州',
          ipaddress: '192.168.111.111',
          introduction: '公司技术和研发实力雄厚，是国家863项目的参与者，并被政府认定为“高新技术企业”。',
          employees: 800,
          createdDate: '2014-04-30 00:56:00',
          boole: false,
          assets: '1000000',
          rate: 0.9
        },
        {
          id: '2',
          name: 'WWW科技YX公司',
          userId: 421000103624183,
          area: '华南区',
          province: '广东省',
          city: '深圳',
          contact: '朱生',
          telephone: '1234567890',
          address: '深圳福田区',
          ipaddress: '192.168.111.1',
          introduction: '公司技术和研发实力雄厚，是国家863项目的参与者，并被政府认定为“高新技术企业”。',
          employees: 300,
          createdDate: '2016-07-08 12:36:22',
          boole: true,
          assets: '1500000',
          rate: 0.7
        },
        {
          id: '3',
          name: 'RFV有限责任公司',
          userId: 441047913162396,
          area: '华南区',
          province: '广东省',
          city: '中山',
          contact: '秦生',
          telephone: '1234567890',
          address: '中山市',
          ipaddress: '192.168.111.120',
          introduction: '公司技术和研发实力雄厚，是国家863项目的参与者，并被政府认定为“高新技术企业”。',
          employees: 1300,
          createdDate: '2014-02-14 14:14:14',
          boole: false,
          assets: '1500000',
          rate: 0.6
        },
        {
          id: '4',
          name: 'TGB科技YX公司',
          userId: 702973890055088,
          area: '华东区',
          province: '福建省',
          city: '龙岩',
          contact: '周生',
          telephone: '1234567890',
          address: '龙岩',
          ipaddress: '192.168.11.111',
          introduction: '公司技术和研发实力雄厚，是国家863项目的参与者，并被政府认定为“高新技术企业”。',
          employees: 360,
          createdDate: '2013-01-13 13:13:13',
          boole: true,
          assets: '1200000',
          rate: 0.5
        },
        {
          id: '5',
          name: 'YHN科技YX公司',
          userId: 702973890055088,
          area: '华南区',
          province: '广东省',
          city: '韶关',
          contact: '郑生',
          telephone: '1234567890',
          address: '韶关',
          ipaddress: '192.168.101.111',
          introduction: '公司技术和研发实力雄厚，是国家863项目的参与者，并被政府认定为“高新技术企业”。',
          employees: 810,
          createdDate: '2012-12-12 12:12:12',
          boole: true,
          assets: '1500000',
          rate: 0.6
        }
      ]
    }
  },
  methods: {
    toolbarButtonClickEvent({ code }) {
      switch (code) {
        case 'save': {
          this.$refs.basicGrid.validate((valid) => {
            if (valid) {
              TinyModal.alert('校验成功！')
            } else {
              TinyModal.alert('校验不通过')
            }
          })
          break
        }
        case 'savePromise': {
          this.$refs.basicGrid
            .validate()
            .then(() => {
              TinyModal.alert('校验成功，触发了then！')
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.log(error)
              TinyModal.alert('校验不通过，触发了catch')
            })
          break
        }
        case 'fullValidate': {
          this.$refs.basicGrid
            .fullValidate()
            .then(() => {
              TinyModal.alert('校验成功，触发了then！')
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.log(error)
              TinyModal.alert('校验不通过，触发了catch')
            })
          break
        }
      }
    }
  }
}
</script>
