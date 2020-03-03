
<template>
  <div class="form-root">
    <el-form label-width="100px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色名称:" required>
            <el-input v-model="roleInfo.info.roleName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色描述:" required>
            <el-input v-model="roleInfo.info.roleDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item size="normal">
        <el-button type="primary" @click="saveRole">保存</el-button>
        <el-button @click="cancelRole">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ClientDataVue } from "@/client/client-types";
import {
  roleApi,
  AddRoleReq,
  UpdateRoleReq,
  Result
} from "@/client/data-provider";
import { RoleCreator, RoleInfo } from "./RoleInfo";
import Component, { createDecorator } from "vue-class-component";
import { Emit, Prop, PropSync } from "vue-property-decorator";
@Component
export default class AddRole extends ClientDataVue {
  @Prop({ default: undefined })
  info?: RoleInfo;
  isSearching = false;
  get roleInfo(): RoleInfo {
    let info = new RoleInfo(RoleCreator.createEmptyRole());
    if (this.info) {
      //编辑信息
      info.info = RoleCreator.copyRole(this.info.info);
    }
    return ClientDataVue.observable(info);
  }

  @Emit()
  submit() {
    return this.roleInfo;
  }

  @Emit()
  cancel() {}

  async saveRole() {
    let vm = this;
    let result = false;
    let cinfo = this.roleInfo.info!;
    if (this.info) {
      result = await this.commitRole(() => roleApi.updateRoleUsingPOST(cinfo!));
      if (result) {
        this.$message.success("修改成功");
        this.submit();
      } else {
        this.$message.success("修改失败");
      }
    } else {
      //添加
      let data: AddRoleReq = {
        roleName: cinfo.roleName!,
        roleDesc: cinfo.roleDesc!
      };

      result = await this.requestWithoutResult(() =>
        roleApi.addUserUsingPOST(data)
      );
    }
    if (result) {
      this.$message.success("添加成功");
      this.submit();
    } else {
      this.$message.success("添加失败");
    }
  }

  cancelRole() {
    let vm = this;
    this.$msgbox
      .confirm("是否放弃当前编辑内容?")
      .then(() => {
        vm.cancel();
      })
      .catch(() => {});
  }
  private async commitRole(
    contractCallback: (...para: any) => Promise<Result>
  ): Promise<boolean> {
    let data = this.roleInfo;
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
