<!--
 * Copyright (c) 2022 - present TinyVue Authors.
 * Copyright (c) 2022 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 -->
<script lang="tsx">
import { renderless, api } from '@opentiny/vue-renderless/tag/vue'
import { props, setup, h, defineComponent } from '@opentiny/vue-common'
import { iconClose } from '@opentiny/vue-icon'
import type { ITagApi } from '@opentiny/vue-renderless/types/tag.type'

export default defineComponent({
  components: {
    IconClose: iconClose()
  },
  emits: ['click', 'close'],
  props: [...props, 'text', 'closable', 'type', 'hit', 'disabled', 'color', 'size', 'effect', 'value', 'beforeDelete'],
  setup(props, context) {
    return setup({ props, context, renderless, api, h }) as unknown as ITagApi
  },
  render() {
    const { type, size, hit, effect, slots, closable, color, handleClose, handleClick, disabled, state, value } = this

    const classes = [
      'tiny-tag',
      type ? `tiny-tag--${type}` : '',
      size ? `tiny-tag--${size}` : '',
      effect ? `tiny-tag--${effect}` : '',
      hit && 'is-hit',
      disabled ? 'is-disabled' : ''
    ]

    const tagElement = (
      <span class={classes} style={{ backgroundColor: color }} onClick={handleClick}>
        {value ? <span>{value}</span> : slots.default && slots.default()}
        {closable && <icon-close class="tiny-svg-size tiny-tag__close " onClick={handleClose}></icon-close>}
      </span>
    )

    return tagElement
  }
})
</script>
