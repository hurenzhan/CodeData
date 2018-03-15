<template>
    <div class="login-wrap">
        <div class="title">后台管理系统</div>
        <div class="box">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="submit">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min:5,message:'用户名必须大于5位',trigger:'blur,change'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min:6, message: '密码必须大于6位',trigger: 'blur,change'}
                    ]
                }
            }
        },
        methods: {
            submitForm (formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$ajax.post('/login',self.ruleForm)
                            .then(function(res){
                                if(res.data !== false){
                                    localStorage.setItem('ms_username',res.data);
                                    self.$router.push('/index.html')
                                }else{
                                    self.$message.error('账号或密码错误！')
                                }
                            })
                            .catch(function(err){
                                self.$message('网络错误！请联系管理员')
                            });
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>

<style scoped>
    @import "../assets/css/page/login.css";
</style>
