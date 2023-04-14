<template>
  <q-page class="padding">
    <div class="q-pa-md">
    <q-table
      title="Usuarios do sis"
      :rows="rows"
      :columns="columns"
      row-key="name">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="delete" dense size="sm" margin="2em" @click="roewsDeleter.deleteUser(props.row.id)"></q-btn>
          <q-btn icon="edit" dense size="sm" ></q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
  </q-page>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import userService from 'src/composables/UserService'
import { useQuasar } from 'quasar'



const columns = [
{ name: 'actions', label: '', field: 'actions', sortable: true, aling: 'rigth' },
  { name: 'id', label: 'Identificação', field: 'id', sortable: true },
  { name: 'name', label: 'Nome', field: 'name', sortable: true },
  { name: 'email', label: 'E-mail', field: 'email', sortable: true },
  { name: 'gender', label: 'Gênero', field: 'gender', sortable: true },
  { name: 'status', label: 'Status no Sistema', field: 'status', sortable: true }
]

const rows = await userService().getUser();
const roewsDeleter = await userService();




export default defineComponent({
  name: 'IndexPage',
  setup () {

    return {
      columns,
      rows,
      roewsDeleter
    }
  }
})
</script>
