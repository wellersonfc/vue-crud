<template>
  <q-page padding="">
    <q-form
      @submit="onSubmit"
      class="row q-col-gutter-sm"
    >
      <q-input
          filled
          v-model="form.name"
          label="Nome do usuario*"
          lazy-rules
          type="text"
          class="col-lg-6 col-xs-12"
          :rules="[ val => val && val.length > 0 && val.length < 191|| 'Favor digitar o nome do usuario']"
        />
        <q-input
          filled
          v-model="form.email"
          label="Digite o email do usuario*"
          lazy-rules
          type="email"
          class="col-lg-6 col-xs-12"
          :rules="[ val => val && val.length > 0 && val.length < 191  || 'Favor digitar o nome do usuario']"
        />
        <q-select
          filled
          v-model="form.gender"
          label="Genero do  usuario"
          :options="generoOptions"
          style="width: 250px"
          behavior="dialog"
          emit-value
          map-options
        />
        <q-select
          filled
          v-model="form.status"
          label="Satus do usuario no sistema"
          :options="statusOptions"
          style="width: 250px"
          behavior="dialog"
          emit-value
          map-options
        />

        <div class="col-12">
          <q-btn label="Cadastrar" color="positive" class="float-right" type="submit"/>
        </div>
    </q-form>

  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import userService from 'src/composables/UserService'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'FormUsuario',
  setup () {
    const userServices = userService()
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()

    const generoOptions = [
      {
        label: 'Masculino',
        value: 'male'
      },
      {
        label: 'Feminino',
        value: 'female'
      }
    ]

    const statusOptions = [
      {
        label: 'Ativo',
        value: 'active'
      },
      {
        label: 'Inativo',
        value: 'inactive'
      }
    ]

    const form = ref({
      name: '',
      email: '',
      gender: '',
      status: ''
    })

    onMounted(async () => {
      if (route.params.id) {
        getUserid(route.params.id)
      }
    })

    const onSubmit = async () => {
      try {
        if (route.params.id) {
          await userServices.updateUser(route.params.id, form.value)
          $q.notify({
            color: 'positive',
            message: 'Usuário atualizado com sucesso!'
          })
        } else {
          await userServices.createrUser(form.value)
          $q.notify({
            color: 'positive',
            message: 'Usuário cadastrado com sucesso!'
          })
        }
        router.push({ name: 'home' })
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: error.message
        })
      }
    }

    const getUserid = async (id) => {
      const dados = await userServices.getUserId(route.params.id)
      form.value = dados
    }

    return {
      form,
      generoOptions,
      statusOptions,
      onSubmit
    }
  }
})
</script>
