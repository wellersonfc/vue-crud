import { api } from 'boot/axios'

export default function userService () {
    type User = {
        id: number;
        name: string;
        email: string;
        gender: string;
        status: string;
    }

    const createrUser = async (dados:any) => {
      try {
        await api.post('users', dados)
          .then((resp) => console.log(resp))
          .catch((error) => console.log(error))
      } catch (error) {
        console.log(error)
      }/** */
    }

    const deleteUser = async (idUser:number) => {
      console.log('entrei', idUser)

      try {
        await api.delete(`users/${idUser}`)
          .then((resp) => console.log(resp))
          .catch((error) => console.log(error))
      } catch (error) {
        console.log(error)
        return error
      }
    }

    const updateUser = async (idUser:number, dados:any) => {
      try {
        await api.put(`users/${idUser}`, dados)
          .then((resp) => console.log(resp))
          .catch((error) => console.log(error))
      } catch (error) {
        console.log(error)
      }
    }

    const getUser = async () => {
      try {
        let dados:any
        await api.get('users')
          .then((resp) => dados = resp.data.data)
          .catch((error) => console.log(error))
        return dados
      } catch (error) {
        return error
      }
    }

    const getUserId = async (idUser:number) => {
      try {
        let dados:any
        await api.get(`users/${idUser}`)
          .then((resp) => dados = resp.data.data)
          .catch((error) => console.log(error))
        return dados
      } catch (error) {
        return error
      }
    }

    return {
      createrUser,
      deleteUser,
      updateUser,
      getUser,
      getUserId
    }
}
