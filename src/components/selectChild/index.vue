<!--
下拉框公共组件:普通下拉列表，级联下拉列表，学年下拉列表，学期下拉列表
-->
<template lang="html">
  <el-cascader
    v-if="tp === 'cascader'"
    :options="generalRecord"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :value="value"
    v-bind="$props"
    separator="、"
    @input="change($event)"
    @change="onchange($event)"/>
  <el-select
    v-else
    :value="filterValue "
    v-bind="$props"
    :filterable="isfilterable"
    :clearable="clearable"
    :multiple="tp ==='multipleSelect'? true: false"
    :collapse-tags="tp ==='multipleSelect'? true: false"
    :readonly="readonly"
    :disabled="disabled"
    @input="change($event)"
    @change="onchange($event)">
    <el-option
      v-for="item in generalRecord"
      :key="item.value"
      :label="item.label"
      :value="item.value"/>
  </el-select>
</template>

<script>
import { tearmSelect, yearSelect, gradeSelect } from './data.js'
export default {
  props: {
    value: {
      type: [String, Number, Array],
      default: undefined
    },
    placeholder: {
      type: [String, Number],
      default: '请选择'
    },
    tp: {
      type: String,
      default: 'select'
    },
    isfilterable: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    generalRecord: {
      type: Array,
      default: function() {
        const tp = this.tp
        let result = []
        switch (tp) {
          case 'gradeSelect':
            result = gradeSelect()
            break
          case 'yearSelect':
            result = yearSelect()
            break
          case 'termSelect':
            result = tearmSelect
            break
        }
        return result
      }
    }
  },
  computed: {
    filterValue: function() {
      let val = this.value
      if (this.tp === 'yearSelect') {
        this.value && (val = parseInt(this.value))
      }
      return val
    }
  },
  methods: {
    change(val) {
      this.$emit('input', val)
    },
    onchange(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>

