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
        <template class="row q-col-gutter-sm">
          <q-select
            filled
            v-model="pesquisar.filter"
            label="Filtro"
            :options="generoOptionsfilters"
            style="width: 150px;"
            behavior="dialog"
            emit-value
            map-options
            size="sm"
            dense
          >
          <template v-slot:prepend>
            <q-icon name="filter_alt" />
          </template>
        </q-select>
        <q-input
            filled
            v-model="pesquisar.texto"
            label=""
            outlined
            lazy-rules
            bottom-slots
            type="email"
            dense
          />

          <q-btn icon="search" dense size="sm" color="pink"  style="width: 50px; height: 40px; margin-left: 10px; margin-top: 9px; padding: auto; text-align: center;" @click="buscarSevice()"></q-btn>
          <q-btn icon="recycling" dense size="sm" color="orange"  style="width: 50px; height: 40px; margin-left: 5px; margin-top: 9px; padding: auto; text-align: center;" @click="montandoLista()"></q-btn>
        </template>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn icon="delete" dense size="sm" margin="2em" color="negative"  @click="excluirUsuario(props.row.id)"></q-btn>
          <q-btn icon="edit" color="blue" dense size="sm" @click="editarUsuario(props.row.id)"></q-btn>
          <q-btn icon="toggle_on" color="orange" dense size="sm" @click="alterarStatus(props.row.id, props.row.status)"></q-btn>
        </q-td>
      </template>

    </q-table>
    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="pagination.page"
        color="grey-8"
        :max="pagesNumber"
        size="sm"
        @click="servecePaginacao()"
      />
    </div>
  </div>
  </q-page>
</template>

<script lang="ts">

import { defineComponent, ref, onMounted, computed } from 'vue'
import userService from 'src/composables/UserService'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { fileURLToPath } from 'url'

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

    const buscarSevice = async () => {
      if (pesquisar.value.filter === '' || pesquisar.value.texto === '') {
        $q.notify({
          color: 'negative',
          message: 'Favor adicionar os dados para fazer a busca!'
        })
      } else {
        try {
          const filtros = await userServices.getFilter(pesquisar.value.filter, pesquisar.value.texto)

          if (filtros.length <= 0) {
            $q.notify({
              color: 'negative',
              message: 'Não encontramos sua pesquisa'
            })
          } else {
            rows.value = filtros
            $q.notify({
              color: 'positive',
              message: 'Usuários encontrados com sucesso!'
            })
          }
        } catch (error) {
          console.log(error)
          $q.notify({
            color: 'negative',
            message: 'Não encontramos sua pesquisa'
          })
        }
      }
    }

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 2,
      rowsPerPage: 3
      // rowsNumber: xx if getting data from a server
    })

    const servecePaginacao = async () => {
      try {
        rows.value = await userServices.getPaginacao(pagination.value.page)
      } catch (error) {
        console.log(error)
      }
    }

    const pesquisar = ref({
      filter: '',
      texto: ''
    })

    const generoOptionsfilters = [
      {
        label: 'Nome',
        value: 'Name'
      },
      {
        label: 'E-mail',
        value: 'email'
      },
      {
        label: 'Gênero',
        value: 'gender'
      },
      {
        label: 'Status',
        value: 'status'
      }
    ]

    return {
      columns,
      rows,
      excluirUsuario,
      editarUsuario,
      alterarStatus,
      pagination,
      pagesNumber: computed(() => Math.ceil(rows.value.length / pagination.value.rowsPerPage)),
      servecePaginacao,
      generoOptionsfilters,
      pesquisar,
      buscarSevice,
      montandoLista
    }
  }
})
</script>
