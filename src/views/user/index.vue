<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.process" placeholder="VIP状态" class="filter-item" @change="fetchData">
        <el-option v-for="item in processOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item ml-10" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加用户
      </el-button>
      <el-button class="filter-item ml-10" type="primary" icon="el-icon-edit" @click="goback">
        后退
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" ref="userTable" element-loading-text="加载中" border stripe lazy fit highlight-current-row row-key="id">
      <el-table-column label="用户昵称">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VIP" align="center" width="80">
        <template slot-scope="{row}">
          <el-tag v-if="row.is_vip == 1" type="success">
            是|{{ row.sign_count }}
          </el-tag>
          <el-tag v-else type="">
            否
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center">
        <template slot-scope="{row}">
          <el-tag type="danger">
            {{ row.cur_source }}/{{ row.total_source }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter(0)">
            {{ row.status | statusFilter(1) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.register_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.last_login_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button slot="reference" size="mini" type="primary" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button slot="reference" size="mini" type="danger" @click="sourceDetail(row)">
            积分明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="fetchData" />

    <el-dialog :title="dialogStatus=='create'?'添加用户':'编辑用户'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="userInfo" label-position="left" label-width="7rem" style="width: 80%; margin-left:3rem;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" placeholder="请输入用户名" :readonly="dialogStatus=='create'?false:'readonly'" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="userInfo.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userInfo.password" :placeholder="dialogStatus=='create'?'请输入密码':'不填则表示不修改密码'" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="userInfo.status" active-color="#13ce66" inactive-color="#ff4949" active-text="正常" inactive-text="停用" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="userInfo.role_id" filterable placeholder="请选择角色">
            <el-option v-for="item in role_list" :key="item.role_id" :label="item.role_name" :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note" placeholder="请输入备注">
          <el-input v-model="userInfo.note" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus=='create'?createData('dataForm'):updateData('dataForm')">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="积分明细" :visible.sync="dialogSourceVisible" width="90%">
      <el-form ref="sourceForm" :model="sourceInfo" :rules="sourceRules" label-position="left" label-width="6rem">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称">
              <el-input v-model="sourceInfo.nickname" readonly style="width:90%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="当前积分">
              <el-input v-model="sourceInfo.cur_source" readonly style="width:90%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总积分">
              <el-input v-model="sourceInfo.total_source" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="积分变动" prop="changes">
              <el-input v-model="sourceInfo.changes" placeholder="请输入积分变动值" style="width:90%" />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="变动说明" prop="note">
              <el-input v-model="sourceInfo.note" placeholder="请输入积分变动说明" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table v-loading="sourceListLoading" :data="sourceList" :height="tableHeight" ref="sourceTable" element-loading-text="加载中" border stripe fit highlight-current-row row-key="id">
        <el-table-column label="操作时间" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.opt_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前积分" align="center" width="120">
          <template slot-scope="{row}">
            <el-tag type="warning">
              {{ row.source }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="积分变化" align="center" width="120">
          <template slot-scope="{row}">
            <el-tag v-if="row.changes>=0" type="success">
              +{{ row.changes }}
            </el-tag>
            <el-tag v-else type="danger">
              {{ row.changes }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="变动说明" align="center">
          <template slot-scope="{row}">
            <span>{{ row.note }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.trade_no }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSourceVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="updateSource('sourceForm')">
          修改积分
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from '@/api/user'
import roleApi from '@/api/role'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data () {
    return {
      processOptions: [{ value: -1, label: 'VIP状态' }, { value: 0, label: '非VIP' }, { value: 1, label: 'VIP' }],
      list: [],
      listLoading: true,
      sourceList: [],
      sourceListLoading: true,
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        process: -1
      },
      dialogFormVisible: false,
      dialogSourceVisible: false,
      dialogStatus: 'create',
      rules: {
        username: [{ required: true, message: '用户名为必填项', trigger: 'blur' }],
        nickname: [{ required: true, message: '昵称为必填项', trigger: 'blur' }],
      },
      sourceRules: {
        changes: [{ required: true, message: '积分变化为必填项', trigger: 'blur' }],
        note: [{ required: true, message: '变动说明为必填项', trigger: 'blur' }],
      },
      role_list: [],
      userInfo: {
        id: 0,
        username: '',
        nickname: '',
        password: '',
        status: 1,
        role_id: 1,
        role_name: '',
        note: ''
      },
      sourceInfo: {
        id: 0,
        nickname: '',
        cur_source: 0,
        total_source: 0,
        changes: '',
        note: ''
      },
      tableHeight: ''
    }
  },
  computed: {
    ...mapGetters([
      'info'
    ])
  },
  filters: {
    statusFilter (status, type) {
      const statusMap = {
        0: ['danger', '停用'],
        1: ['success', '正常']
      }
      return statusMap[status][type]
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    getTableHeight () {
      let tableH = 480; //距离页面下方的高度
      let tableHeightDetil = window.innerHeight - tableH;
      if (tableHeightDetil <= 300) {
        this.tableHeight = 300;
      } else {
        this.tableHeight = window.innerHeight - tableH;
      }
    },
    fetchData () {
      this.listLoading = true
      userApi.getUserList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    getAllRoleList () {
      roleApi.getAllRoleList().then(response => {
        this.role_list = response.data
      })
    },
    handleFilter () {
      this.listQuery.currentPage = 1
      this.fetchData()
    },
    resetUserInfo () {
      this.userInfo = {
        id: 0,
        username: '',
        nickname: '',
        password: '',
        status: 1,
        role_id: 1,
        role_name: '',
        note: ''
      }
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.resetUserInfo()
      this.getAllRoleList()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi.createUser(this.userInfo).then(() => {
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
    goDelete (row) {
      this.$confirm(`您是否要删除用户 ${row.nickname} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.deleteUser(row).then(() => {
          this.fetchData()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
      });
    },
    sourceDetail (row) {
      this.sourceInfo = Object.assign({}, row)
      this.$set(this.sourceInfo, "user_id", row.id)
      this.$set(this.sourceInfo, "note", '')
      this.$set(this.sourceInfo, "changes", '')
      this.dialogSourceVisible = true
      userApi.findSourceByUser({ user_id: row.id }).then(response => {
        this.sourceList = response.data
        this.sourceListLoading = false
      })
      this.getTableHeight()
    },
    updateSource (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi.updateSourceByUser(this.sourceInfo).then(() => {
            this.$set(this.sourceInfo, "note", '')
            this.$set(this.sourceInfo, "changes", '')
            this.dialogSourceVisible = true
            userApi.findSourceByUser({ user_id: this.sourceInfo.user_id }).then(response => {
              this.sourceList = response.data
              this.sourceListLoading = false
            })
            this.$notify({
              title: '成功',
              message: '积分变动成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate (row) {
      this.dialogStatus = 'update'
      this.getAllRoleList()
      this.userInfo = Object.assign({}, row)
      this.userInfo.password = ''
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi.updateUser(this.userInfo).then(() => {
            this.dialogFormVisible = false
            const role = this.role_list.find(v => v.role_id === this.userInfo.role_id)
            this.userInfo.role_name = role.role_name
            const index = this.list.findIndex(v => v.id === this.userInfo.id)
            this.list.splice(index, 1, this.userInfo)
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    goback () {
      console.log(this.$router)
    }
  }
}
</script>