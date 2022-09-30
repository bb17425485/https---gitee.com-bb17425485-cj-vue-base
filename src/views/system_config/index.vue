<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增系统参数
      </el-button>
      <el-button class="filter-item" type="danger" style="margin-left:10px" icon="el-icon-unlock" @click="clearCache">
        清除缓存
      </el-button>
      <el-button class="filter-item" type="danger" style="margin-left:10px" icon="el-icon-error" @click="errorLog">
        错误日志
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" ref="systemConfigTable" element-loading-text="加载中" border stripe lazy fit highlight-current-row row-key="system_type">
      <el-table-column label="参数类型" align="center">
        <template slot-scope="{row}">
          <el-tag type="primary">{{ row.system_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="type" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.system_type }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="30px" label="数值1">
        <template slot-scope="{row}">
          <el-input v-model="row.int_arg_1" class="edit-input" size="small" @keydown.enter.native="updateParam(1,row)" />
        </template>
      </el-table-column>
      <el-table-column min-width="30px" label="数值2">
        <template slot-scope="{row}">
          <el-input v-model="row.int_arg_2" class="edit-input" size="small" @keydown.enter.native="updateParam(2,row)" />
        </template>
      </el-table-column>
      <el-table-column min-width="80px" label="字符值1">
        <template slot-scope="{row}">
          <el-input v-model="row.str_arg_1" class="edit-input" size="small" @keydown.enter.native="updateParam(11,row)" />
        </template>
      </el-table-column>
      <el-table-column min-width="80px" label="字符值2">
        <template slot-scope="{row}">
          <el-input v-model="row.str_arg_2" class="edit-input" size="small" @keydown.enter.native="updateParam(12,row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
        <template slot-scope="{row,$index}">
          <el-button slot="reference" size="mini" type="danger" @click="goDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增系统参数" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="systemConfigInfo" label-width="100px">
        <el-row>
          <el-col span="12">
            <el-form-item label="配置编号" prop="system_type">
              <el-input v-model="systemConfigInfo.system_type" />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item label="配置名称" prop="system_name">
              <el-input v-model="systemConfigInfo.system_name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item label="数值1" prop="int_arg_1">
              <el-input v-model="systemConfigInfo.int_arg_1" />
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="数值2" prop="int_arg_2">
              <el-input v-model="systemConfigInfo.int_arg_2" />
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="数值3" prop="int_arg_3">
              <el-input v-model="systemConfigInfo.int_arg_3" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="字符值1" prop="str_arg_1">
          <el-input v-model="systemConfigInfo.str_arg_1" />
        </el-form-item>
        <el-form-item label="字符值2" prop="str_arg_2">
          <el-input v-model="systemConfigInfo.str_arg_2" />
        </el-form-item>
        <el-form-item label="字符值3" prop="str_arg_3">
          <el-input v-model="systemConfigInfo.str_arg_3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData('dataForm')">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="错误日志" :visible.sync="dialogLogVisible" width="85%">
      <el-table v-loading="logListLoading" :data="logList" :height="tableHeight" element-loading-text="加载中" border stripe lazy fit highlight-current-row>
        <el-table-column label="序列" align="center" width="60">
          <template slot-scope="{$index}">
            <span>{{ $index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日志内容">
          <template slot-scope="{row}">
            <span :v-html="row" style="white-space:pre-line;text-align:left">{{ row }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLogVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import systemConfigApi from '@/api/system_config'
import Pagination from '@/components/Pagination'

export default {
  name: 'SystemConfig',
  components: { Pagination },
  data () {
    return {
      list: [],
      logList: [],
      listLoading: true,
      logListLoading: true,
      dialogFormVisible: false,
      dialogLogVisible: false,
      rules: {
        system_type: [{ required: true, message: '配置编号为必填项目', trigger: 'blur' }],
        system_name: [{ required: true, message: '配置名称为必填项目', trigger: 'blur' }],
      },
      systemConfigInfo: {
        system_type: '',
        system_name: '',
        int_arg_1: 0,
        int_arg_2: 0,
        int_arg_3: 0,
        str_arg_1: '',
        str_arg_2: '',
        str_arg_3: '',
      },
      tableHeight: 0
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    getTableHeight () {
      let tableH = 460; //距离页面下方的高度
      let tableHeightDetil = window.innerHeight - tableH;
      if (tableHeightDetil <= 300) {
        this.tableHeight = 300;
      } else {
        this.tableHeight = window.innerHeight - tableH;
      }
    },
    fetchData () {
      this.listLoading = true
      systemConfigApi.getSystemConfigList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    resetSystemConfigInfo () {
      this.systemConfigInfo = {
        system_type: '',
        system_name: '',
        int_arg_1: 0,
        int_arg_2: 0,
        int_arg_3: 0,
        str_arg_1: '',
        str_arg_2: '',
        str_arg_3: '',
      }
    },
    handleCreate () {
      this.resetSystemConfigInfo()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          systemConfigApi.create(this.systemConfigInfo).then(() => {
            this.dialogFormVisible = false
            this.fetchData()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    goDelete (row, index) {
      this.$confirm(`您是否要删除 ${row.system_type} 的参数?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        systemConfigApi.delete(row).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      }).catch(() => {
      });
    },
    updateParam (type, row) {
      this.listLoading = true
      row.type = type
      systemConfigApi.updateParam(row).then(() => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
      this.listLoading = false
    },
    clearCache () {
      systemConfigApi.clearCache().then(() => {
        this.$notify({
          title: '成功',
          message: '清除缓存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    errorLog () {
      this.dialogLogVisible = true
      this.logListLoading = true
      systemConfigApi.getErrorLog().then(response => {
        this.logList = response.data
        this.logListLoading = false
        this.getTableHeight()
      })
    },
  }
}
</script>