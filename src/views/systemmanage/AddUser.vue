

<template>
  <div class="form-root">
    <el-form label-width="100px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户账号:" required>
            <el-input v-model="userInfo.info.userName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="真实姓名:" required>
            <el-input v-model="userInfo.info.realName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号:" required>
            <el-input v-model="userInfo.info.mobile"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="邮箱:" required>
            <el-input v-model="userInfo.info.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item size="normal">
        <el-button type="primary" @click="saveUser">保存</el-button>
        <el-button @click="cancelUser">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ClientDataVue } from "@/client/client-types";
import { userApi, AddUserReq } from "@/client/data-provider";
import { UserCreator, UserInfo } from "./UserInfo";
import Component, { createDecorator } from "vue-class-component";
import { Emit } from "vue-property-decorator";
@Component
export default class AddUser extends ClientDataVue {
  info?: UserInfo;
  isSearching = false;
  get userInfo(): UserInfo {
    let info = new UserInfo(UserCreator.createEmptyUser());
    if (this.info) {
      //编辑信息
      info.info = UserCreator.copyUser(this.info.info);
    }
    return ClientDataVue.observable(info);
  }

  @Emit()
  submit() {
    if (this.info) {
      this.info = this.userInfo;
      return undefined;
    } else {
      return this.userInfo;
    }
  }

  @Emit()
  cancel() {}

  async saveUser() {
    let vm = this;
    let result = false;
    let cinfo = this.userInfo.info!;
    if (this.info) {
    } else {
      //添加
      let data: AddUserReq = {
        userName: cinfo.userName!,
        mobile: cinfo.mobile!,
        email: cinfo.email!,
        realName: cinfo.realName!,
        roleId: [1, 2]
      };

      result = await this.requestWithoutResult(() =>
        userApi.addUserUsingPOST1(data)
      );
    }
    if (result) {
      this.$message.success("添加成功");
      this.submit();
    }
  }

  cancelUser() {
    let vm = this;
    this.$msgbox
      .confirm("是否放弃当前编辑内容?")
      .then(() => {
        vm.cancel();
      })
      .catch(() => {});
  }
}
</script>

<style lang="scss" scoped>
@import "@/element-variables.scss";

.form-root {
  width: 660px;
  text-align: left;
  max-height: 700px;
  overflow: auto;
}
.form-root .el-form-item {
  margin-bottom: 10px;
}
.info-header {
  font-size: 15px;
  color: $--color-primary;
}
.timeline {
  margin-top: 10px !important;
  padding: 0px !important;
}

.period-title {
  font-weight: bold;
}
.period-content {
  color: gray;
}
</style>