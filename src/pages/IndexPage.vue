<template>
  <q-page class="padding">
    <div class="q-pa-md">
    <q-table
      title="Usuários do sistema"
      :rows="rows"
      :columns="columns"
      row-key="name">
      <template v-slot:top>
        <span class="text-h5">Usuários do sistema</span>
        <q-space />
        <q-btn  size="sm" color="positive" label="Cadastrar usuários" :to="{name:'formularioUsuario'}"></q-btn>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn icon="delete" dense size="sm" margin="2em" color="negative"  @click="excluirUsuario(props.row.id)"></q-btn>
          <q-btn icon="edit" color="blue" dense size="sm" @click="editarUsuario(props.row.id)"></q-btn>
          <q-btn icon="toggle_on" color="orange" dense size="sm" @click="alterarStatus(props.row.id, props.row.status)"></q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
  </q-page>
</template>

<script lang="ts">

import { defineComponent, ref, onMounted } from 'vue'
import userService from 'src/composables/UserService'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'IndexPage',
  setup () {
    const userServices = userService()
    const rows = ref([])
    const $q = useQuasar()
    const router = useRouter()

    const columns = [
      { name: 'actions', label: '', field: 'actions', sortable: true, aling: 'rigth' },
      { name: 'id', label: 'Identificação', field: 'id', sortable: true },
      { name: 'name', label: 'Nome', field: 'name', sortable: true },
      { name: 'email', label: 'E-mail', field: 'email', sortable: true },
      { name: 'gender', label: 'Gênero', field: 'gender', sortable: true },
      { name: 'status', label: 'Status no Sistema', field: 'status', sortable: true }
    ]

    onMounted(() => {
      montandoLista()
    })

    const montandoLista = async () => {
      try {
        rows.value = await userServices.getUser()
      } catch (error) {
        console.log(error)
      }
    }

    const excluirUsuario = async (idUser:number) => {
      $q.dialog({
        title: 'Excluir Usuário',
        message: 'Tem certeza que deseja excluir este usuário?',
        ok: 'Sim',
        cancel: 'Não'
      }).onOk(async () => {
        try {
          await userServices.deleteUser(idUser)
          await montandoLista()
          $q.notify({ message: 'O usuario foi removido com sucesso! ', type: 'positive' })
        } catch (error) {
          console.log(error)
          $q.notify({ message: 'Nao foi possivel remover com sucesso! ', type: 'negative' })
        }
      })
    }

    const editarUsuario = (id:number) => {
      router.push({ name: 'formularioUsuario', params: { id } })
    }

    const alterarStatus = async (idUser:number, status:any) => {
      console.log(idUser, status)
      if (status === 'active') {
        status = 'inactive'
      } else {
        status = 'active'
      }
      try {
        await userServices.updateUser(idUser, { status })
        $q.notify({
          color: 'positive',
          message: 'Status do usuário atualizado com sucesso!'
        })
        await montandoLista()
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: error.message
        })
      }
    }

    return {
      columns,
      rows,
      excluirUsuario,
      editarUsuario,
      alterarStatus
    }
  }
})
</script>
