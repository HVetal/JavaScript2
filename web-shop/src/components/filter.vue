<template>
    <div>
        <input v-model="searchString" type="text" />
    </div>
</template>

<script>
export default {
    name: 'sort',
    computed: {
        searchString: {       
            get() { return this.$store.getters.getSearchString },
            set(value) { this.$store.commit('setSearchString', value)}
        }
    },
}
</script>