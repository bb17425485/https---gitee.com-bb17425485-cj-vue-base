<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加菜单
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" ref="menuTable" element-loading-text="加载中" border lazy fit highlight-current-row row-key="menu_id" @sort-change="sortChange" :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="排序" align="center" width="75" :class-name="getSortClass('sort')" sortable="custom" prop="sort">
        <template slot-scope="{row}">
          {{ row.sort }}
        </template>
      </el-table-column>
      <el-table-column label="Note" align="center">
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" align="center">
        <template slot-scope="{row}">
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Icon" align="center">
        <template slot-scope="{row}">
          {{ row.icon }}
        </template>
      </el-table-column>
      <el-table-column label="Component" align="center">
        <template slot-scope="{row}">
          {{ row.component }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button slot="reference" size="mini" type="danger" @click="goDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="fetchData" />

    <el-dialog :title="dialogStatus=='create'?'创建菜单':'编辑菜单'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="menuInfo" label-position="left" label-width="7rem" style="width: 80%; margin-left:3rem;">
        <el-form-item label="Note" prop="note">
          <el-input v-model="menuInfo.note" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="menuInfo.title" placeholder="菜单标题" />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="menuInfo.name" />
        </el-form-item>
        <el-form-item label="Path" prop="path">
          <el-input v-model="menuInfo.path" />
        </el-form-item>
        <el-form-item label="Redirect" prop="redirect">
          <el-input v-model="menuInfo.redirect" />
        </el-form-item>
        <el-form-item label="Icon" prop="icon">
          <el-input v-model="menuInfo.icon" />
        </el-form-item>
        <el-form-item label="Affix" prop="affix">
          <el-input v-model="menuInfo.affix" placeholder="不为空时该菜单在标签行不可关闭" />
        </el-form-item>
        <el-form-item label="Component" prop="component">
          <el-input v-model="menuInfo.component" placeholder="母菜单默认Layout" />
        </el-form-item>
        <el-form-item label="Sort" prop="sort">
          <el-input v-model.number="menuInfo.sort" />
        </el-form-item>
        <el-form-item label="父菜单" prop="menu_father_id">
          <el-select v-model="menuInfo.menu_father_id" filterable placeholder="请选择">
            <el-option v-for="item in menu_father_list" :key="item.menu_id" :label="item.path" :value="item.menu_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="dialogStatus=='create'" type="info" @click="resetForm('dataForm')">
          重置
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData('dataForm'):updateData('dataForm')">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import menuApi from '@/api/menu'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data () {
    return {
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: '-sort'
      },
      dialogFormVisible: false,
      dialogStatus: 'create',
      rules: {
        component: [{ required: true, message: 'component为必填项目', trigger: 'blur' }],
      },
      menuInfo: {
        menu_id: 0,
        title: '',
        name: '',
        path: '',
        redirect: '',
        icon: '',
        affix: '',
        component: '',
        sort: 0,
        menu_father_id: 0
      },
      menu_father_list: [],
    }
  },
  computed: {
    ...mapGetters([
      'info'
    ])
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listLoading = true
      menuApi.getList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.tableSelected = []
        this.listLoading = false
      })
      this.$nextTick(() => {
        this.$refs.menuTable.clearSelection()
      })
    },
    handleFilter () {
      this.listQuery.currentPage = 1
      this.fetchData()
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'sort') {
        this.sortByID(order)
      }
    },
    sortByID (order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+sort'
      } else {
        this.listQuery.sort = '-sort'
      }
      this.handleFilter()
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    resetMenuInfo () {
      this.menuInfo = {
        menu_id: 0,
        title: '',
        name: '',
        path: '',
        redirect: '',
        icon: '',
        affix: '',
        component: '',
        sort: 0,
        menu_father_id: 0
      }
    },

    handleCreate () {
      menuApi.menuFatherList().then(response => {
        this.menu_father_list = response.data
        this.menu_father_list.unshift({ "menu_id": 0, "path": "无" })
      })
      this.resetMenuInfo()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          menuApi.createMenu(this.menuInfo).then(() => {
            if (this.menuInfo.menu_father_id == 0) {
              this.fetchData()
            }
            this.updateLazyData()
            this.dialogFormVisible = false
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
    handleUpdate (row) {
      menuApi.menuFatherList().then(response => {
        this.menu_father_list = response.data
        this.menu_father_list.unshift({ "menu_id": 0, "path": "无" })
      })
      this.menuInfo = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          menuApi.updateMenu(this.menuInfo).then(() => {
            this.dialogFormVisible = false
            if (this.menuInfo.menu_father_id == 0) {
              const index = this.list.findIndex(v => v.menu_id === this.menuInfo.menu_id)
              this.list.splice(index, 1, this.menuInfo)
            } else {
              this.updateLazyData()
            }
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
    goDelete (row) {
      this.$confirm(`您是否要删除编号 ${row.menu_id} 的菜单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        menuApi.deleteMenu(row).then(() => {
          if (row.menu_father_id == 0) {
            this.fetchData()
          }
          this.updateLazyData()
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
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    getRowsKey (row) {
      return row.menu_id;
    },
    load (tree, treeNode, resolve) {
      menuApi.findMenuByFatherId(tree).then(res => {
        resolve(res.data)
      })
    },
    updateLazyData () {
      this.$set(this.$refs["menuTable"].store.states, "lazyTreeNodeMap", {})
      this.$set(this.$refs["menuTable"].store.states, "treeData", {})
    }
  }
}
</script>