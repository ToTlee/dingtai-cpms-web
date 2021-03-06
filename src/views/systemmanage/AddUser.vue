

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
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色:" required>
            <el-select multiple collapse-tags v-model="userInfo.info.roleId" placeholder="请选择">
              <el-option
                v-for="item in allRoles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
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
import { ClientDataVue } from "@/client-api";
import {
  userApi,
  AddUserReq,
  UpdateUserReq,
  Result,
  roleApi,
  GetRoleInfoResp,
  PageInfoGetRoleInfoResp
} from "@/client-api";
import { UserCreator, UserInfo } from "./UserInfo";
import Component, { createDecorator } from "vue-class-component";
import { Emit, Prop, PropSync } from "vue-property-decorator";

@Component
export default class AddUser extends ClientDataVue {
  @Prop({ default: undefined })
  info?: UserInfo;
  allRoles?: Array<GetRoleInfoResp> = [];
  async mounted() {
    let result = await this.getData<PageInfoGetRoleInfoResp>(() =>
      roleApi.listRoleInfoUsingGET()
    );
    this.allRoles = result?.list;
    debugger;
  }
  isSearching = false;
  get userInfo(): UserInfo {
    let info = new UserInfo(UserCreator.createEmptyUser());
    if (this.info) {
      //编辑信息
      info.info = UserCreator.copyUser(this.info.info);
      debugger;
    }
    return ClientDataVue.observable(info);
  }

  @Emit()
  submit() {
    return this.userInfo;
  }

  @Emit()
  cancel() {}

  async saveUser() {
    let currentInfo = this.userInfo.info!;
    let result = false;
    if (this.info) {
      let data: UpdateUserReq = {
        id: currentInfo.id!,
        mobile: currentInfo.mobile!,
        email: currentInfo.email!,
        realName: currentInfo.realName!,
        roleId: currentInfo.roleId!
      };
      result = await this.requestWithoutResult(() =>
        userApi.updateUserUsingPOST(data)
      );
      if (result) {
        this.$message.success("操作成功");
        this.submit();
      }
    } else {
      //添加
      let data: AddUserReq = {
        userName: currentInfo.userName!,
        mobile: currentInfo.mobile!,
        email: currentInfo.email!,
        realName: currentInfo.realName!,
        roleId: currentInfo.roleId!
      };

      result = await this.requestWithoutResult(() =>
        userApi.addUserUsingPOST1(data)
      );
      if (result) {
        this.$message.success("操作成功");
        this.submit();
      }
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
  private async commitUser(
    contractCallback: (...para: any) => Promise<Result>
  ): Promise<boolean> {
    let data = this.userInfo;
    let result = await this.requestWithoutResult(contractCallback);

    return result;
  }

  getDate(value: Date | string) {
    if (value instanceof Date) {
      return value.date();
    }
    return new Date(value).date();
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
