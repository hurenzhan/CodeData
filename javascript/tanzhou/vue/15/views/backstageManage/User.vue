<template>
  <page-wrap>
    <!-- 搜索栏 -->
    <search-wrap>
        <el-form ref="form" :model="searchData" label-width="100px" size="mini">
            <el-row :gutter="21">
                <el-col :span="8">
                    <div class="bg">
                        <el-form-item label="用户名：">
                            <el-input v-model="searchData.user_name" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="bg">
                        <el-form-item label="用户ID：">
                            <el-input v-model="searchData.user_id" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-form-item label-width="0">
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button type="danger" @click="onClear">清空</el-button>
                        <el-button type="success" @click="addUser = true">添加</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </search-wrap>

    <!-- dialog -->
    <el-dialog title="添加用户" :visible.sync="addUser" width="30%" size="mini" center>
      <el-form size="small" :model="addUserForm" :rules="rules" ref="addUserForm">
        <el-form-item prop="user_name" label="用户名称：" label-width="100px">
          <el-input v-model="addUserForm.user_name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="login_name" label="登录名称：" label-width="100px">
          <el-input v-model="addUserForm.login_name" placeholder="登录名"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email" label-width="100px">
            <el-input v-model="addUserForm.email" placeholder="电子邮箱" @keyup.enter.native="onAdd('addUserForm')"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password" label-width="100px">
            <el-input v-model="addUserForm.password" placeholder="登录密码" type="password" @keyup.enter.native="onAdd('addUserForm')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="addUser = false">取 消</el-button>
          <el-button size="small" type="primary" @click="onAdd('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="editUser" width="30%" size="mini" center>
        <el-form size="small" :model="editUserForm" ref="editUserForm">
            <el-form-item label="用户名称" prop="user_name" label-width="100px">
                <el-input v-model="editUserForm.user_name" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email" label-width="100px">
                <el-input v-model="editUserForm.email" placeholder="电子邮箱"></el-input>
            </el-form-item>
            <el-form-item label="修改密码" prop="password" label-width="100px">
                <el-input v-model="editUserForm.password" placeholder="修改密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password" label-width="100px">
                <el-input v-model="editUserForm.repassword" type="password" placeholder="确认密码" @keyup.enter.native="onEdit('editUserForm')"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="editUser = false">取 消</el-button>
            <el-button size="small" type="primary" @click="onEdit('editUserForm')">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 表格 -->
    <table-wrap>
        <el-table
          ref="table"
          :data="tableData"
          size="mini"
          :height="tabTableHeight">
            <el-table-column
              label="员工编号"
              sortable
              prop="user_id">
            </el-table-column>
            <el-table-column
             label="账号名称"
             prop="login_name">
            </el-table-column>
            <el-table-column
              label="人员名称"
              prop="user_name">
            </el-table-column>
            <el-table-column
              label="人员状态"
              prop="status">
            </el-table-column>
            <el-table-column
              label="电子邮箱"
              prop="email">
            </el-table-column>
            <el-table-column label="操作" header-align="center">
                <template slot-scope="scope">
                    <el-button type="text" plain size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" plain size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </table-wrap>

    <!-- 分页 -->
    <pagination-wrap>
        <new-pagination
                :total="paginationData.total"
                :propCurrentPage="paginationData.currentPage"
                @initPaginationData="showPaginationData"
                @handleSizeChange="showSizeChange"
                @handleCurrentChange="showCurrentChange"
        />
    </pagination-wrap>
  </page-wrap>
</template>

