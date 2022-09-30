<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加角色
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" ref="roleTable" element-loading-text="加载中" border stripe lazy fit highlight-current-row row-key="role_id">
      <el-table-column label="角色名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="初始页面" align="center">
        <template slot-scope="{row}">
          <el-input v-model="row.role_path" class="edit-input" size="small" @keydown.enter.native="updatePath(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button slot="reference" size="mini" type="primary" @click="goMenu(row)">
            对应菜单
          </el-button>
          <el-button slot="reference" size="mini" type="danger" @click="goDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="fetchData" />

    <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="roleInfo" label-position="left" label-width="7rem" style="width: 80%; margin-left:3rem;">
        <el-form-item label="角色名" prop="role_name">
          <el-input v-model="roleInfo.role_name" />
        </el-form-item>
        <el-form-item label="初始页面" prop="role_path">
          <el-input v-model="roleInfo.role_path" />
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

    <el-dialog title="角色菜单" :visible.sync="dialogMenuVisible">
      <el-table v-loading="menuListLoading" :data="menuList" ref="menuTable" element-loading-text="加载中" border fit highlight-current-row row-key="menu_id">
        <el-table-column type="selection" width="50" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column label="菜单编号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.menu_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="菜单名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMenuVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateRole()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from '@/api/role'
import menuApi from '@/api/menu'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data () {
    return {
      list: [],
      listLoading: true,
      menuListLoading: true,
      menuList: [],
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20
      },
      dialogFormVisible: false,
      dialogMenuVisible: false,
      rules: {
        role_name: [{ required: true, message: '角色名为必填项目', trigger: 'blur' }],
      },
      roleInfo: {
        role_id: 0,
        role_name: '',
        role_path: ''
      },
      updateRoleId: 0
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
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listLoading = true
      roleApi.getRoleList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.tableSelected = []
        this.listLoading = false
      })
      this.$nextTick(() => {
        this.$refs.roleTable.clearSelection()
      })
    },
    handleFilter () {
      this.listQuery.currentPage = 1
      this.fetchData()
    },
    resetRoleInfo () {
      this.roleInfo = {
        role_id: 0,
        role_name: '',
        role_path: ''
      }
    },
    handleCreate () {
      this.resetRoleInfo()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          roleApi.createRole(this.roleInfo).then(() => {
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
      this.$confirm(`您是否要删除 ${row.role_name} 的角色?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roleApi.deleteRole(row).then(() => {
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
    goMenu (row) {
      this.dialogMenuVisible = true
      this.menuListLoading = true
      this.updateRoleId = row.role_id
      menuApi.getMenuByRole({ 'role_id': row.role_id }).then(response => {
        this.menuList = response.data
        this.menuListLoading = false
        if (this.menuList.length > 0) {
          this.$nextTick(() => {
            this.menuList.forEach((v, i) => {
              this.$refs.menuTable.toggleRowSelection(this.menuList[i], v.hasChildren);
            })
          })
        }
      })
    },
    getRowsKey (row) {
      return row.role_id;
    },
    updateRole () {
      const data = { 'role_id': this.updateRoleId, 'menu_list': this.$refs.menuTable.selection }
      menuApi.updateRole(data).then(() => {
        this.dialogMenuVisible = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    updatePath (row) {
      this.listLoading = true
      roleApi.updatePath(row).then(() => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
      this.listLoading = false
    },
  }
}
</script>