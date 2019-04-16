<template>
  <ul>
    <li v-for="todo in todos" :key="todo.text">
      <input type="checkbox" :checked="todo.done" @change="toggle(todo)">
      <span :class="{ done: todo.done }">{{ todo.text }}</span>
    </li>
    <li>
      <input placeholder="Qu'est-ce qui doit être fait ?" @keyup.enter="addTodo">
    </li>
  </ul>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  mounted() {},
  computed: {
    todos() {
      return this.$store.state.todos.list;
    },
    ...mapState({
      list: state => state.todos.list
    })
  },
  methods: {
    addTodo(e) {
      this.$store.commit("todos/add", e.target.value);
      e.target.value = "";
    },
    ...mapMutations({
      toggle: "todos/toggle"
    })
  }
};
</script>

<style>
.done {
  text-decoration: line-through;
}
</style> 