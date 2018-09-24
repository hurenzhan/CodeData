<template>
  <div class="attachCot">
    <div class="com-block" style="min-height: 40px">
      <Upload
        ref="upload"
        :show-upload-list="showUploadList"
        :default-file-list='defaultAttachList'
        :with-credentials="withCredentials"
        :on-success="handleSuccess"
        :format="format"
        :max-size="10240"
        :on-preview='viewAttach'
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :on-error="handleError"
        :on-remove="remove"
        :action="action"
        :before-upload="handleBeforeUpload"
        :headers="uploadHeaders">
        <Button class="upload" type="ghost" icon="ios-cloud-upload-outline" v-show="show">上传文件</Button>
      </Upload>
    </div>
  </div>
</template>
<script>
import config from '@/config'
import flowAPi from '../../api/flow'

export default {
  props: {
    defaultAttachList: {
      default() {
        return []
      }
    },
    upLoadType: {
      default: 'doc'
    },
    url: {
      default: `${config.uploadHost}${window.prefix}/attachment/postAttachmentInfo`
    },
    format: {
      default() {
        return ['xlsx', 'doc', 'docx', 'xls', 'pdf', 'ppt', 'pptx']
      }
    },
    show: {
      default: true
    }
  },
  data() {
    return {
      uploadList: [],
      upLoadImageList: [],
      isShow: true,
      withCredentials: false,
      uploadHeaders: {
        token: ''
      },
      showUploadList: true,
      imageUrl: '',
      action: ''
    }
  },
  watch: {
    defaultFileList(val) {
      this.defaultList = val
    }
  },
  methods: {
    handleSuccess(res) {
      const type = this.upLoadType
      if (res && res.statusCode === '0') {
        this.$Message.success('上传成功')
        if (type === 'doc') {
          this.showUploadList = true
          res.data.forEach((elem) => {
            this.uploadList.push(elem)
          })
        } else {
          res.data.forEach((elem) => {
            this.upLoadImageList.push(elem)
          })
          this.imageUrl = res.data[0].url
          this.showUploadList = false
        }
      } else {
        this.$Message.error(res.msg, 5)
      }
    },
    handleFormatError(file) {
      const type = this.upLoadType
      const fileName = file.name
      let desc
      if (type === 'doc') {
        desc = `文件${fileName}格式不正确,请上传 xlsx、doc、docx、xls、pdf、ppt'、pptx 的文件格式`
      } else {
        desc = `文件${fileName}格式不正确,请上传jpg、jpeg、gi、png、bmp 的图片格式`
      }
      this.$Notice.warning({
        title: '文件格式不正确',
        desc
      })
    },
    handleMaxSize(file) {
      const fileName = file.name
      const desc = `文件${fileName}太大，不能超过 10M`
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc
      })
    },
    // handleBeforeUpload(file) {
    // },
    handleError(error) {
      this.$Message.error(error)
    },
    deletePageAttach(fileUrl) {
      if (this.upLoadType === 'doc') {
        this.uploadList.forEach((elem, index) => {
          if (elem.url === fileUrl) {
            this.uploadList.splice(index, 1)
          }
        })
      } else {
        this.upLoadImageList.forEach((elem, index) => {
          if (elem.url === fileUrl) {
            this.upLoadImageList.splice(index, 1)
          }
        })
      }
    },
    async remove(file) {
      const applyStatus = this.$route.query.applyStatus
      const type = this.$route.query.type
      let fileUrl
      if (file.url) {
        fileUrl = file.url
      } else {
        fileUrl = file.response.data[0].url
      }
      const params = { url: fileUrl }
      if (type === 'create') {
        const response = await flowAPi.deleteAttachmentByUrl(params)
        if (response && response.statusCode === '0') {
          this.$Message.success('删除成功')
          this.deletePageAttach(fileUrl)
        } else {
          this.$Message.error(response.msg)
        }
      } else if (applyStatus === '99' || applyStatus === '100') {
        this.deletePageAttach(fileUrl)
        const length = this.defaultAttachList.length
        if (length > 0) {
          this.defaultAttachList.splice(0, length)
        }
        this.$emit('deletAttach', params)
      }
    },
    viewAttach(file) {
      let url
      if (!file.response) {
        url = file.url
      } else {
        file.response.data.forEach((elemFile) => {
          url = elemFile.url
          // return
        })
      }
      window.location.href = url
    },
    handleBeforeUpload() {
      let flag = true
      const defultLength = this.defaultAttachList.length
      if (defultLength > 0) {
        flag = false
        this.$Notice.warning({
          title: '一次只能上传一个附件'
        })
      } else {
        const type = this.upLoadType
        let check
        if (type === 'doc') {
          check = this.uploadList.length
        } else {
          check = this.upLoadImageList.length
        }
        if (check >= 1) {
          flag = false
          this.$Notice.warning({
            title: '一次只能上传一个附件'
          })
        }
      }
      return flag
    }
  },
  created() {
  },
  mounted() {
    // 管理端 业务端 token
    if (window.axiosConfig.headers && window.axiosConfig.headers.token) {
      this.uploadHeaders.token = window.axiosConfig.headers && window.axiosConfig.headers.token
      this.action = this.url
    }
    // 开发端 session
    if (window.axiosConfig.withCredentials && window.systemId) {
      this.withCredentials = true
      this.action = `${this.url}?systemId=${window.systemId}`
    }
  }
}
</script>
<style>
.m-img-width1 {
  max-width: 200px;
}
</style>

