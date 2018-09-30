
Component({
  // options properties daata methods

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  properties: {

    title: {
      // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      type: String,
      value: '标题'
    },

    cancelText: {
      type: String,
      value: '取消'
    },

    submitText: {
      type: String,
      value: '提交'
    }
  },

  data: {
    isShow: false,
    inputValue: ''
  },

  methods: {

    show() { if (!this.data.isShow) this.setData({ isShow: true }); },

    hide() { if (this.data.isShow) this.setData({ isShow: false, inputValue: '' }); },

    _inputChangeEvent(e) { this.triggerEvent("onChange", e.detail.value); },

    _cancelEvent() { this.triggerEvent("onCancel"); },
    
    _submitEvent() { this.triggerEvent("onSubmit"); }

  }
})