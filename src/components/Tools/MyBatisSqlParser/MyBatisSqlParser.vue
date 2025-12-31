<script setup lang="ts">
import { reactive } from 'vue'
import DetailHeader from '@/components/Layout/DetailHeader/DetailHeader.vue'
import ToolDetail from '@/components/Layout/ToolDetail/ToolDetail.vue'
import { copy } from '@/utils/string';
import { Codemirror } from "vue-codemirror";
import '@codemirror/search';
import '@codemirror/state';
import '@codemirror/commands';
import { ElMessage } from 'element-plus';

const info = reactive({
  title: "MyBatis SQL 解析器",
  code: '',
  parsedResult: '',
  isParseErr: false,
  parseErr: '',
  paramWrapper: '',
})

interface Parameter {
  value: string;
  type: string;
}

// 解析参数行，使用正则提取形如 value(type) 的参数
const parseParameters = (parametersStr: string): Parameter[] => {
  const params: Parameter[] = [];
  const regex = /([^,]+?)\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(parametersStr)) !== null) {
    params.push({
      value: match[1].trim(),
      type: match[2].trim()
    });
  }
  return params;
}

// 根据参数数组依次替换 SQL 语句中的问号
const replaceParameters = (sql: string, parameters: Parameter[]): string => {
  const sqlParts = sql.split("?");
  let resultSQL = sqlParts[0];
  for (let i = 0; i < parameters.length; i++) {
    const param = parameters[i];
    let paramValue = param.value;

    // 应用自定义包裹符（如果有输入）
    if (info.paramWrapper) {
      paramValue = info.paramWrapper + paramValue + info.paramWrapper;
    } else {
      // 默认包裹规则：String和Timestamp用单引号，其他不用
      if (param.type === "String" || param.type === "Timestamp") {
        paramValue = "'" + paramValue + "'";
      }
    }

    resultSQL += paramValue;
    resultSQL += sqlParts[i + 1];
  }
  return resultSQL;
}

// 解析 MyBatis 日志
const parseSql = () => {
  try {
    const textVa = info.code.trim();
    if (!textVa) {
      ElMessage.warning('请输入 MyBatis SQL 日志内容');
      return;
    }

    const sqlStatements: string[] = [];
    const lines = textVa.split("\n");
    let currentSQL = "";
    let parametersList: Parameter[][] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // 查找包含 "==>  Preparing: " 的行，提取SQL语句
      const preparingIndex = line.indexOf("==>  Preparing: ");
      if (preparingIndex !== -1) {
        // 如果前面有 SQL 且存在参数，则生成结果
        if (currentSQL !== "" && parametersList.length > 0) {
          parametersList.forEach(function(params) {
            sqlStatements.push(replaceParameters(currentSQL, params));
          });
        }
        currentSQL = line.substring(preparingIndex + "==>  Preparing: ".length).trim();
        parametersList = [];
      }

      // 查找包含 "==> Parameters: " 的行，提取参数
      const parametersIndex = line.indexOf("==> Parameters: ");
      if (parametersIndex !== -1) {
        const paramsStr = line.substring(parametersIndex + "==> Parameters: ".length).trim();
        const params = parseParameters(paramsStr);
        if (params.length > 0) {
          parametersList.push(params);
        }
      }
    }
    // 最后一条 SQL
    if (currentSQL !== "" && parametersList.length > 0) {
      parametersList.forEach(function(params) {
        sqlStatements.push(replaceParameters(currentSQL, params));
      });
    }

    info.parsedResult = sqlStatements.join("\n\n");
    info.isParseErr = false;
    ElMessage.success('解析完成');
  } catch (error) {
    info.isParseErr = true;
    info.parseErr = (error as Error).message;
    ElMessage.error('解析失败');
  }
}

// 清空输入框
const clear = () => {
  info.code = '';
  info.parsedResult = '';
  info.isParseErr = false;
  info.parseErr = '';
  info.paramWrapper = '';
}

const copyRes = async () => {
  copy(info.parsedResult);
}
</script>

<template>
  <div class="flex flex-col mt-3 flex-1">
    <DetailHeader :title="info.title"></DetailHeader>

    <div class="p-4 rounded-2xl bg-white ">

      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">输入 MyBatis SQL 日志</h3>
        <codemirror
          v-model="info.code"
          placeholder="请输入 MyBatis SQL 日志"
          :style="{ height: '300px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tabSize="2"
        />
      </div>

      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">解析为可执行 SQL</h3>
        <codemirror
          v-model="info.parsedResult"
          placeholder="解析结果将显示在这里..."
          :style="{ height: '300px' }"
          :read-only="true"
          :indent-with-tab="true"
          :tabSize="2"
        />
      </div>

      <div class="mt-4 flex items-center gap-2">
        <el-input
          v-model="info.paramWrapper"
          placeholder="自定义参数包裹符（留空使用默认规则）"
          style="width: 300px"
          title="自定义参数包裹符，留空则使用默认规则：String和Timestamp用单引号，Integer等其他类型不用包裹"
        />
        <el-button type="primary" @click="clear">清空</el-button>
        <el-button type="primary" @click="parseSql">解析 SQL</el-button>
        <el-button type="primary" @click="copyRes">复制 SQL</el-button>
      </div>

      <div class="mt-3 min-h-md bg-red-100 p-3 mb-3" v-show="info.isParseErr">
        <el-text type="danger">{{ info.parseErr }}</el-text>
      </div>
    </div>

    <!-- desc -->
    <ToolDetail title="描述">
      <el-text>
        MyBatis SQL 解析器，用于解析 MyBatis 日志，将带有占位符的 SQL 和参数转换为可直接执行的 SQL 语句
      </el-text>
    </ToolDetail>

  </div>
</template>

<style scoped>
</style>
