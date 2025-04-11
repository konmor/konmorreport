<template>
  <div class="sql-editor-container">
    <!-- 标题 -->
    <h3>SQL 输入框</h3>

    <!-- SQL 文本输入框 -->
    <a-textarea
      v-model:value="sqlCode"
      placeholder="请输入 SQL 查询语句..."
      :rows="10"
      class="sql-textarea"
      @input="handleInput"
    />

    <!-- 按钮 -->
    <div class="button-container">
      <a-button type="primary" @click="executeQuery">执行查询</a-button>
      <a-button @click="clearQuery">清空</a-button>
    </div>

    <!-- 输出结果 -->
    <div v-if="queryResult" class="result-container">
      <h4>查询结果：</h4>
      <pre>{{ queryResult }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 响应式数据
const sqlCode = ref(''); // 用户输入的 SQL 代码
const queryResult = ref(null); // 查询结果

// 处理输入事件（可选）
const handleInput = (event) => {
  console.log('用户输入的内容:', event.target.value);
};

// 执行查询
const executeQuery = () => {
  // 这里可以调用后端 API 或模拟查询结果
  console.log('执行查询:', sqlCode.value);

  // 模拟返回查询结果
  queryResult.value = {
    rows: [
      { id: 1, name: '张三', age: 25 },
      { id: 2, name: '李四', age: 30 },
    ],
  };
};

// 清空输入框
const clearQuery = () => {
  sqlCode.value = '';
  queryResult.value = null;
};
</script>

<style scoped>
.sql-editor-container {
  padding: 20px;
}

.sql-textarea {
  font-family: 'Courier New', Courier, monospace; /* 设置等宽字体 */
  font-size: 14px;
  line-height: 1.5;
}

.button-container {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.result-container {
  margin-top: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.result-container pre {
  white-space: pre-wrap; /* 自动换行 */
  word-break: break-all; /* 长单词自动换行 */
}
</style>