<script>
  import PageWrap from './../../components/pageStructure/PageWrap.vue'
  import SearchWrap from './../../components/pageStructure/SearchWrap.vue'
  import TableWrap from './../../components/pageStructure/TableWrap.vue'
  import paginationWrap from './../../components/pageStructure/paginationWrap.vue'
  import NewPagination from './../../components/base/NewPagination.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      PageWrap, SearchWrap, TableWrap, paginationWrap, NewPagination
    },
    data () {
      return {
        searchData: {
          user_name: '',
          user_id: '',
        },
        addUserForm:{
          user_name: '',
          login_name: '',
          email: '',
          password: '',
        },
        editUserForm:{
          user_name: '',
          repassword: '',
          email: '',
          password: '',
        },
        userid:'',
        tableData: [],
        rules: {
          login_name: [
            {required: true, message: '请输入登录名', trigger: 'blur'},
            {min:5,message:'登录名必须大于5位',trigger:'blur,change'}
          ],
          user_name: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min:5,message:'用户名必须大于5位',trigger:'blur,change'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min:6, message: '密码必须大于6位',trigger: 'blur,change'}
          ],
          email: [
            {type:'email',message:'请输入标准邮箱地址',trigger:'blur,change'}
          ],
        },
        paginationData: {},
        addUser: false,
        editUser: false
      }
    },
    computed: {
      ...mapState('navTabs',[
          'tabTableHeight'
      ])
    },
    mounted () {
      this.initSearchData()
      this.onSubmit()
    },
    methods: {
        initSearchData () {
            this.searchData.user_name = '';
            this.searchData.user_id = '';
        },
        showPaginationData (data) {
            this.paginationData.pageSizes = data.pageSizes
            this.paginationData.pageSize = data.pageSize
            this.paginationData.currentPage = data.currentPage
        },
        onSubmit (action) {
            let that = this
            if (action !== 'changeCurrentPage') {
              that.paginationData.currentPage = 1
            }
            if (action !== 'changeSort' && action !== 'changeCurrentPage') {
              that.$refs.table.clearSort()
            }
            this.$ajax.post('/userinfo/index', {search: this.searchData, page: this.paginationData})
            .then(function (res) {
                if (res.data !== undefined) {
                    that.tableData = res.data.tableData
                    that.paginationData.total = res.data.total
                }
            })
            .catch(function(err) {
            })
        },
        onClear () {
            this.initSearchData()
            this.onSubmit()
        },
        onAdd (formName) {
            const self = this;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    self.$ajax.post('/userinfo/add',self.addUserForm)
                        .then(function(res){
                            if(res.status == 200){
                                self.$message({
                                    message: res.data,
                                    type: 'success'
                                });
                            }
                            self.addUserForm.user_name = '';
                            self.addUserForm.login_name = '';
                            self.addUserForm.password = '';
                            self.addUserForm.email = '';
                            self.addUser = false;
                            self.onSubmit();
                        })
                        .catch(function(err){
                            self.$message.error('添加用户错误，请重试!');
                            self.addUserForm.user_name = '';
                            self.addUserForm.login_name = '';
                            self.addUserForm.password = '';
                            self.addUserForm.email = '';
                            self.addUser = false;
                        });
                } else {
                    return false
                }
            });
        },
        onEdit (formName) {
            const self = this;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    if(self.editUserForm.user_name.length < 5 ){
                        self.$message.error('用户名需大于5位!');
                        return false;
                    }
                    if(self.editUserForm.password.length < 6 ){
                        self.$message.error('密码需大于6位!');
                        return false;
                    }
                    if(self.editUserForm.repassword !== self.editUserForm.password){
                        self.$message.error('两次密码不一致!');
                    }else{
                        self.$ajax.post('/userinfo/edit',{"data":self.editUserForm,"userid":self.userid})
                            .then(function(res){
                                if(res.status === 200){
                                    self.$message({
                                        message: '编辑用户成功',
                                        type: 'success'
                                    });
                                }
                                self.editUserForm.user_name = '';
                                self.editUserForm.repassword = '';
                                self.editUserForm.password = '';
                                self.editUserForm.email = '';
                                self.editUser = false;
                                self.onSubmit();
                            })
                            .catch(function(err){
                                self.$message.error('编辑用户错误，请重试!');
                                self.editUserForm.user_name = '';
                                self.editUserForm.repassword = '';
                                self.editUserForm.password = '';
                                self.editUserForm.email = '';
                                self.editUser = false;
                            });
                    }
                } else {
                    return false
                }
            });
        },
        handleEdit (index, row) {
            this.editUser = true;
            this.userid = row['user_id'];
            this.editUserForm.user_name = row["user_name"];
            this.editUserForm.email = row["email"];
        },
        handleDelete (index, row) {
            var that = this
            this.$ajax.post('/userinfo/delete', {user_id:row["user_id"]})
                .then(function (res) {
                    if (res.status === 200) {
                        that.$message({
                            message: res.data,
                            type: 'success'
                        });
                        that.onSubmit();
                    }else{
                        that.$message({
                            message: res.data,
                            type: 'error'
                        });
                    }
                })
                .catch(function(err) {
                    self.$message.error('删除用户错误，请重试!');
                })
        },
        showSizeChange (val) {
            this.paginationData.pageSize = val
            this.onSubmit()
        },
        showCurrentChange (val) {
            this.paginationData.currentPage = val
            this.onSubmit('changeCurrentPage')
        }
    }
  }
</script>
