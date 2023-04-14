import { api } from 'boot/axios'
import { useQuasar } from 'quasar'



export default function userService() {

    const $alert = useQuasar()

    type User = {
        id: number; 
        name: string; 
        email: string; 
        gender: string;
        status: string;
    }


    const createrUser = async <User>(data:[]) =>{

    }

    const deleteUser = async (idUser:number ) =>{
        /*try{
            await api.get('users')
                .then( (resp) => )
        }catch (error){
            console.log(error);   
            return error;         
        }/** */
    }

    const updateUser = async <User>(data:[], idUser:number ) =>{

    }

    const getUser = async <User>() => {
       
        try{
            let dados:any;
            await api.get('users')
                .then( (resp) => dados = resp.data.data)
                .catch((error) => console.log(error));
            return dados;
        }catch (error){
            return error;         
        }
    }

    return{
        createrUser,
        deleteUser,
        updateUser,
        getUser
    }
}